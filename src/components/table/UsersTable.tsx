"use client";
import { useAllUser } from "@/hooks/useUser";
import { Button, Popconfirm } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddUserModal from "../modal/AddUserModal";
import EditUserModal from "../modal/EditUserModal";
import ButtonGroup from "../ButtonGroupTable";

const UsersTable = () => {
    const limit = 10
    const [page, setPage] = useState(1);
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
            title: "Full Name",
            dataIndex: "fullName",
            key: "fullName",
            ellipsis: true,
            width: 150,
        },
        {
            title: "Username",
            dataIndex: "username",
            key: "username",
            ellipsis: true,
            width: 120,
        },
        {
            title: "Phone",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            ellipsis: true,
            width: 120,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            ellipsis: true,
            width: 180,
            render: (value: string) => (
                <span className="email-ellipsis">{value}</span>
            ),
        },

        {
            title: "Created",
            dataIndex: "createdBy",
            key: "createdBy",
            align: "center",
            ellipsis: true,
            width: 150,
        },
        {
            title: "Updated",
            dataIndex: "updatedBy",
            key: "updatedBy",
            align: "center",
            ellipsis: true,
            width: 150,
        },

        {
            title: "Action",
            key: "action",
            width: 120,
            fixed: "right" as const,
            render: (_: any, record: any) => (
                <div className="flex gap-1">
                    <Button size="small" type="primary" onClick={() => handleEdit(record)}>
                        <FaEdit />
                    </Button>
                    <Popconfirm
                        title="Delete this user?"
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

    const { data, isLoading } = useAllUser(page, limit);
    const [openAdd, setOpenAdd] = useState(false);

    const [openEdit, setOpenEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const handleEdit = (record: any) => {
        setSelectedUser(record);
        setOpenEdit(true);
    };

    const handleDelete = (record: any) => {
        console.log("Delete user:", record);
        // gọi API xóa user
    };
    return (
        <div className="p-3 flex flex-col gap-2">
            <ButtonGroup onAdd={() => setOpenAdd(true)} title="Add an user"/>

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
            {openAdd && <AddUserModal openAdd={openAdd} setOpenAdd={setOpenAdd} />}
            {openEdit && (
                <EditUserModal open={openEdit} setOpen={setOpenEdit} user={selectedUser} />
            )}
        </div>
    )
}



export default UsersTable