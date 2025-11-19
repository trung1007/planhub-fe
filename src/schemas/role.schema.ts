import { z } from "zod";

export const ActionRoleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  key: z.string().min(1, "Key is required"),
  description: z.string().optional(),
  actionUserId: z.number().nullable(),
});

export type ActionRoleInput = z.infer<typeof ActionRoleSchema>;
