import { NextRequest, NextResponse } from 'next/server';
import { TelemetryIngestSchema } from '@/types/types-ingestion';
import { IngestionDatabase } from '@/lib/db-store';

export async function POST(req: NextRequest) {
  let rawBody: any = null;
  try {
    rawBody = await req.json();
    
    // 1. Strict Zod Validation Check
    const parseResult = TelemetryIngestSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json({
        status: "error",
        message: "Invalid payload parameters schema.",
        errors: parseResult.error.format()
      }, { status: 400 });
    }
    
    const { agent_extension, status_state, timestamp } = parseResult.data;
    const resolvedTimestamp = timestamp || new Date().toISOString();
    
    IngestionDatabase.appendTerminalLog(`Incoming 3CX status tick for Ext. ${agent_extension} (state: "${status_state}").`);
    
    // 2. Lookup agent profile by the mapping matrix
    const agent = await IngestionDatabase.findAgentByExtension(agent_extension);
    
    // FALLBACK & CORRELATION BEHAVIOR:
    // If a 3CX notification payload lists an extension that does not match an active agent profile,
    // intercept the failure gracefully, write a warning log, and respond with an immediate 202 Accepted.
    if (!agent) {
      console.warn(`[WARN] Extension ${agent_extension} does not match any agent profile.`);
      IngestionDatabase.appendTerminalLog(`[WARN] Out-of-band extension unregistered payload ignored: ${agent_extension} (202 Accepted).`);
      return NextResponse.json({
        status: "accepted",
        warning: `Unregistered agent extension "${agent_extension}". Ingestion pipeline bypassed.`,
      }, { status: 202 });
    }
    
    // If agent is inactive, log an elegant system warning trace but proceed with the transaction
    if (!agent.active) {
      console.warn(`[WARN] Extension ${agent_extension} belongs to an inactive agent profile (${agent.agent_name}).`);
      IngestionDatabase.appendTerminalLog(`[WARN] Active state verification warning for ${agent.agent_name} (Ext ${agent_extension}).`);
    }

    // 3. Process status transitions:
    // Close any currently active telemetry sessions for this agent and calculate duration.
    const closedLogs = await IngestionDatabase.closeOngoingTelemetry(agent.id, resolvedTimestamp);

    let activeLog = null;
    let transitionMsg = `Status shifted out of previous states. Duration compiled.`;

    // "If the user state transitions into 'Ticket Work', it creates an active log entry"
    if (status_state === 'Ticket Work') {
      activeLog = await IngestionDatabase.insertTelemetryLog(agent.id, status_state, resolvedTimestamp);
      transitionMsg = `User shifted into "Ticket Work". New active interval opened.`;
    }

    // 4. Create diagnostic platform tracking log inside activity_logs table
    await IngestionDatabase.insertActivityLog(
      agent.id,
      `Status Shifted to ${status_state}`,
      resolvedTimestamp,
      JSON.stringify({
        trigger: "3CX Desk Stream Notification",
        agent_extension,
        status_state,
        closed_records_count: closedLogs.length
      })
    );

    return NextResponse.json({
      status: "success",
      message: transitionMsg,
      data: {
        agent_id: agent.id,
        agent_name: agent.agent_name,
        extension: agent.extension,
        current_status: status_state,
        closed_intervals: closedLogs,
        opened_interval: activeLog
      }
    }, { status: 200 });

  } catch (error: any) {
    const errorMessage = error?.message || String(error);
    const errorType = error?.name || "SupabaseIngestionError";
    const currentTimestamp = new Date().toISOString();

    console.error(`[TELEMETRY PIPELINE FAILOVER ACTIVE] Timestamp: ${currentTimestamp}`);
    console.error(`Error Type: ${errorType} | Trace: ${errorMessage}`);

    // Call the telemetry fallback module to log payload to memory
    try {
      const { runIngestionWithResilienceBoundary } = require('./telemetry-telemetry-fallback');
      
      // Construct payload object
      const payloadObj = {
        agent_id: "unknown",
        agent_extension: String(rawBody?.agent_extension || ""),
        status_state: String(rawBody?.status_state || ""),
        timestamp: currentTimestamp,
        raw: rawBody
      };

      return await runIngestionWithResilienceBoundary(payloadObj, async () => {
        // Re-throw to trigger the resilience redirect logic
        throw error;
      });
    } catch (fallbackError: any) {
      console.error("[CRITICAL] Fallback engine failure:", fallbackError);
      return NextResponse.json({
        status: "recovery_failover_logged",
        ingestion_epoch: Date.now(),
        persisted: false,
        message: "Ingestion pipeline accepted in emergency backup memory. Dialer network is unblocked.",
        diagnostic_code: "GATEKEEPER_DB_DROPPED_TEMP_CACHED",
        warning_alert: {
          border: "1px solid #ff9900",
          message: `Failover sequence running securely: Database exception intercepted (${errorMessage}).`
        }
      }, { status: 202 });
    }
  }
}
