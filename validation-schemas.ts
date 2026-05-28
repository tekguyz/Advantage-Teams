// validation-schemas.ts
// Lightweight Zod validation rules for Advantage Teams
import { z } from 'zod';

export const ExtensionMapSchema = z.object({
  extension: z
    .string()
    .min(1, "Extension is required")
    .regex(/^\d+$/, "Extension must be a strict numeric string (e.g., '101')"),
  mappedName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long"),
  zohoUserId: z
    .string()
    .min(3, "Zoho ID must be at least 3 characters")
    .max(15, "Zoho ID is too long"),
});

export const TelemetryPayloadSchema = z.object({
  agentId: z.string().uuid("Invalid agent unique identifier"),
  status: z.enum(["Available", "Away from Phone", "On Call", "Ticket Work"]),
  durationMins: z.number().nonnegative("Duration cannot be negative"),
});

export const WebhookLogSchema = z.object({
  signature: z.string().min(1, "Signature verification token is required"),
  timestamp: z.string().datetime("Timestamp must satisfy ISO format standards"),
  payload: TelemetryPayloadSchema,
});
