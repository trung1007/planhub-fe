import { z } from 'zod';

export const AttachmentSchema = z.object({
  issue_id: z.number().min(1, 'Issue ID is required'),
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, 'File must be selected'),
});

export type AttachmentFormValues = z.infer<typeof AttachmentSchema>;
