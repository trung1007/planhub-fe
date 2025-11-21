import api from "@/lib/axios";
import { CreateRolePermissionInput } from "@/schemas/role.schema";

export const createRolePermission = async (data: CreateRolePermissionInput) => {
  const response = await api.post("/user-service/role-permissions", data);
  return response.data;
};

export const deleteRolePermission = async (
  role_id: number,
  permissionIds: number[]
) => {
  const response = await api.delete(
    `/user-service/role-permissions/${role_id}`,
    {
      params: {
        permissionIds: permissionIds.join(","),
      },
    }
  );

  return response.data;
};

export const getAllPermissionsByRole = async (
  roleId: number,
  page: number = 1,
  limit: number = 10
) => {
  const response = await api.get(`/user-service/role-permissions/${roleId}`, {
    params: { page, limit },
  });
  console.log("response:", response);

  return response.data;
};

export const getAllRolePermissionsIds = async (roleId:number) => {
  const response = await api.get(`/user-service/role-permissions/role-permissionIds/${roleId}`);
  return response.data;
};
