// app/api/twilio-trigger/route.ts
// Next.js 15 route handler that simulates external systems triggering the Survey Bridge.
import { NextRequest, NextResponse } from 'next/server';
import { MASTER_AGENTS } from '@/types/data-matrix';

// Sleep helper to simulate network lag
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req: NextRequest) {
  try {
    // Attempt parse body elements
    let incomingPayload = { surveyText: '', sampleCalls: [] };
    try {
      const body = await req.json();
      incomingPayload = body || {};
    } catch {
      // Body not provided or blank
    }

    // Apply the 400ms network lag timer
    await sleep(400);

    // Filter or fetch logs - we will look at incomingPayload or build a sample list of 3 calls to demonstrate
    const callBatch = incomingPayload.sampleCalls && incomingPayload.sampleCalls.length > 0 
      ? incomingPayload.sampleCalls 
      : [
          { customer_phone: "+1 (555) 012-3456", agent_extension: "102", call_duration_seconds: 320, delivery_status: "Sent" },
          { customer_phone: "+1 (555) 012-7890", agent_extension: "106", call_duration_seconds: 145, delivery_status: "Sent" },
          { customer_phone: "+1 (555) 012-9988", agent_extension: "112", call_duration_seconds: 180, delivery_status: "Sent" }
        ];

    // Filter incoming calls that meet our survey eligibility rules (status === 'Sent' and duration >= 120s)
    const eligibleCalls = callBatch.filter((c: any) => 
      c.delivery_status === 'Sent' && c.call_duration_seconds >= 120
    );

    const simulatedDispatches = eligibleCalls.map((call: any) => {
      // Cross-referencing extensions to resolve human representative names
      const matchedAgent = MASTER_AGENTS.find(agent => agent.extension === call.agent_extension);
      const agentName = matchedAgent ? matchedAgent.name : "Unknown Representative";

      const smsText = incomingPayload.surveyText || `Hi! Thank you for speaking with ${agentName}. Please rate your experience today on a scale of 1-5. Feedback is anonymous.`;

      // Log a simulated Twilio SMS dispatch event to stdout
      console.log(`[SIMULATED TWILIO DISPATCH]`);
      console.log(`  Recipient Phone: ${call.customer_phone}`);
      console.log(`  Agent Extension: ${call.agent_extension} (${agentName})`);
      console.log(`  Message Payload: "${smsText}"`);
      console.log(`  Network Operation: SUCCESS (0.0.0.0:0 simulated outbound route - twilio)`);

      return {
        recipient_phone: call.customer_phone,
        agent_extension: call.agent_extension,
        agent_name: agentName,
        sms_text: smsText,
        dispatched_at: new Date().toISOString(),
        delivery_channel: 'mock-twilio-carrier'
      };
    });

    return NextResponse.json({
      status: "success",
      message: `Survey Bridge operation simulated successfully over ${simulatedDispatches.length} active connection loops.`,
      dispatched_count: simulatedDispatches.length,
      simulated_carrier: "twilio-mock-gateway",
      dispatches: simulatedDispatches
    }, { status: 200 });

  } catch (error: any) {
    console.error("[TWILIO TRIGGER ERROR] Critical operational path failure:", error);
    return NextResponse.json({
      status: "error",
      message: "Direct trigger request aborted.",
      details: error?.message || String(error)
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
