import { z } from "zod";

export const ActionProjectSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .max(50, "Code must be less than 50 characters"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  description: z.string().optional(),
  creatorId: z.number().nullable(),
});

export type ActionProjectInput = z.infer<typeof ActionProjectSchema>;
