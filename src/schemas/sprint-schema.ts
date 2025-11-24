import { ReleaseStatus } from "@/enums/release.enum";
import { z } from "zod";

export const ACtionSprintSchema = z.object({
  name: z.string().min(1, "Name is required"),
  key: z.string().min(1, "Key is required"),
  releaseId: z
    .number()
    .int()
    .refine((v) => !isNaN(v), "Release is required"),
  isActive: z.boolean(),
  startDate: z
    .any()
    .refine((v) => v instanceof Date, "Start date must be a Date"),
  endDate: z.any().refine((v) => v instanceof Date, "End date must be a Date"),
  createdId: z.number().int().min(1, "Invalid user id"),
  description: z.string().optional(),
});

export type ActionSprintInput = z.infer<typeof ACtionSprintSchema>;
