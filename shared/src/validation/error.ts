import { z } from "zod";

export const ErrorLogSchema = z.object({
  message: z.string().min(1, "Error message is required"),
  stack: z.string().optional(),
  path: z.string().optional(),
  method: z.string().optional(),
  statusCode: z.number().int().min(100).max(599).optional(),
  createdAt: z.date().default(() => new Date()),
});
