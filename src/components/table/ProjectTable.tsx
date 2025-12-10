"use client";
import { Button, Popconfirm } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddUserModal from "../modal/AddUserModal";
import EditUserModal from "../modal/EditUserModal";
import ButtonGroup from "../ButtonGroupTable";
import { useAllProject, useDeleteProject } from "@/hooks/useProject";
import ProjectModal from "../modal/ProjectModal";
import { toast } from "react-toastify";

const ProjectTable = () => {
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
            title: "Code",
            dataIndex: "code",
            key: "code",
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
            title: "Owner",
            dataIndex: "creatorName",
            key: "creatorName",
            ellipsis: true,
            width: 180,
            // render: (value: string) => (
            //     <span className="email-ellipsis">{value}</span>
            // ),
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
                        title="This will delete anything related. Delete this project?."
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

    const { data, isLoading } = useAllProject(page, limit);
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    const [selectedProject, setSelectedProject] = useState()
    const { mutate, isPending: isDeleting } = useDeleteProject()


    const handleEdit = (record: any) => {
        setSelectedProject(record);
        setOpenEdit(true);
    };

    const handleDelete = (record: any) => {
        mutate(record.id, {
            onSuccess: () => {
                toast.success("Delete project successful");
            },
            onError: () => {
                toast.error("Delete project failed");
            }
        });
    };
    return (
        <div className="p-3 flex flex-col gap-2">
            <ButtonGroup onAdd={() => setOpenAdd(true)} title="Add a project" />

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
            {openAdd && <ProjectModal open={openAdd} setOpen={setOpenAdd} mode="add" />}
            {openEdit && <ProjectModal open={openEdit} setOpen={setOpenEdit} mode="edit" selectedProject={selectedProject} />}
        </div>
    )
}



export default ProjectTable