// src/schemas/comment.schema.ts
import { z } from "zod";

export const CommentSchema = z.object({
  issue_id: z.number().int(),      // bắt buộc, phải là number nguyên
  content: z.string().min(1, "Content is required"), // không cho rỗng
  created_by: z.number().int(),    // bắt buộc, phải là number nguyên
});

export const UpdateCommentSchema = z.object({
  content: z.string().min(1, "Content is required"), // khôn cho rỗng
  created_by: z.number().int(),
});

export type CommentFormValues = z.infer<typeof CommentSchema>;

export type UpdateCommentInput = z.infer<typeof UpdateCommentSchema>;
