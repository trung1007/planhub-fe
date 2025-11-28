import { CommentFormValues, UpdateCommentInput } from "@/schemas/comment.schema";
import {
  createComment,
  deleteComment,
  editComment,
  getCommentsByIssueId,
} from "@/services/comment.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetCommentByIssueId = (issue_id: number) => {
  return useQuery({
    queryKey: ["comments", issue_id],
    queryFn: () => getCommentsByIssueId(issue_id),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CommentFormValues) => createComment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["issueHistory"] });
    },
  });
};

export const useEditComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCommentInput }) =>
      editComment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["issueHistory"] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["issueHistory"] });
    },
  });
};
