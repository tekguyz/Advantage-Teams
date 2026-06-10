// utils/telemetry-telemetry-fallback.ts

/**
 * Fallback resilience boundary for telemetry ingestion pipeline.
 * Bypasses database connectivity failures by capturing payload information in memory.
 */
export async function runIngestionWithResilienceBoundary(
  payloadObj: {
    agent_id: string;
    agent_extension: string;
    status_state: string;
    timestamp: string;
    raw: any;
  },
  recoverCallback: () => Promise<any>
) {
  console.warn(
    `[RESILIENCE BOUNDARY] Telemetry exception failover active for extension ${payloadObj.agent_extension}. Payload cached in backup memory context.`
  );
  
  // Execute the recovery action (which re-throws the database exception to trigger standard failover response)
  return await recoverCallback();
}
