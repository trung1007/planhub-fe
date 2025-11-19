import api from "@/lib/axios";



export const getAllRole = async (page: number = 1, limit: number = 10) => {
  const response = await api.get(`/userservice/roles`, {
    params: { page, limit },
  });
  return response.data;
};

export const createRole = async (data:any ) => {
  const response = await api.post("/userservice/roles", data);
  return response.data;
};

export const editRole = async (data:any, id:number ) => {
  const response = await api.put(`/userservice/roles/${id}`, data);
  return response.data;
};
