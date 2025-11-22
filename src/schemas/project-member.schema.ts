import { z } from "zod";

export const ActionProjectMemberSchema = z.object({
  userId: z
    .number()
    .int()
    .refine((v) => !isNaN(v), "User is required"),

  roleId: z
    .number()
    .int()
    .refine((v) => !isNaN(v), "Role is required"),

  projectId: z
    .number()
    .int()
    .refine((v) => !isNaN(v), "Project is required"),
  joinDate: z
    .any()
    .refine((v) => v instanceof Date, "Join date must be a Date"),
  createdId: z
    .number()
    .int()
    .refine((v) => !isNaN(v), "Creator is required"),
});
export type ActionProjectMemberInput = z.infer<
  typeof ActionProjectMemberSchema
>;
