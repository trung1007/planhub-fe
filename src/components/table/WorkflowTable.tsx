"use client";
import { Button, Popconfirm } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import ButtonGroup from "../ButtonGroupTable";
import { toast } from "react-toastify";
import { formatDateDMY } from "@/utils/format";
import { useAllWorkflow, useDeleteWorkflow } from "@/hooks/useWorkflow";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const WorkflowTable = () => {
  const limit = 10;
  const [page, setPage] = useState(1);
  const router = useRouter();
  const columns: ColumnsType<any> = [
    {
      title: "No",
      key: "no",
      align: "center",
      width: 60,
      fixed: "left" as const,
      render: (_: any, __: any, index: number) =>
        (page - 1) * limit + index + 1,
    },
    {
      title: "Workflow",
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
      width: 80,
    },
    {
      title: "Project",
      dataIndex: "projectName",
      key: "projectName",
      ellipsis: true,
      width: 150,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: 200,
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
      title: "Updated at",
      dataIndex: "updatedAt",
      key: "updatedAt",
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
          <Button
            size="small"
            type="primary"
            onClick={() => handleEdit(record)}
          >
            <FaEdit />
          </Button>
          <Popconfirm
            title="Delete this workflow?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small">
              <FaTrash />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const { data, isLoading } = useAllWorkflow(page, limit);
  const { mutate, isPending: isDeleting } = useDeleteWorkflow();

  const handleEdit = (record: any) => {
    if (record) {
      router.push(`/workflow/action/${record.id}`);
    }

    // setSelectedRelease(record);
    // setOpenEdit(true);
  };

  const handleDelete = (record: any) => {
    Cookies.set("action_project_id", record.projectId.toString());
    mutate(record.id, {
      onSuccess: () => {
        toast.success("Delete workflow successful");
      },
       onError: (error: any) => {
        if (error?.response?.data?.statusCode === 403) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Delete workflow failed");
        }
      },
    });
  };
  return (
    <div className="p-3 flex flex-col gap-2">
      <ButtonGroup
        onAdd={() => router.push("/workflow/action")}
        title="Add Workflow"
      />

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
        scroll={{ x: true }}
        tableLayout="fixed"
      />
    </div>
  );
};

export default WorkflowTable;
