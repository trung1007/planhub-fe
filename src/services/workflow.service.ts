import api from "@/lib/axios";

export const getAllWorkflow = async (page: number = 1, limit: number = 10) => {
  const response = await api.get(`/core-service/workflows`, {
    params: { page, limit },
  });
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