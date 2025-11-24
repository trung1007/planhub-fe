"use client";
import { Button, Popconfirm } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import ButtonGroup from "../ButtonGroupTable";
import { toast } from "react-toastify";

import { formatDateDMY } from "@/utils/format";
import { useAllRelease, useDeleteRelease } from "@/hooks/useRelease";
import ReleaseStatusTag from "../ReleaseStatusTag";
import SprintModal from "../modal/SprintModal";
import { useDeleteSprint } from "@/hooks/useSprint";

const SprintTable = () => {
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
            width: 150,
        },

        {
            title: "Release",
            dataIndex: "releaseName",
            key: "releaseName",
            ellipsis: true,
            width: 80,
        },
        // {
        //     title: "Status",
        //     dataIndex: "status",
        //     key: "status",
        //     ellipsis: true,
        //     width: 150,
        //     render: (value) => <ReleaseStatusTag status={value} />,
        // },
        // {
        //     title: "Description",
        //     dataIndex: "description",
        //     key: "description",
        //     ellipsis: true,
        //     width: 200,
        // },
        {
            title: "Is Active",
            dataIndex: "isActive",
            key: "isActive",
            ellipsis: true,
            width: 150,
            render: (value) => <ReleaseStatusTag status={value} />,
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

    const [selectedSprint, setSelectedSprint] = useState()
    const { mutate, isPending: isDeleting } = useDeleteSprint()


    const handleEdit = (record: any) => {
        setSelectedSprint(record);
        setOpenEdit(true);
    };

    const handleDelete = (record: any) => {
        mutate(record.id, {
            onSuccess: () => {
                toast.success("Delete sprint successful");
            },
            onError: () => {
                toast.error("Delete sprint failed");
            }
        });
    };
    return (
        <div className="p-3 flex flex-col gap-2">
            <ButtonGroup onAdd={() => setOpenAdd(true)} title="Add Sprint" />

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
            {openAdd && <SprintModal open={openAdd} setOpen={setOpenAdd} mode="add" />}
            {openEdit && <SprintModal open={openEdit} setOpen={setOpenEdit} mode="edit" selectedSprint={selectedSprint} />}
        </div>
    )
}



export default SprintTable