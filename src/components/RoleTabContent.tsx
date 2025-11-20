"use client";
import { useState } from "react";
import { Button, Popconfirm, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import EditUserModal from "./modal/EditUserModal";

import RoleModal from "./modal/RoleModal";
import { useAllRole, useDeleteRole } from "@/hooks/useRole";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import RolePermissionTabContent from "./RolePermissionTabContent";

const RoleTabContent = ({ roleScreen, setRoleScreen, selectedRole, setSelectedRole }: any) => {
    const [page, setPage] = useState(1);
    const limit = 6;

    const { data, isLoading } = useAllRole(page, limit);
    const [openAdd, setOpenAdd] = useState(false);

    const [openEdit, setOpenEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const handleView = (record: any) => {
        setSelectedRole(record);
        setRoleScreen("permission");
    };
    const handleEdit = (record: any) => {

        setSelectedUser(record);
        setOpenEdit(true);
    };

    const { mutate, isPending: isDeleting } = useDeleteRole()


    const handleDelete = (record: any) => {
        mutate(record.id, {
            onSuccess: () => {
                toast.success("Delete role successful");
            },
            onError: () => {
                toast.error("XDelete role failed");
            }
        });
    };


    const columns: ColumnsType<any> = [
        {
            title: "No",
            key: "no",
            align: "center",
            width: 60,
            fixed: "left" as const,
            render: (_: any, __: any, index: number) => (page - 1) * limit + index + 1,
        },

        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            ellipsis: true,
            width: 150,
        },
        {
            title: "Key",
            dataIndex: "key",
            key: "key",
            ellipsis: true,
            width: 120,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
            width: 120,
        },

        {
            title: "Created By",
            dataIndex: "createdBy",
            key: "createdBy",
            align: "center",
            width: 100,
        },
        {
            title: "Updated By",
            dataIndex: "updatedBy",
            key: "updatedBy",
            align: "center",
            width: 100,
        },

        {
            title: "Action",
            key: "action",
            width: 120,
            fixed: "right" as const,
            render: (_: any, record: any) => (
                <div className="flex gap-1">
                    <Button size="small" type="default" onClick={() => handleView(record)}>
                        <FaEye />
                    </Button>
                    <Button size="small" type="primary" onClick={() => handleEdit(record)}>
                        <FaEdit />
                    </Button>
                    <Popconfirm
                        title="Delete this role?"
                        onConfirm={() => handleDelete(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger size="small"><FaTrash /></Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    if (roleScreen === "permission") {
        return (
            <RolePermissionTabContent
                role={selectedRole}
                onBack={() => setRoleScreen("list")}
            />

        );
    }

    return (
        <div className="h-full">
            <h3 className="text-xl font-semibold mb-4 border-b p-3">Role & Permission</h3>
            <div className="p-3 flex flex-col gap-2">
                <ButtonGroup onAdd={() => setOpenAdd(true)} />
                <div className="w-full">
                    <Table
                        rowKey="id"
                        className="custom-table"
                        columns={columns}
                        dataSource={data?.items || []}
                        loading={isLoading}
                        pagination={{
                            current: page,
                            pageSize: limit,
                            total: data?.total || 0,
                            onChange: (p) => setPage(p),
                        }}
                        onRow={() => ({
                            style: { cursor: "pointer" },
                        })}
                        scroll={{ x: "100%" }}
                        tableLayout="fixed"
                    />
                </div>

            </div>
            {openAdd && <RoleModal open={openAdd} setOpen={setOpenAdd} mode="add" />}
            {/* {openEdit && (
                <EditUserModal open={openEdit} setOpen={setOpenEdit} user={selectedUser} />
            )} */}

            {openEdit && (
                <RoleModal open={openEdit} setOpen={setOpenEdit} mode="edit" role={selectedUser} />
            )}

        </div>
    );
};

const ButtonGroup = ({ onAdd }: { onAdd: () => void }) => {
    return (
        <div className="flex py-3 justify-between">
            <button
                onClick={onAdd}
                className="px-3 bg-primary text-white transition font-semibold duration-300 hover:scale-110 cursor-pointer origin-center"
            >
                Add a role
            </button>
            <div className="flex gap-3">
                <button className="px-3 bg-primary font-semibold text-white ">
                    Filter
                </button>
                <button className="px-3 bg-primary font-semibold text-white ">
                    Sort By
                </button>
                <button className="px-3 bg-primary font-semibold text-white ">
                    View
                </button>
            </div>
        </div>
    );
};

export default RoleTabContent;
