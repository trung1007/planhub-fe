import api from "@/lib/axios";
import { LoginInput, RegisterInput } from "@/schemas/user.schema";

export const registerUser = async (data: RegisterInput) => {
  const response = await api.post("/users", data);
  return response.data;
};

export const loginUser = async (data: LoginInput) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};