import { z } from "zod";

export const ActionRoleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  key: z.string().min(1, "Key is required"),
  description: z.string().optional(),
  actionUserId: z.number().nullable(),
});

export const CreateRolePermissionSchema = z.object({
  role_id: z.number().refine((v) => v !== undefined && v !== null, {
    message: "role_id is required",
  }),

  permissionIds: z
    .array(z.number())
    .min(1, "At least one permission must be provided"),
});

export type ActionRoleInput = z.infer<typeof ActionRoleSchema>;
export type CreateRolePermissionInput = z.infer<
  typeof CreateRolePermissionSchema
>;
