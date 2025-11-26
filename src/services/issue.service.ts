import api from "@/lib/axios";
import {
  AssignIssueToSprintInput,
  IssueFormValues,
} from "@/schemas/issue.schema";

export const getAllIssue = async (page: number = 1, limit: number = 10) => {
  const response = await api.get(`/core-service/issues`, {
    params: { page, limit },
  });
  return response.data;
};

export const createIssue = async (data: IssueFormValues) => {
  const response = await api.post("/core-service/issues", data);
  return response.data;
};
export const assignIssueToSprint = async (data: AssignIssueToSprintInput) => {
  const response = await api.patch(
    "/core-service/issues/assign-to-sprint",
    data
  );
  return response.data;
};
export const getIssueById = async (id: number) => {
  const response = await api.get(`/core-service/issues/${id}`);
  return response.data;
};

export const editIssue = async (id: number, data: IssueFormValues) => {
  const response = await api.patch(`/core-service/issues/${id}`, data);
  return response.data;
};

export const deleteIssue = async (id: number) => {
  const response = await api.delete(`/core-service/issues/${id}`);
  return response.data;
};

export const getSubtasksByIssueId = async (
  parentId: number,
  page: number = 1,
  limit: number = 10
) => {
  const response = await api.get(`/core-service/issues/${parentId}/subtasks`, {
    params: { page, limit },
  });
  return response.data;
};

export const getAllIssueIds = async () => {
  const response = await api.get(`/core-service/issues/all-ids`);
  return response.data;
};

export const getListIssue = async () => {
  const response = await api.get(`/core-service/issues/issue-list`);
  return response.data;
};

