import { NextRequest, NextResponse } from 'next/server';
import { IngestionDatabase } from '../../lib/db-store';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const { action } = rawBody;

    if (action === 'dispatch') {
      IngestionDatabase.appendTerminalLog(`Force Batch Dispatch requested manually.`);
      const count = await IngestionDatabase.dispatchSurveys();
      return NextResponse.json({
        status: 'success',
        message: `Processed outbound dispatch immediately. ${count} survey queued triggers flashed.`,
        count
      }, { status: 200 });
    }

    if (action === 'updateProfile') {
      const { id, extension, zoho_user_id } = rawBody;
      if (!id || !extension || !zoho_user_id) {
        return NextResponse.json({
          status: 'error',
          message: 'Missing required parameters: id, extension, zoho_user_id'
        }, { status: 400 });
      }

      IngestionDatabase.appendTerminalLog(`Updating profile mapping for ID: ${id} to Extension: ${extension}, Zoho ID: ${zoho_user_id}`);
      const updatedAgent = await IngestionDatabase.updateAgentProfile(id, extension, zoho_user_id);
      
      // Also write an activity log for this mapping change
      await IngestionDatabase.insertActivityLog(
        id,
        `Profile Mapping Updated`,
        new Date().toISOString(),
        JSON.stringify({
          updated_extension: extension,
          updated_zoho_user_id: zoho_user_id,
          initiator: "Administrator Matrix Grid"
        })
      );

      return NextResponse.json({
        status: 'success',
        message: `Agent ${updatedAgent.agent_name} configuration persisted successfully.`,
        agent: updatedAgent
      }, { status: 200 });
    }

    return NextResponse.json({
      status: 'error',
      message: `Invalid action "${action}" requested.`
    }, { status: 400 });

  } catch (error: any) {
    console.error("[ERROR] /api/surveys handler failure:", error);
    return NextResponse.json({
      status: "error",
      message: "Failed to process survey dashboard operations.",
      details: error?.message || String(error)
    }, { status: 500 });
  }
}
