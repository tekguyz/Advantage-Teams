"use server";

import { AutomatedSurveyEngine, AutomationExecutionReport } from '@/utils/survey-engine';
import { IngestionDatabase } from '@/lib/db-store';

/**
 * Executes a point-in-time relational survey batch aggregation.
 * No polling loops are run to conserve DB connection credits.
 * Evaluates pending surveys, applies 24-hr sliding window deduplication,
 * resolves technician profiles, packages staged SMS outbound payloads,
 * and updates logs status to 'batched'.
 */
export async function executeBatchOutboundDispatch(): Promise<AutomationExecutionReport> {
  try {
    IngestionDatabase.appendTerminalLog(`[BATCH DISPATCHER] Initiating scheduled 8:00 PM outbound survey correlation pipeline...`);
    
    const report = await AutomatedSurveyEngine.processDailyBatch();
    
    IngestionDatabase.appendTerminalLog(
      `[BATCH DISPATCHER SUCCESS] Run completed. Evaluated: ${report.totalRecordsEvaluated}, Suppressed (Duration < 120s): ${report.totalEntriesSuppressedByShortCallRule}, Duplicates intercepted: ${report.totalDuplicatesIntercepted}, Outbound payloads staged: ${report.finalOutboundPayloadsSuccessfullyStaged.length}`
    );
    
    return report;
  } catch (err: any) {
    const errorMsg = err?.message || String(err);
    console.error(`[BATCH DISPATCHER ERROR]:`, err);
    IngestionDatabase.appendTerminalLog(`[BATCH DISPATCHER CRITICAL ERROR] Pipeline failed: ${errorMsg}`);
    throw new Error(`Batch survey dispatcher process failed: ${errorMsg}`);
  }
}
