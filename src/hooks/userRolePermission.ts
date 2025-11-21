import {
  createRolePermission,
  deleteRolePermission,
  getAllPermissionsByRole,
  getAllRolePermissionsIds,
} from "@/services/role-permission.service";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useAddRolePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => createRolePermission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role-permissions"] });
    },
  });
};

export const useDeleteRolePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      role_id,
      permissionIds,
    }: {
      role_id: number;
      permissionIds: number[];
    }) => deleteRolePermission(role_id, permissionIds),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role-permissions"] });
    },
  });
};

export const useGetAllPermissionsByRole = (
  roleId: number,
  page: number = 1,
  limit: number = 10
) => {
  return useQuery({
    queryKey: ["role-permissions", roleId, page, limit],
    queryFn: () => getAllPermissionsByRole(roleId, page, limit),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};

export const useAllRolePermissionIds = (roleId:number) => {
  return useQuery({
    queryKey: ["role_permission_ids"],
    queryFn:()=> getAllRolePermissionsIds(roleId),
    enabled: false,
    staleTime: 5 * 60 * 1000,
  });
};
