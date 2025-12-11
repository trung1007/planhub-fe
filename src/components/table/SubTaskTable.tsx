"use client";

import { useState } from "react";
import Table, { ColumnsType } from "antd/es/table";
import { Button, Popconfirm } from "antd";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import ButtonGroup from "../ButtonGroupTable";
import { useAllSubtask, useDeleteIssue } from "@/hooks/useIssue";
import { IssuePriorityTag } from "../tag/IssuePriorityTag";
import { IssueStatusTag } from "../tag/IssueStatusTag";
import { IssueTypeTag } from "../tag/IssueTypeTag";
import { IssueTagList } from "../tag/IssueTagList";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import IssueModal from "../modal/IssueModal";

const SubTaskTable = ({
  issueId,
  parrentSprintId,
}: {
  issueId: number;
  parrentSprintId?: number;
}) => {
  const limit = 10;
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { data, isLoading } = useAllSubtask(issueId, page, limit);

  const goToView = (record: any) => {
    router.push(`/issue/${record.id}`);
  };

  // Giống ReleaseTable nhưng đổi tên cột
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
      width: 150,
    },

    {
      title: "Reporter",
      dataIndex: "reporterName",
      key: "reporterName",
      ellipsis: true,
      width: 150,
    },

    {
      title: "Sprint",
      dataIndex: "sprintName",
      key: "sprintName",
      ellipsis: true,
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (value) => <IssueStatusTag status={value} />,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 120,
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
          <Button
            size="small"
            type="primary"
            onClick={() => handleEdit(record)}
          >
            <FaEdit />
          </Button>
          <Popconfirm
            title="Delete this issue?"
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

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState();

  const { mutate, isPending: isDeleting } = useDeleteIssue();

  const handleEdit = (record: any) => {
    setSelectedIssue({
      ...record,
      parentIssueId: issueId,
    });
    setOpenEdit(true);
  };

  const handleDelete = (record: any) => {
    mutate(record.id, {
      onSuccess: () => {
        toast.success("Delete issue successful");
      },
      // onError: () => {
      //     toast.error("Delete issue failed");
      // }
      onError: (error: any) => {
        if (error?.response?.data?.statusCode === 403) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Delete issue failed");
        }
      },
    });
  };

  return (
    <div className="p-3 flex flex-col gap-2">
      <ButtonGroup onAdd={() => setOpenAdd(true)} title="Add sub-task" />
      <Table
        rowKey="id"
        className="custom-table"
        columns={columns}
        dataSource={data?.items}
        pagination={{
          current: page,
          pageSize: limit,
          total: data?.total || 0,
          onChange: (p) => setPage(p),
        }}
        scroll={{ x: true }}
      />
      {openAdd && (
        <IssueModal
          open={openAdd}
          setOpen={setOpenAdd}
          mode="add"
          parrentId={issueId}
          parrentSprintId={parrentSprintId}
        />
      )}
      {openEdit && (
        <IssueModal
          open={openEdit}
          setOpen={setOpenEdit}
          mode="edit"
          selectedIssue={selectedIssue}
          parrentSprintId={parrentSprintId}
        />
      )}
    </div>
  );
};

export default SubTaskTable;
