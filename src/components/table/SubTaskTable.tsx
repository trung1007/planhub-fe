"use client";

import { useEffect, useState } from "react";
import Table, { ColumnsType } from "antd/es/table";
import { Button, InputNumber, Modal, Popconfirm } from "antd";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import ButtonGroup from "../ButtonGroupTable";
import {
  useAllSubtask,
  useDeleteIssue,
  useGenerateSubtask,
} from "@/hooks/useIssue";
import { IssuePriorityTag } from "../tag/IssuePriorityTag";
import { IssueStatusTag } from "../tag/IssueStatusTag";
import { IssueTypeTag } from "../tag/IssueTypeTag";
import { IssueTagList } from "../tag/IssueTagList";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import IssueModal from "../modal/IssueModal";

const SubTaskTable = ({
  issueId,
  parrentSprintId,
  projectId,
  setNumOfSubtask,
}: {
  issueId: number;
  parrentSprintId?: number;
  projectId?: number;
  setNumOfSubtask: (count: number) => void;
}) => {
  const limit = 10;
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { data, isLoading, refetch, isFetching } = useAllSubtask(
    issueId,
    page,
    limit
  );

  const goToView = (record: any) => {
    router.push(`/issue/${record.id}`);
  };

  useEffect(() => {
    setNumOfSubtask(data?.total);
  }, [data]);

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
      title: "Sprint",
      dataIndex: "sprintName",
      key: "sprintName",
      ellipsis: true,
      width: 120,
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
      parrentSprintId: parrentSprintId,
    });
    setOpenEdit(true);
  };

  const handleDelete = (record: any) => {
    if (projectId) {
      Cookies.set("action_project_id", projectId.toString());
    }

    mutate(record.id, {
      onSuccess: () => {
        toast.success("Delete issue successful");
      },
      onError: (error: any) => {
        if (error?.response?.data?.statusCode === 403) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Delete issue failed");
        }
      },
    });
  };

  const { mutate: mutationGenerate, isPending: isGenerating } =
    useGenerateSubtask();

  const [openGenModal, setOpenGenModal] = useState(false);
  const [subtaskCount, setSubtaskCount] = useState<number>(3); // default

  const [isPolling, setIsPolling] = useState(false);
  const [pollMeta, setPollMeta] = useState<{
    startedAt: number;
    beforeTotal: number;
    expectedDelta: number;
    beforeIds: Set<number>;
  } | null>(null);

  const POLL_INTERVAL_MS = 2000;
  const POLL_TIMEOUT_MS = 60000;

  const handleGenerateSubtask = () => {
    const beforeTotal = data?.total ?? 0;
    const beforeIds = new Set<number>(
      (data?.items ?? []).map((x: any) => x.id)
    );
    mutationGenerate(
      { issueId, max_subtasks: subtaskCount },
      {
        onSuccess: () => {
          toast.info("Request submitted, AI agent is processing...");
          setOpenGenModal(false);

          setPollMeta({
            startedAt: Date.now(),
            beforeTotal,
            expectedDelta: subtaskCount,
            beforeIds,
          });
          setIsPolling(true);
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || "Failed to generate subtasks"
          );
        },
      }
    );
  };

  useEffect(() => {
    if (!isPolling) return;
    const t = setInterval(() => {
      refetch?.(); // refetch list subtasks
    }, POLL_INTERVAL_MS);

    return () => clearInterval(t);
  }, [isPolling, refetch]);

  useEffect(() => {
    if (!isPolling || !pollMeta) return;

    const now = Date.now();
    if (now - pollMeta.startedAt > POLL_TIMEOUT_MS) {
      setIsPolling(false);
      toast.warn(
        "The AI ​​agent is still processing. Please wait a little longer or refresh the page later."
      );
      return;
    }

    const total = data?.total ?? 0;
    const items = data?.items ?? [];
    const hasNewId = items.some((x: any) => !pollMeta.beforeIds.has(x.id));
    const enoughTotal = total >= pollMeta.beforeTotal + pollMeta.expectedDelta;

    if (hasNewId || enoughTotal) {
      setIsPolling(false);
      toast.success("Sub-task generated successfully");
    }
  }, [data?.total, data?.items, isPolling, pollMeta]);

  return (
    <div className="p-3 flex flex-col gap-2">
      <ButtonGroup
        onAdd={() => setOpenAdd(true)}
        title="Add sub-task"
        secondTitle="Add sub-task with AI agent"
        onSecond={() => {
          if (isGenerating || isPolling) return;
          setOpenGenModal(true);
        }}
      />
      <Table
        rowKey="id"
        className="custom-table"
        columns={columns}
        dataSource={data?.items}
        loading={isLoading || isFetching || isPolling}
        pagination={{
          current: page,
          pageSize: limit,
          total: data?.total || 0,
          onChange: (p) => setPage(p),
        }}
        scroll={{ x: "100%" }}
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

      <Modal
        title="Generate subtasks with AI agent"
        open={openGenModal}
        onCancel={() => setOpenGenModal(false)}
        onOk={handleGenerateSubtask}
        okText={isGenerating ? "Generating..." : "Generate"}
        cancelText="Cancel"
        confirmLoading={isGenerating}
        okButtonProps={{ disabled: isGenerating || isPolling }}
      >
        <div className="flex flex-col gap-2">
          <div className="text-sm text-gray-600">
            Nhập số lượng subtask muốn tạo (1 - 12)
          </div>
          <InputNumber
            min={1}
            max={12}
            value={subtaskCount}
            onChange={(v) => setSubtaskCount(Number(v || 1))}
            style={{ width: "100%" }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default SubTaskTable;
