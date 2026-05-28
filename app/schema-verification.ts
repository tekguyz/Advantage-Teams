import { z } from 'zod';
import { Type } from '@google/genai';

// =============================================================================
// ZOD RUNTIME ENFORCEMENT SCHEMA (Anti-mutation and exact matching)
// =============================================================================

export const AnalysedTimelineResultSchema = z.object({
  productivityScore: z
    .number()
    .int()
    .min(0, "Productivity score cannot be negative")
    .max(100, "Productivity score cannot exceed 100"),
  lastVerifiedAction: z
    .string()
    .max(150, "Verified action summary must be concise"),
  managerInsight: z
    .string()
    .min(5, "Manager insight must be a meaningful technical sentence"),
  warningFlag: z
    .boolean()
    .default(false),
});

export type AnalysedTimelineResult = z.infer<typeof AnalysedTimelineResultSchema>;

// =============================================================================
// @GOOGLE/GENAI SDK COMPATIBLE RESPONSE SCHEMA
// =============================================================================

export const GeminiResponseSchemaConfig = {
  type: Type.OBJECT,
  properties: {
    productivityScore: {
      type: Type.INTEGER,
      description: "An integer from 1 to 100 calculated using the mathematical density ratio: Score = min(100, (Unique Actions / Duration Minutes) * 10). Note: Do not return 0 or negative values here; if there are no logs, the system will short-circuit before this schema.",
    },
    lastVerifiedAction: {
      type: Type.STRING,
      description: "A concise summary under 15 words outlining the actual work performed by the technician.",
    },
    managerInsight: {
      type: Type.STRING,
      description: "A single technical sentence of team manager context summarizing the agent's primary work focus.",
    }
  },
  required: ["productivityScore", "lastVerifiedAction", "managerInsight"],
};

// =============================================================================
// INPUT PAYLOAD TYPING
// =============================================================================

export interface TimelineAnalysisInput {
  totalDurationMinutes: number;
  uniqueActionsCount: number;
  rawActions: {
    platform_action_type: string;
    precise_action_timestamp: string;
    metadata: string;
  }[];
}
