import { useMutation } from "@tanstack/react-query";

import { RegisterInput } from "@/schemas/user.schema";

import {
  forgotPassword,
  loginUser,
  logout,
  registerUser,
  resetPassword,
} from "@/services/user.service";

import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { loginUserState, logoutUserState } from "@/stores/auth/authSlice";

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterInput) => registerUser(data),
  });
};

export const useAuthMutation = (mutationFn: (data: any) => Promise<any>) => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      console.log("đăng nhập thành công:", data);

      Cookies.set("access_token", data?.access_token);
      Cookies.set("refresh_token", data?.refresh_token);
      dispatch(loginUserState(data));
    },
    onError: (error: any) => {
      console.error("Đăng nhập thất bại", error);
    },
  });
};

export const useLogoutMutation = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = Cookies.get("refresh_token");

      if (!refreshToken) {
        throw new Error("Không tìm thấy refresh token");
      }

      return await logout(refreshToken);
    },

    onSuccess: () => {
      // Xoá cookie
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      dispatch(logoutUserState());
    },

    onError: (error: any) => {
      console.error("Logout thất bại:", error);

      // Dù lỗi vẫn xoá token để đồng bộ
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      dispatch(logoutUserState());
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (body: { email: string }) => forgotPassword(body.email),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: { token: string; newPassword: string }) =>
      resetPassword(data),
  });
};
