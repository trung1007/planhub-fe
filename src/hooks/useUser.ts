import {
  addUser,
  changePassword,
  deleteUser,
  getAllUser,
  getListUser,
  getUserById,
  updateUser,
} from "@/services/user.service";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAppDispatch } from "./reduxHook";
import { updateUserState } from "@/stores/auth/authSlice";
import { RegisterInput } from "@/schemas/user.schema";
import { usePathname } from "next/navigation";

export const useAllUser = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["allUsers", page, limit],
    queryFn: () => getAllUser(page, limit),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: true,
  });
};

export const useListUser = () => {
  return useQuery({
    queryKey: ["listUsers"],
    queryFn: () => getListUser(),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};

export const useAddUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RegisterInput) => addUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      queryClient.invalidateQueries({ queryKey: ["listUsers"] });
    },
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
  const queryClient = useQueryClient();
  const pathname = usePathname();

  return useMutation({
    mutationFn: ({ id, data }: any) => updateUser(id, data),
    onSuccess: (updatedUser) => {
      // updatedUser là object User backend trả về
      dispatch(updateUserState(updatedUser));
      if (!pathname.includes("user")) {
        queryClient.invalidateQueries({ queryKey: ["allUsers"] });
        queryClient.invalidateQueries({ queryKey: ["listUsers"] });
      }
    },
  });
};
export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ id, data }: any) => changePassword(id, data),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      queryClient.invalidateQueries({ queryKey: ["listUsers"] });
    },
  });
};
