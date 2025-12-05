import api from "@/lib/axios";

export const getAllWorkflow = async (page: number = 1, limit: number = 10) => {
  const response = await api.get(`/core-service/workflows`, {
    params: { page, limit },
  });
  return response.data;
};

export const createWorkflow = async (data: any) => {
  const response = await api.post("/core-service/workflows", data);
  return response.data;
};

export const editWorkflow = async (id:number,data: any) => {
  const response = await api.patch(`/core-service/workflows/${id}`, data);
  return response.data;
};

export const getWorkflowById = async (id: number) => {
  const response = await api.get(`/core-service/workflows/${id}`);
  return response.data;
};

export const getStatusByWorkflowId = async (id: number) => {
  const response = await api.get(`/core-service/status/workflow/${id}`);
  return response.data;
};

export const getTransitionByWorkflowId = async (id: number) => {
  const response = await api.get(`/core-service/transition/workflow/${id}`);
  return response.data;
};

export const deleteWorkflow = async (id: number) => {
  const response = await api.delete(`/core-service/workflows/${id}`);
  return response.data;
};
