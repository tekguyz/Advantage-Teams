import { NextResponse } from 'next/server';
import { IngestionDatabase } from '../../lib/db-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json({
      agents: await IngestionDatabase.getAgents(),
      telemetry: await IngestionDatabase.getTelemetry(),
      activities: await IngestionDatabase.getActivities(),
      surveys: await IngestionDatabase.getSurveys(),
      terminalLogs: await IngestionDatabase.getTerminalLogs()
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: "Failed to read database state",
      details: error?.message || String(error)
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { action } = await req.json();
    if (action === 'reset') {
      await IngestionDatabase.resetToOriginalState();
      return NextResponse.json({ 
        status: "success", 
        message: "State successfully rolled back to standard seeds." 
      }, { status: 200 });
    }
    return NextResponse.json({ status: "error", error: "Invalid action requested" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ status: "error", details: error?.message }, { status: 500 });
  }
}
