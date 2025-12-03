"use client";
import { Button, Checkbox, Popconfirm } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import ButtonGroup from "../ButtonGroupTable";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAllIssue, useAllIssuesIds, useAssignIssueToSprint, useDeleteIssue, useListIssue } from "@/hooks/useIssue";
import IssueModal from "../modal/IssueModal";
import { IssueTagList } from "../tag/IssueTagList";
import { IssueStatusTag } from "../tag/IssueStatusTag";
import { IssuePriorityTag } from "../tag/IssuePriorityTag";
import { IssueTypeTag } from "../tag/IssueTypeTag";


const IssueTable = () => {
    const limit = 10
    const [page, setPage] = useState(1);
    const router = useRouter()
    const [selectedIssues, setSelectedIssues] = useState<{ id: number; name: string }[]>([]);
    const { data: listIssues, refetch: fetchListIssue } = useListIssue();
    const allIds = listIssues?.length || [];

    const handleSelectAll = async (checked: boolean) => {
        if (!checked) {
            setSelectedIssues([]);
            return;
        }

        // lấy toàn bộ issue đang hiển thị
        const selected = listIssues.map((i: any) => ({
            id: i.id,
            name: i.name,
        }));

        setSelectedIssues(selected);
    };


    const handleSelectOne = (id: number, name: string, checked: boolean) => {
        if (checked)
            setSelectedIssues((prev) => [...prev, { id, name }]);
        else
            setSelectedIssues((prev) => prev.filter((x) => x.id !== id));
    };
    const { mutate: assiginIssue, isPending } = useAssignIssueToSprint();

    const handleAddToSprint = () => {
        if (selectedIssues.length === 0) {
            toast.warning("Please select at least one issue.");
            return;
        }

        selectedIssues.forEach(({ id, name }) => {
            assiginIssue(id, {
                onSuccess: () => {
                    toast.success(`Assign issue "${name}" successfully!`);
                    setSelectedIssues((prev) => prev.filter((i) => i.id !== id));
                },
                onError: () => {
                    toast.warn(`Failed to assign issue "${name}"!`);
                },
            });
        });
    };

    const columns: ColumnsType<any> = [
        {
            title: (
                <Checkbox
                    checked={
                        allIds > 0 &&
                        selectedIssues.length === allIds
                    }
                    indeterminate={
                        selectedIssues.length > 0 &&
                        selectedIssues.length < allIds
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                />
            ),
            key: "checkbox",
            width: 50,
            align: "center",
            render: (_: any, record: any) => (
                <Checkbox
                    checked={selectedIssues.some((s) => s.id === record.id)}
                    onChange={(e) =>
                        handleSelectOne(record.id, record.name, e.target.checked)
                    }
                />
            ),
        },
        {
            title: "Issue Name",
            dataIndex: "name",
            key: "name",
            ellipsis: true,
            width: 120,
        },

        {
            title: "Tags",
            dataIndex: "tags",
            key: "tags",
            width: 150,
            render: (tags) => <IssueTagList tags={tags} />,
        },

        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: 150,
            render: (type) => <IssueTypeTag type={type} />,
        },

        {
            title: "Summary",
            dataIndex: "summary",
            key: "summary",
            ellipsis: true,
            width: 150,
        },

        {
            title: "Assignee",
            dataIndex: "assigneeName",
            key: "assigneeName",
            ellipsis: true,
            width: 120,
        },

        {
            title: "Reporter",
            dataIndex: "reporterName",
            key: "reporterName",
            ellipsis: true,
            width: 120,
        },

        {
            title: "Active Sprint",
            dataIndex: "activeSprint",
            key: "activeSprint",
            ellipsis: true,
            width: 150,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 100,
            render: (value) => <IssueStatusTag status={value} />,
        },
        {
            title: "Priority",
            dataIndex: "priority",
            key: "priority",
            width: 100,
            render: (value) => <IssuePriorityTag priority={value} />,
        },
        {
            title: "Action",
            key: "action",
            width: 120,
            fixed: "right" as const,
            render: (_: any, record: any) => (
                <div className="flex gap-1">
                    <Button size="small" type="default" onClick={() => goToView(record)}>
                        <FaEye />
                    </Button>
                    <Button size="small" type="primary" onClick={() => handleEdit(record)}>
                        <FaEdit />
                    </Button>
                    <Popconfirm
                        title="Delete this issue?"
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

    const { data, isLoading } = useAllIssue(page, limit);
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    const [selectedIssue, setSelectedIssue] = useState()
    const { mutate, isPending: isDeleting } = useDeleteIssue()

    const goToView = (record: any) => {
        router.push(`/issue/${record.id}`)
    }

    const handleEdit = (record: any) => {
        setSelectedIssue(record);
        setOpenEdit(true);
    };

    const handleDelete = (record: any) => {
        mutate(record.id, {
            onSuccess: () => {
                toast.success("Delete issue successful");
            },
            onError: () => {
                toast.error("Delete issue failed");
            }
        });
    };

    const goToSprint = () => {
        router.push('/sprint')
    }
    return (
        <div className="p-3 flex flex-col gap-2 w-full overflow-x-auto">
            <ButtonGroup onAdd={() => setOpenAdd(true)}
                title="Create an issue"
                secondTitle="Add to active sprint"
                onSecond={() => {
                    if (selectedIssues.length === 0) {
                        toast.warn("Please select at least 1 issue");
                        return;
                    }
                    handleAddToSprint()
                }}
                thirdTitle="Manage sprint"
                onThird={goToSprint} />

            <Table
                rowKey="id"
                className="custom-table w-full"
                columns={columns}
                dataSource={data?.items || []}
                loading={isLoading || isPending || isDeleting}
                pagination={{
                    current: page,
                    pageSize: limit,
                    total: data?.total || 0,
                    onChange: (p) => setPage(p),
                }}
                onRow={() => ({
                    style: { cursor: "pointer" },
                })}
                scroll={{ x: true }}
            // tableLayout="fixed"
            />
            {openAdd && <IssueModal open={openAdd} setOpen={setOpenAdd} mode="add" />}
            {openEdit && <IssueModal open={openEdit} setOpen={setOpenEdit} mode="edit" selectedIssue={selectedIssue} />}

        </div>
    )
}



export default IssueTable