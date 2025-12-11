import {
  IssuePriority,
  IssueStatus,
  IssueType,
  TagEnum,
} from "@/enums/issue.enum";
import { z } from "zod";

export const IssueSchema = z.object({
  id: z.number().optional(),

  projectId: z.number().nullable().optional(),

  sprintId: z.number().nullable().optional(),

  type: z.enum(IssueType),

  parentIssueId: z.number().nullable().optional(),

  name: z.string().min(1, "Name is required"),

  summary: z.string().nullable().optional(),

  description: z.string().nullable().optional(),

  tags: z.array(z.enum(TagEnum)).nullable().optional(),

  status: z.enum(IssueStatus).nullable().optional(),

  priority: z.enum(IssuePriority).nullable().optional(),

  assigneeId: z.number().nullable().optional(),

  reporterId: z.number().nullable().optional(),

  createdBy: z.number().nullable().optional(),
});

export const AssignIssueToSprint = z.object({
  sprintId: z.number().refine((v) => v !== undefined && v !== null, {
    message: "sprintId is required",
  }),

  issueIds: z.array(z.number()).min(1, "At least one issue must be provided"),
});

export type IssueFormValues = z.infer<typeof IssueSchema>;

export type AssignIssueToSprintInput = z.infer<typeof AssignIssueToSprint>;
