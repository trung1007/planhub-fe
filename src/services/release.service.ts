import api from "@/lib/axios";
import { ActionReleaseInput } from "@/schemas/release.schema";

export const createRelease = async (data: ActionReleaseInput) => {
  const response = await api.post("/core-service/releases", data);
  return response.data;
};

export const getAllRelease = async (page: number = 1, limit: number = 10) => {
  const response = await api.get(`/core-service/releases`, {
    params: { page, limit },
  });
  return response.data;
};

export const getListRelease = async () => {
  const response = await api.get(`/core-service/projects/release-list`);
  return response.data;
};

export const editRelease = async (id:number,data: ActionReleaseInput) => {
  const response = await api.patch(`/core-service/releases/${id}`, data);
  return response.data;
};

export const deleteRelease = async (id: number) => {
  const response = await api.delete(`/core-service/releases/${id}`);
  return response.data;
};