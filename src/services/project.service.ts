import api from "@/lib/axios";
import { ActionProjectInput } from "@/schemas/project.schema";

export const getAllProject = async (page: number = 1, limit: number = 10) => {
  const response = await api.get(`/core-service/projects`, {
    params: { page, limit },
  });
  return response.data;
};

export const getListProject = async () => {
  const response = await api.get(`/core-service/projects/project-list`);
  return response.data;
};

export const createProject = async (data: ActionProjectInput) => {
  const response = await api.post("/core-service/projects", data);
  return response.data;
};

export const editProject = async (id:number, data: ActionProjectInput) => {
  const response = await api.patch(`/core-service/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: number) => {
  const response = await api.delete(`/core-service/projects/${id}`);
  return response.data;
};