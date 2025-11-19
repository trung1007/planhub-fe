import api from "@/lib/axios";
import { LoginInput, RegisterInput } from "@/schemas/user.schema";
import { id } from "zod/locales";

export const registerUser = async (data: RegisterInput) => {
  const response = await api.post("/users", data);
  return response.data;
};

export const loginUser = async (data: LoginInput) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const logout = async (refreshToken: string) => {
  const response = await api.post(
    "/auth/logout",
    { refreshToken },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const getAllUser = async (page: number = 1, limit: number = 10) => {
  const response = await api.get(`/users`, {
    params: { page, limit },
  });
  return response.data;
};

export const getUserById = async (id: number) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const updateUser = async (id: number, data: any) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

export const changePassword = async (id: number, data: any) => {
  const response = await api.put(`/users/change-password/${id}`, data);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post(`/auth/forgot-password`, { email });
  return response.data;
};

export const resetPassword = async (data: any) => {
  const response = await api.post(`/auth/reset-password`, data);
  return response.data;
};
