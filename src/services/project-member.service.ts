import api from "@/lib/axios";
import { ActionProjectMemberInput } from "@/schemas/project-member.schema";

export const createProjectMember = async (data: ActionProjectMemberInput) => {
  const response = await api.post("/core-service/project-members", data);
  return response.data;
};

export const getAllProjectMember = async (page: number = 1, limit: number = 10) => {
  const response = await api.get(`/core-service/project-members`, {
    params: { page, limit },
  });
  return response.data;
};


export const editProjectMember = async (id:number,data: ActionProjectMemberInput) => {
  const response = await api.patch(`/core-service/project-members/${id}`, data);
  return response.data;
};

export const deleteProjectMember = async (id: number) => {
  const response = await api.delete(`/core-service/project-members/${id}`);
  return response.data;
};