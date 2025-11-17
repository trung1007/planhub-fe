import { useMutation } from "@tanstack/react-query";

import { RegisterInput } from "@/schemas/user.schema";

import { registerUser } from "@/services/user.service";

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterInput) => registerUser(data),
  });
};

export const useAuthMutation = (mutationFn: (data: any) => Promise<any>) => {
  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      const { token, user } = data;
    },
    onError: (error: any) => {
      console.error("Đăng nhập thất bại", error);
    },
  });
};
