import { GoogleGenAI } from '@google/genai';
import { 
  TimelineAnalysisInput, 
  AnalysedTimelineResult, 
  AnalysedTimelineResultSchema, 
  GeminiResponseSchemaConfig 
} from './schema-verification';

// =============================================================================
// LAZY-LOADED STATE TO PREVENT CRASHING ON STARTUP IF GEMINI_API_KEY IS MISSING
// =============================================================================
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please check your AI Studio secrets settings.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// =============================================================================
// DETERMINISTIC TIMELINE ANALYSIS PIPELINE
// =============================================================================
export class GeminiTimelineService {

  /**
   * Main service function to analyze work timelines and return validated results.
   */
  static async analyzeTimeline(input: TimelineAnalysisInput, modelName: string = "gemini-3.5-flash"): Promise<AnalysedTimelineResult> {
    
    // 1. FALLBACK BEHAVIOR: Empty activity array logic short-circuits immediately.
    if (!input.rawActions || input.rawActions.length === 0) {
      return {
        productivityScore: 0,
        lastVerifiedAction: "",
        managerInsight: "WARNING: No internal activity logs found in the selected timeframe. Urgent operational review required.",
        warningFlag: true
      };
    }

    try {
      const ai = getGeminiClient();

      // Ensure safe duration values to avoid Division by Zero errors
      const safeDuration = Math.max(1, input.totalDurationMinutes);

      // Instruct Gemini with deterministic parameters and schema enforcement
      const prompt = `
        You are an expert AI Integration Specialist auditing technician work timelines.
        Analyze the target timeline window described in context:
        
        - Total Duration Minutes: ${safeDuration}
        - Count of Unique Internal Actions: ${input.uniqueActionsCount}
        
        Chronological Timeline Logs:
        ${JSON.stringify(input.rawActions, null, 2)}
        
        Strict Guidelines:
        1. Calculate the productivityScore as an integer from 1 to 100 based on this exact formula:
           Score = min(100, (Unique Actions / Duration Minutes) * 10)
           Ensure the output 'productivityScore' is that calculated integer (using basic rounding, e.g. Math.round or Math.floor if decimal). Minimum score for active logs is 1.
        2. Formulate 'lastVerifiedAction' as a concise summary under 15 words outlining the actual work performed. No code snippets, no markdown formatting.
        3. Formulate 'managerInsight' as a single technical sentence of team manager context summarizing the agent's primary work focus.
        
        Ensure direct compliance without conversational padding. Use the provided JSON schema.
      `;

      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          temperature: 0.1, // Low temperature for deterministic output
          responseMimeType: "application/json",
          responseSchema: GeminiResponseSchemaConfig,
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Received an empty response text payload from Gemini.");
      }

      // Parse and match Zod constraints
      const parsedBody = JSON.parse(responseText.trim());
      
      // Verification of the score's math to safeguard absolute determinism in pipeline
      const expectedScore = Math.min(100, Math.max(1, Math.round((input.uniqueActionsCount / safeDuration) * 10)));
      if (typeof parsedBody.productivityScore !== 'number' || parsedBody.productivityScore <= 0) {
        parsedBody.productivityScore = expectedScore;
      }

      const validatedResult = AnalysedTimelineResultSchema.parse({
        productivityScore: parsedBody.productivityScore,
        lastVerifiedAction: parsedBody.lastVerifiedAction,
        managerInsight: parsedBody.managerInsight,
        warningFlag: false
      });

      return validatedResult;

    } catch (e: any) {
      console.error("[GEMINI ERROR] analyzeTimeline failed:", e);
      // Fallback state mapping if external API returns bad JSON or times out
      const fallbackScore = Math.min(100, Math.max(1, Math.round((input.uniqueActionsCount / Math.max(1, input.totalDurationMinutes)) * 10)));
      
      return {
        productivityScore: fallbackScore,
        lastVerifiedAction: "Service analysis call failed or timed out.",
        managerInsight: `Fallback analysis compiled locally due to: ${e?.message || "Unknown error"}`,
        warningFlag: true
      };
    }
  }
}
