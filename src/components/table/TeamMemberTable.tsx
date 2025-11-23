"use client";
import { Button, Popconfirm } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import ButtonGroup from "../ButtonGroupTable";
import { toast } from "react-toastify";
import TeamMemberModal from "../modal/TeamMemberModal";
import { useAllProjectMember, useDeleteProjectMember } from "@/hooks/useProjectMember";

import { formatDateDMY } from "@/utils/format";

const TeamMemberTable = () => {
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
            title: "Project",
            dataIndex: "projectName",
            key: "projectName",
            ellipsis: true,
            width: 150,
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
            width: 180,
        },
        {
            title: "Phone Number",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            ellipsis: true,
            width: 150,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            ellipsis: true,
            width: 200,
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            ellipsis: true,
            width: 80,
        },
        {
            title: "Join Date",
            dataIndex: "joinDate",
            key: "joinDate",
            ellipsis: true,
            width: 120,
            render: (value: string) => (
                <span className="email-ellipsis">{formatDateDMY(value)}</span>
            ),
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
                        title="Delete this member?"
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

    const { data, isLoading } = useAllProjectMember(page, limit);
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    const [selectedMember, setSelectedMember] = useState()
    const { mutate, isPending: isDeleting } = useDeleteProjectMember()


    const handleEdit = (record: any) => {
        setSelectedMember(record);
        setOpenEdit(true);
    };

    const handleDelete = (record: any) => {
        mutate(record.id, {
            onSuccess: () => {
                toast.success("Delete member successful");
            },
            onError: () => {
                toast.error("Delete member failed");
            }
        });
    };
    return (
        <div className="p-3 flex flex-col gap-2">
            <ButtonGroup onAdd={() => setOpenAdd(true)} title="Add member" />

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
            {openAdd && <TeamMemberModal open={openAdd} setOpen={setOpenAdd} mode="add" />}
            {openEdit && <TeamMemberModal open={openEdit} setOpen={setOpenEdit} mode="edit" selectedMember={selectedMember} />}
        </div>
    )
}



export default TeamMemberTable