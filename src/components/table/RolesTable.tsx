import { useAllRole, useDeleteRole } from "@/hooks/useRole";
import Table, { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import RoleModal from "../modal/RoleModal";
import { Button, Popconfirm } from "antd";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import ButtonGroup from "../ButtonGroupTable";

const RolesTable = ({setRoleScreen, selectedRole, setSelectedRole }: any) => {
    const [page, setPage] = useState(1);
    const limit = 6;

    const { data, isLoading } = useAllRole(page, limit);
    const [openAdd, setOpenAdd] = useState(false);

    const [openEdit, setOpenEdit] = useState(false);
    const handleView = (record: any) => {
        setSelectedRole(record);
        setRoleScreen("permission");
    };
    const handleEdit = (record: any) => {
        console.log(record);
        
        setSelectedRole(record);
        setOpenEdit(true);
    };

    const { mutate, isPending: isDeleting } = useDeleteRole()


    const handleDelete = (record: any) => {
        mutate(record.id, {
            onSuccess: () => {
                toast.success("Delete role successful");
            },
            onError: () => {
                toast.error("Delete role failed");
            }
        });
    };

    useEffect(()=>{
        console.log("selectedRole", selectedRole);
        
    },[selectedRole])


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
    return (
        <div className="p-3 flex flex-col gap-2">
            <ButtonGroup onAdd={() => setOpenAdd(true)} title="Add a role" />
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
            {openAdd && <RoleModal open={openAdd} setOpen={setOpenAdd} mode="add" />}

            {openEdit && (
                <RoleModal open={openEdit} setOpen={setOpenEdit} mode="edit" defaultValues={selectedRole} role={selectedRole} />
            )}
        </div>
    )
}

export default RolesTable