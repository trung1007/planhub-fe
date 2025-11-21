import api from "@/lib/axios";

export const getAllRole = async (page: number = 1, limit: number = 10) => {
  const response = await api.get(`/user-service/roles`, {
    params: { page, limit },
  });
  return response.data;
};

export const getAllPermissions = async (
  page: number = 1,
  limit: number = 10
) => {
  const response = await api.get(`/user-service/permissions`, {
    params: { page, limit },
  });
  return response.data;
};

export const getDetailRole = async (id:number) => {
  const response = await api.get(`/user-service/roles/${id}`);
  return response.data;
};

export const getAllPermissionsIds = async () => {
  const response = await api.get(`/user-service/permissions/all-ids`);
  return response.data;
};

export const createRole = async (data: any) => {
  const response = await api.post("/user-service/roles", data);
  return response.data;
};

export const editRole = async (id: number, data: any) => {
  const response = await api.put(`/user-service/roles/${id}`, data);
  return response.data;
};

export const deleteRole = async (id: number) => {
  const response = await api.delete(`/user-service/roles/${id}`);
  return response.data;
};
