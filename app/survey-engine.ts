import { IngestionDatabase } from './lib/db-store';
import { PendingSurvey, AgentProfile } from './types-ingestion';

export interface OutboundSurveyPayload {
  phoneNumber: string;
  destinationExtension: string;
  targetedAgentIdentifier: string; // Resolves extension to specific technician agent
  outboundMessageTextTemplate: string;
}

export interface AutomationExecutionReport {
  totalRecordsEvaluated: number;
  totalEntriesSuppressedByShortCallRule: number;
  totalDuplicatesIntercepted: number;
  finalOutboundPayloadsSuccessfullyStaged: OutboundSurveyPayload[];
}

export class AutomatedSurveyEngine {
  
  /**
   * Evaluates the active queue batch, handles sliding-window deduplication,
   * performs agent association, saves statuses, and prepares the staged SMS payloads.
   */
  static async processDailyBatch(): Promise<AutomationExecutionReport> {
    const allSurveys = await IngestionDatabase.getSurveys();
    const agents = await IngestionDatabase.getAgents();

    // 1. Fetch all rows where status is 'pending'
    const pendingRows = allSurveys.filter(s => s.status === 'pending');
    
    // Sort chronological: oldest to newest to ensure proper timeline sequence evaluation
    pendingRows.sort((a, b) => new Date(a.queue_timestamp).getTime() - new Date(b.queue_timestamp).getTime());

    const totalRecordsEvaluated = pendingRows.length;
    let totalEntriesSuppressedByShortCallRule = 0;
    let totalDuplicatesIntercepted = 0;
    const finalOutboundPayloadsSuccessfullyStaged: OutboundSurveyPayload[] = [];

    // Helper map of agents by extension for fast resolution
    const agentMapByExtension = new Map<string, AgentProfile>();
    agents.forEach(a => {
      agentMapByExtension.set(a.extension, a);
    });

    // We keep a local set/timeline track of dispatches to calculate deductions in real-time
    const currentBatchBatchedPhones: { phone: string; timestamp: number }[] = [];

    for (const survey of pendingRows) {
      const surveyTime = new Date(survey.queue_timestamp).getTime();

      // Step A: Explicit Short-Call evaluation block 
      // (120-second rule safety net just in case raw insert bypass occurred)
      if (survey.call_duration_seconds < 120) {
        totalEntriesSuppressedByShortCallRule++;
        await IngestionDatabase.updateSurveyStatus(
          survey.id, 
          'suppressed', 
          `Short Call Ingestion Rule (${survey.call_duration_seconds}s < 120s)`
        );
        continue;
      }

      // Step B: Sliding-window filter checking 24 hours back
      const windowStart = surveyTime - 24 * 60 * 60 * 1000;
      let hasOverlap = false;

      // Check against older already-sent (or batched) records in database history
      const hasPastDuplicate = allSurveys.some(s => {
        if (s.customer_phone !== survey.customer_phone) return false;
        if (s.status !== 'sent' && s.status !== 'batched') return false;
        const pastTime = new Date(s.queue_timestamp).getTime();
        return pastTime >= windowStart && pastTime <= surveyTime;
      });

      if (hasPastDuplicate) {
        hasOverlap = true;
      } else {
        // Also check against surveys processed earlier within this SAME current batch
        const hasCurrentBatchDuplicate = currentBatchBatchedPhones.some(item => {
          return item.phone === survey.customer_phone && 
                 item.timestamp >= windowStart && 
                 item.timestamp <= surveyTime;
        });
        if (hasCurrentBatchDuplicate) {
          hasOverlap = true;
        }
      }

      if (hasOverlap) {
        totalDuplicatesIntercepted++;
        await IngestionDatabase.updateSurveyStatus(
          survey.id, 
          'suppressed', 
          '24-Hour Customer Deduplication Window Match'
        );
        continue;
      }

      // Step C: Map surviving entries with profile matrix to resolve agent details
      const matchedAgent = agentMapByExtension.get(survey.agent_extension);
      const agentIdentifier = matchedAgent ? matchedAgent.agent_name : `Desk Ext. ${survey.agent_extension}`;

      // Step D: Package information into clean SMS payloads
      const outboundMessageTextTemplate = `Hi! Thank you for speaking with ${agentIdentifier}. Please reply with a score of 1 to 5 to rate your service experience today.`;
      
      const payload: OutboundSurveyPayload = {
        phoneNumber: survey.customer_phone,
        destinationExtension: survey.agent_extension,
        targetedAgentIdentifier: agentIdentifier,
        outboundMessageTextTemplate
      };

      finalOutboundPayloadsSuccessfullyStaged.push(payload);

      // Track this number temporarily for current-batch checks
      currentBatchBatchedPhones.push({
        phone: survey.customer_phone,
        timestamp: surveyTime
      });

      // Step E: Update records status to 'batched'
      await IngestionDatabase.updateSurveyStatus(survey.id, 'batched');
    }

    // Append metadata to terminal logs
    IngestionDatabase.appendTerminalLog(
      `Daily survey batch aggregated. Evaluated: ${totalRecordsEvaluated}, Short Suppressed: ${totalEntriesSuppressedByShortCallRule}, Dups Blocked: ${totalDuplicatesIntercepted}, Staged Outbound: ${finalOutboundPayloadsSuccessfullyStaged.length}`
    );

    return {
      totalRecordsEvaluated,
      totalEntriesSuppressedByShortCallRule,
      totalDuplicatesIntercepted,
      finalOutboundPayloadsSuccessfullyStaged
    };
  }
}
