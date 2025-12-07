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
export const assignIssueToSprint = async (issueId: number) => {
  const response = await api.post(
    "/core-service/issues/assign-to-active-sprint",
    { issueId: issueId }
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

export const getListIssueScrum = async () => {
  const response = await api.get(`/core-service/issues/scrum`);
  return response.data;
};

export const getListIssue = async () => {
  const response = await api.get(`/core-service/issues/issue-list`);
  return response.data;
};

export const getIssueHistory = async (
  issueId: number,
  page: number = 1,
  limit: number = 10
) => {
  const response = await api.get(`/core-service/issue-history/${issueId}`, {
    params: { page, limit },
  });
  return response.data;
};

export const getListStatus = async (id?: number | null) => {
  const response = await api.get(`/core-service/status/sprint/${id}`);
  return response.data;
};
