import {
  createRole,
  deleteRole,
  editRole,
  getAllPermissions,
  getAllPermissionsIds,
  getAllRole,
  getDetailRole,
  getListRole,
} from "@/services/role.service";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useAllRole = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["roles", page, limit],
    queryFn: () => getAllRole(page, limit),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: true,
  });
};

export const useListRole = () => {
  return useQuery({
    queryKey: ["listRoles"],
    queryFn: () => getListRole(),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};

export const useAllPermissions = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["permissions", page, limit],
    queryFn: () => getAllPermissions(page, limit),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
export const useAllPermissionIds = () => {
  return useQuery({
    queryKey: ["permission_ids"],
    queryFn: getAllPermissionsIds,
    enabled: false,
    staleTime: 5 * 60 * 1000, // cache 5 phút
  });
};

export const useGetDetailRole = (id: number) => {
  return useQuery({
    queryKey: ["roleDetail", id],
    queryFn: () => getDetailRole(id),
    enabled: !!id,
  });
};

export const useAddRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["listRoles"] });
    },
  });
};

export const useEditRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: any) => editRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["listRoles"] });
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["listRoles"] });
    },
  });
};
