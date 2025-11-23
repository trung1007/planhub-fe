import { ReleaseStatus } from "@/enums/release.enum";
import { z } from "zod";

export const ACtionReleaseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  version: z.string().min(1, "Version is required"),
  status: z.enum(ReleaseStatus).optional(),
  projectId: z.number(),
  startDate: z
    .any()
    .refine((v) => v instanceof Date, "Start date must be a Date"),
  endDate: z.any().refine((v) => v instanceof Date, "End date must be a Date"),
  createdId: z.number().int().min(1, "Invalid user id"),
  description: z.string().optional(),
});

export type ActionReleaseInput = z.infer<typeof ACtionReleaseSchema>;
