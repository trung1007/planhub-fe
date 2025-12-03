import { z } from "zod";

export const WorkflowSchema = z.object({
  name: z.string().min(1, "Workflow name is required"),
  key: z.string().min(1, "Workflow key is required"),
  version: z.string().min(1, "Workflow version is required"),
  // projectId: z.number().nullable(),
  projectId: z
    .number()
    .int()
    .refine((v) => !isNaN(v), "Project is required"),
  description: z.string().optional(),
});

export type WorkflowInput = z.infer<typeof WorkflowSchema>;

export const StatusSchema = z.object({
  workflow_id: z.number(),
  name: z.string().min(1, "Name is required"),
  color: z.string().min(1, "Color is required"),
  is_start: z.boolean().optional(),
  is_final: z.boolean().optional(),
});

export type StatusInput = z.infer<typeof StatusSchema>;

export const TransitionSchema = z.object({
  workflow_id: z.number(),
  name: z.string().min(1, "Transition name is required"),
  status_id_from: z.number().nullable().optional(),
  status_id_to: z
    .number()
    .int()
    .refine((v) => !isNaN(v), "Target status is required"),
});

export type TransitionInput = z.infer<typeof TransitionSchema>;
