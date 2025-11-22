"use client"
import { useAllRolePermissionIds, useDeleteRolePermission, useGetAllPermissionsByRole } from "@/hooks/userRolePermission";
import { Checkbox } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { toast } from "react-toastify";
import ButtonGroup from "../ButtonGroupTable";

const RolePermissionsTable = ({ role }: { role: any }) => {

    const limit = 5
    const [pageInRole, setPageInRole] = useState(1);
    const { data: dataPermissionInRole, isLoading: isLoadingInRole } =
        useGetAllPermissionsByRole(role.id, pageInRole, limit);
    const { data: allIdsData, refetch: fetchAllIds } = useAllRolePermissionIds(role.id);
    const allIds = allIdsData?.ids || [];
    const [permissionToRemove, setPermissionToRemove] = useState<number[]>([]);

    const handleSelectAllToRemove = async (checked: boolean) => {
        if (!checked) {
            setPermissionToRemove([]);
            return;
        }

        const result = await fetchAllIds();
        const ids = result.data?.ids || [];
        setPermissionToRemove(ids);
    };

    const handleSelectOneToRemove = (id: number, checked: boolean) => {
        if (checked)
            setPermissionToRemove((prev) => [...prev, id]);
        else
            setPermissionToRemove((prev) => prev.filter((x) => x !== id));
    };

    const columnsAllRolePermissions: ColumnsType<any> = [
        {
            title: (
                <Checkbox
                    checked={
                        allIds.length > 0 &&
                        permissionToRemove.length === allIds.length
                    }
                    indeterminate={
                        permissionToRemove.length > 0 &&
                        permissionToRemove.length < allIds.length
                    }
                    onChange={(e) => handleSelectAllToRemove(e.target.checked)}
                />
            ),
            key: "checkbox",
            width: 50,
            align: "center",
            render: (_: any, record: any) => (
                <Checkbox
                    checked={permissionToRemove.includes(record.id)}
                    onChange={(e) =>
                        handleSelectOneToRemove(record.id, e.target.checked)
                    }
                />
            ),
        },

        {
            title: "Name",
            dataIndex: "name",
            ellipsis: true,
            width: 200,
        },
        {
            title: "Code",
            dataIndex: "code",
            ellipsis: true,
            width: 200,
            render: (value: string) => (
                <span className="code-ellipsis">{value}</span>
            ),
        },
        {
            title: "Method",
            dataIndex: "method",
            align: "center",
            width: 100,
        },
        {
            title: "URL",
            dataIndex: "url",
            ellipsis: true,
            width: 300,
        },
        {
            title: "Description",
            dataIndex: "description",
            ellipsis: true,
            width: 200,
        },
    ];
    const { mutate: deleteRolePermission, isPending } = useDeleteRolePermission();
    const handleDeletePermissions = () => {
        if (!role) return;

        if (permissionToRemove.length === 0) {
            toast.warning("Please select at least one permission.");
            return;
        }
        deleteRolePermission(
            {
                role_id: role.id,
                permissionIds: permissionToRemove,
            },
            {
                onSuccess: () => {
                    toast.success("Permissions removed successfully!");
                    setPermissionToRemove([]);
                },
                onError: () => {
                    toast.error("Failed to remove permissions!");
                }
            }
        );
    };
    return (
        <div className="p-3 flex flex-col gap-2">
            <h2 className="font-semibold">Permissions in role</h2>

            <ButtonGroup
                onAdd={handleDeletePermissions}
                title={
                    permissionToRemove.length > 0
                        ? `Remove ${permissionToRemove.length} permissions from this role`
                        : `Add to this role`
                }
            />

            <Table
                rowKey="id"
                className="custom-table"
                columns={columnsAllRolePermissions}
                dataSource={dataPermissionInRole?.items || []}
                loading={isLoadingInRole}
                pagination={{
                    current: pageInRole,
                    pageSize: limit,
                    total: dataPermissionInRole?.total || 0,
                    onChange: (p) => setPageInRole(p),
                }}
                scroll={{ x: "100%" }}
                tableLayout="fixed"
            />
        </div>
    )
}

export default RolePermissionsTable