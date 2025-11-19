import {
  addUser,
  changePassword,
  getAllUser,
  getUserById,
  updateUser,
} from "@/services/user.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAppDispatch } from "./reduxHook";
import { updateUserState } from "@/stores/auth/authSlice";
import { RegisterInput } from "@/schemas/user.schema";

export const useAllUser = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["allUsers", page, limit],
    queryFn: () => getAllUser(page, limit),
    placeholderData: (prev) => prev,
  });
};

export const useAddUser = () => {
  return useMutation({
    mutationFn: (data: RegisterInput) => addUser(data),
  });
};

export const useUserDetail = (id: number) => {
  return useQuery({
    queryKey: ["userDetail", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};

export const useUpdateUser = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ id, data }: any) => updateUser(id, data),
    onSuccess: (updatedUser) => {
      // updatedUser là object User backend trả về
      dispatch(updateUserState(updatedUser));
    },
  });
};
export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ id, data }: any) => changePassword(id, data),
  });
};
