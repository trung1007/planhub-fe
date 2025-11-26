import { AttachmentFormValues } from "@/schemas/attachment.schema";
import {
  deleteAttachment,
  downloadAttachment,
  getAttachmentsByIssueId,
  uploadAttachment,
} from "@/services/attachment.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUploadAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AttachmentFormValues) => uploadAttachment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments"] });
    },
  });
};

export const useGetAttachmentByIssueId = (issue_id: number) => {
  return useQuery({
    queryKey: ["attachments", issue_id],
    queryFn: () => getAttachmentsByIssueId(issue_id),
    staleTime: 5 * 60 * 1000,
  });
};

export const useDownloadAttachment = () => {
  return useMutation({
    mutationFn: async ({ id, filename }: { id: number; filename: string }) => {
      const blob = await downloadAttachment(id);

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();

      window.URL.revokeObjectURL(url);
    },
  });
};

export const useDeleteAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteAttachment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments"] });
    },
  });
};
