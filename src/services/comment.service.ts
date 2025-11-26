import api from "@/lib/axios";
import { CommentFormValues, UpdateCommentInput } from "@/schemas/comment.schema";

export const getCommentsByIssueId = async (issueId: number) => {
  const response = await api.get(`/core-service/comments/issue/${issueId}`);
  return response.data;
};

export const createComment = async (data: CommentFormValues) => {
  const response = await api.post("/core-service/comments", data);
  return response.data;
};

export const editComment = async (id: number, data: UpdateCommentInput) => {
  const response = await api.patch(`/core-service/comments/${id}`, data);
  return response.data;
};

export const deleteComment = async (id: number) => {
  const response = await api.delete(`/core-service/comments/${id}`);
  return response.data;
};

