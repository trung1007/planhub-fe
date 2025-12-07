import api from "@/lib/axios";
import { AssignIssueToSprintInput } from "@/schemas/issue.schema";
import { ActionSprintInput } from "@/schemas/sprint-schema";

export const createSprint = async (data: ActionSprintInput) => {
  const response = await api.post("/core-service/sprints", data);
  return response.data;
};

export const getAllSprint = async (page: number = 1, limit: number = 10) => {
  const response = await api.get(`/core-service/sprints`, {
    params: { page, limit },
  });
  return response.data;
};

export const getListSprint = async () => {
  const response = await api.get(`/core-service/sprints/sprint-list`);
  return response.data;
};

export const getListActiveSprintByProjectId = async (projectId?: number | null) => {
  const response = await api.get(`/core-service/sprints/active-sprints/${projectId}`);
  return response.data;
};


export const getListActiveSprint = async () => {
  const response = await api.get(`/core-service/sprints/active-sprints`);
  return response.data;
};



export const editSprint = async (id:number,data: ActionSprintInput) => {
  const response = await api.patch(`/core-service/sprints/${id}`, data);
  return response.data;
};

export const deleteSprint = async (id: number) => {
  const response = await api.delete(`/core-service/sprints/${id}`);
  return response.data;
};