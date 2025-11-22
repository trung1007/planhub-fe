"use client"
import { useAllPermissionIds, useAllPermissions } from "@/hooks/useRole";
import { useAddRolePermission } from "@/hooks/userRolePermission";
import { Checkbox } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { toast } from "react-toastify";
import ButtonGroup from "../ButtonGroupTable";

const PermissionTable = ({ role }: { role: any }) => {
    const { data: allIdsData, refetch: fetchAllIds } = useAllPermissionIds();
    const allIds = allIdsData?.ids || [];
    const [permissionToAdd, setPermissionToAdd] = useState<number[]>([]);
    const handleSelectAllToAdd = async (checked: boolean) => {
        if (!checked) {
            setPermissionToAdd([]);
            return;
        }

        const result = await fetchAllIds();
        const ids = result.data?.ids || [];
        setPermissionToAdd(ids);
    };

    const handleSelectOneToAdd = (id: number, checked: boolean) => {
        if (checked)
            setPermissionToAdd((prev) => [...prev, id]);
        else
            setPermissionToAdd((prev) => prev.filter((x) => x !== id));
    };

    const columnsAllPermissions: ColumnsType<any> = [
        {
            title: (
                <Checkbox
                    checked={
                        allIds.length > 0 &&
                        permissionToAdd.length === allIds.length
                    }
                    indeterminate={
                        permissionToAdd.length > 0 &&
                        permissionToAdd.length < allIds.length
                    }
                    onChange={(e) => handleSelectAllToAdd(e.target.checked)}
                />
            ),
            key: "checkbox",
            width: 50,
            align: "center",
            render: (_: any, record: any) => (
                <Checkbox
                    checked={permissionToAdd.includes(record.id)}
                    onChange={(e) =>
                        handleSelectOneToAdd(record.id, e.target.checked)
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
    const limit = 5
    const [pageAll, setPageAll] = useState(1);
    const { data, isLoading } = useAllPermissions(pageAll, limit);

    const { mutate: addRolePermission } = useAddRolePermission();

    const handleAddPermissions = () => {
        if (!role) return;

        if (permissionToAdd.length === 0) {
            toast.warning("Please select at least one permission.");
            return;
        }
        addRolePermission(
            {
                role_id: role.id,
                permissionIds: permissionToAdd,
            },
            {
                onSuccess: () => {
                    toast.success("Permissions added successfully!");
                    setPermissionToAdd([]);
                },
                onError: (error: any) => {
                    toast.error(error?.message || "Failed to add permissions.");
                },
            }
        );
    };
    return (
        <div className="p-3 flex flex-col gap-2">
            <h2 className="font-semibold">All permissions</h2>

            <ButtonGroup
                onAdd={handleAddPermissions}
                title={
                    permissionToAdd.length > 0
                        ? `Add ${permissionToAdd.length} permissions to this role`
                        : `Add to this role`
                }
            />

            <Table
                rowKey="id"
                className="custom-table"
                columns={columnsAllPermissions}
                dataSource={data?.items || []}
                loading={isLoading}
                pagination={{
                    current: pageAll,
                    pageSize: limit,
                    total: data?.total || 0,
                    onChange: (p) => setPageAll(p),
                }}
                scroll={{ x: "100%" }}
                tableLayout="fixed"
            />
        </div>
    )
}

export default PermissionTable
