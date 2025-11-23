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
import { useAllRelease, useDeleteRelease } from "@/hooks/useRelease";
import ReleaseModal from "../modal/ReleaseModal";
import ReleaseStatusTag from "../ReleaseStatusTag";

const ReleaseTable = () => {
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
            title: "Release Name",
            dataIndex: "name",
            key: "name",
            ellipsis: true,
            width: 150,
        },

        {
            title: "Version",
            dataIndex: "version",
            key: "version",
            ellipsis: true,
            width: 80,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            ellipsis: true,
            width: 150,
            render: (value) => <ReleaseStatusTag status={value} />,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
            width: 200,
        },
        {
            title: "Start Date",
            dataIndex: "startDate",
            key: "startDate",
            ellipsis: true,
            width: 120,
            render: (value: string) => (
                <span className="email-ellipsis">{formatDateDMY(value)}</span>
            ),
        },

        {
            title: "End Date",
            dataIndex: "endDate",
            key: "endDate",
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
                        title="Delete this release?"
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

    const { data, isLoading } = useAllRelease(page, limit);
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    const [selectedRelease, setSelectedRelease] = useState()
    const { mutate, isPending: isDeleting } = useDeleteRelease()


    const handleEdit = (record: any) => {
        setSelectedRelease(record);
        setOpenEdit(true);
    };

    const handleDelete = (record: any) => {
        mutate(record.id, {
            onSuccess: () => {
                toast.success("Delete release successful");
            },
            onError: () => {
                toast.error("Delete release failed");
            }
        });
    };
    return (
        <div className="p-3 flex flex-col gap-2">
            <ButtonGroup onAdd={() => setOpenAdd(true)} title="Add release" />

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
            {openAdd && <ReleaseModal open={openAdd} setOpen={setOpenAdd} mode="add" />}
            {openEdit && <ReleaseModal open={openEdit} setOpen={setOpenEdit} mode="edit" selectedRelease={selectedRelease} />}
        </div>
    )
}



export default ReleaseTable