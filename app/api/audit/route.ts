import { NextRequest, NextResponse } from 'next/server';
import { IngestionDatabase } from '../../lib/db-store';
import { GeminiTimelineService } from '../../gemini-service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { agentId, durationMinutes, modelName } = await req.json();

    if (!agentId) {
      return NextResponse.json({
        status: "error",
        message: "agentId is required of the audit payload."
      }, { status: 400 });
    }

    // Gather live datastore states
    const agents = await IngestionDatabase.getAgents();
    const agent = agents.find(a => a.id === agentId);
    if (!agent) {
      return NextResponse.json({
        status: "error",
        message: `No agent found matching profile identifier: ${agentId}`
      }, { status: 404 });
    }

    const telemetry = await IngestionDatabase.getTelemetry();
    const activities = await IngestionDatabase.getActivities();

    // Filter telemetry slots & activities matching this specific technician
    const agentTelemetry = telemetry.filter(t => t.agent_id === agentId);
    const agentActivities = activities.filter(act => act.agent_id === agentId);

    // Compute total timeline duration in minutes from telemetry logs (or use override parameter)
    let finalDurationMinutes = durationMinutes;
    if (typeof finalDurationMinutes !== 'number' || finalDurationMinutes <= 0) {
      const sumSeconds = agentTelemetry.reduce((acc, t) => {
        if (typeof t.duration_seconds === 'number') {
          return acc + t.duration_seconds;
        }
        // Fallback for ongoing active status slot
        const startMs = new Date(t.start_timestamp).getTime();
        const nowMs = new Date('2026-05-27T03:19:54Z').getTime(); // Use current context ISO
        const diff = Math.max(0, Math.floor((nowMs - startMs) / 1000));
        return acc + diff;
      }, 0);
      finalDurationMinutes = Math.max(1, Math.round(sumSeconds / 60));
    }

    // Determine unique platform activity footprint
    const uniqueActionSet = new Set(agentActivities.map(a => a.platform_action_type.trim()));
    const uniqueActionsCount = uniqueActionSet.size;

    const rawActions = agentActivities.map(a => ({
      platform_action_type: a.platform_action_type,
      precise_action_timestamp: a.precise_action_timestamp,
      metadata: a.metadata
    }));

    // Trigger analysis running on Google Gemini Flash
    const activeModel = modelName || "gemini-3.5-flash";
    const result = await GeminiTimelineService.analyzeTimeline({
      totalDurationMinutes: finalDurationMinutes,
      uniqueActionsCount,
      rawActions
    }, activeModel);

    // Track operation audit log to db activities tracing pipeline
    await IngestionDatabase.appendTerminalLog(`Successfully completed AI productivity audit of Agent ${agent.agent_name} (Ext. ${agent.extension}) over ${finalDurationMinutes} minutes, Score assigned: ${result.productivityScore}%`);

    return NextResponse.json({
      status: "success",
      agentName: agent.agent_name,
      agentEx: agent.extension,
      metrics: {
        totalDurationMinutes: finalDurationMinutes,
        uniqueActionsCount,
        totalActionsCount: agentActivities.length
      },
      analysis: result
    }, { status: 200 });

  } catch (error: any) {
    console.error("[AUDIT ROUTE ERROR]:", error);
    return NextResponse.json({
      status: "error",
      message: "An internal server error occurred during audit orchestration.",
      details: error?.message || String(error)
    }, { status: 500 });
  }
}
