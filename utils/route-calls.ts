import { NextRequest, NextResponse } from 'next/server';
import { CallIngestSchema } from '@/types/types-ingestion';
import { IngestionDatabase } from '@/lib/db-store';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();

    // 1. Strict Zod Validation Check
    const parseResult = CallIngestSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json({
        status: "error",
        message: "Invalid payload parameters schema.",
        errors: parseResult.error.format()
      }, { status: 400 });
    }

    const { customer_phone, duration_seconds, agent_extension } = parseResult.data;
    const nowStr = new Date().toISOString();

    IngestionDatabase.appendTerminalLog(`Receiving incoming 3CX call log summary. Customer: ${customer_phone}, duration: ${duration_seconds}s.`);

    // 2. Lookup agent profile by extension
    const agent = await IngestionDatabase.findAgentByExtension(agent_extension);

    // FALLBACK & CORRELATION BEHAVIOR:
    // If a 3CX notification payload lists an extension that does not match an active agent profile,
    // intercept the failure gracefully, write a warning log, and respond with an immediate 202 Accepted.
    if (!agent) {
      console.warn(`[WARN] Extension "${agent_extension}" does not match any agent profile.`);
      IngestionDatabase.appendTerminalLog(`[WARN] Out-of-band extension unregistered payload ignored: ${agent_extension} (202 Accepted).`);
      return NextResponse.json({
        status: "accepted",
        warning: `Unregistered agent extension "${agent_extension}". Processing bypassed.`,
      }, { status: 202 });
    }

    // 3. Process survey record entry:
    // Inserts the call reporting event, executing database-level suppression logic.
    // If call duration is < 120 seconds or if this number was already queued/surveyed within 24 hours,
    // the survey status is automatically flagged as 'suppressed' with description, otherwise marked 'pending'.
    const survey = await IngestionDatabase.insertSurvey(customer_phone, duration_seconds, agent_extension, nowStr);

    let responseMsg = "Call event successfully processed.";
    if (survey.status === 'suppressed') {
      responseMsg = `Call was processed but survey was suppressed. Reason: ${survey.suppression_reason}`;
    } else {
      responseMsg = "Call event validated and survey queued successfully (pending).";
    }

    return NextResponse.json({
      status: "success",
      message: responseMsg,
      data: survey
    }, { status: 200 });

  } catch (error: any) {
    console.error(`[ERROR] \`/api/calls\` handler fail:`, error);
    return NextResponse.json({
      status: "error",
      message: "An internal server error occurred while processing ingestion.",
      details: error?.message || String(error)
    }, { status: 500 });
  }
}
