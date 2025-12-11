"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button, Table, Popconfirm, Input, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaEdit, FaFlag, FaTrash } from "react-icons/fa";

import ActionWorkflowDiagram from "@/components/ActionFlowTest";
import StatusModal from "@/components/modal/StatusModal";
import FormRow from "@/components/FormRow";
import { Controller, useForm } from "react-hook-form";
import { useListProject } from "@/hooks/useProject";
import { WorkflowInput, WorkflowSchema } from "@/schemas/workflow.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import TransitionModal from "@/components/modal/TransitionModal";
import { useRouter } from "next/navigation";
import { FaArrowLeftLong } from "react-icons/fa6";
import {
  useAddWorkflow,
  useEditWorkflow,
  useGetDetailWorkflow,
  useGetStatusWorkflow,
  useGetTransitionWorkflow,
} from "@/hooks/useWorkflow";
import { toast } from "react-toastify";
import { IssueStatusTag } from "@/components/tag/IssueStatusTag";
import Cookies from "js-cookie";

// ==============================
// Types
// ==============================

interface StatusItem {
  id: number;
  name: string;
  // color: string;
  isInitial: boolean;
  isFinal: boolean;
}

interface TransitionItem {
  id: number;
  name: string;
  from: string | null;
  to: string;
  fromId: number;
  toId: number;
}

const ActionWorkflow = ({ id }: { id?: number }) => {
  const [activeTab, setActiveTab] = useState<"status" | "transition">("status");
  const [listStatusTemp, setListStatusTemp] = useState<StatusItem[]>([]);
  const [listTransitionTemp, setListTransitionTemp] = useState<
    TransitionItem[]
  >([]);

  const { data: workflowDetail, isLoading } = useGetDetailWorkflow(id!);
  const { data: statusList, isLoading: loadingStatuses } = useGetStatusWorkflow(
    id!
  );
  const { data: transitionList, isLoading: loadingTransitions } =
    useGetTransitionWorkflow(id!);

  const router = useRouter();

  const [openAddStatus, setOpenAddStatus] = useState(false);
  const [openEditStatus, setOpenEditStatus] = useState(false);
  const [openAddTransition, setOpenAddTransiton] = useState(false);
  const [openEditTransition, setOpenEditTransition] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedTransition, setSelectedTransition] = useState(null);

  const { mutate: mutationAdd, isPending: isAdding } = useAddWorkflow();

  const { mutate: mutationEdit, isPending: isEditing } = useEditWorkflow();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<WorkflowInput>({
    resolver: zodResolver(WorkflowSchema),
    defaultValues: {
      name: "",
      key: "",
      version: "",
      projectId: undefined,
      description: "",
    },
  });

  useEffect(() => {
    if (!workflowDetail) return;

    // 1. Map workflow info vào form
    reset({
      name: workflowDetail.name,
      key: workflowDetail.key,
      version: workflowDetail.version,
      projectId: workflowDetail.project?.id,
      description: workflowDetail.description,
    });
  }, [workflowDetail]);

  const projectId = watch("projectId");

  useEffect(() => {
    if (!statusList) return;

    setListStatusTemp(
      statusList.map((s: any) => ({
        id: s.id,
        name: s.name,
        // color: s.color,
        isInitial: s.is_start,
        isFinal: s.is_final,
      }))
    );
  }, [statusList]);

  useEffect(() => {
    if (!transitionList) return;

    setListTransitionTemp(
      transitionList.map((t: any) => ({
        id: t.id,
        name: t.name,
        from: t.from,
        to: t.to,
        fromId: t.status_id_from,
        toId: t.status_id_to,
      }))
    );
  }, [transitionList]);

  const statusColumns: ColumnsType<StatusItem> = [
    {
      title: "Name",
      dataIndex: "name",
      width: 100,
      render: (value) => <IssueStatusTag status={value} />,
    },
    // {
    //   title: "Color",
    //   dataIndex: "color",
    //   width: 80,
    //   render: (value: string) => (
    //     <span style={{ color: value, fontWeight: "bold" }}>{value}</span>
    //   ),
    // },
    {
      title: "Is Initial?",
      dataIndex: "isInitial",
      width: 80,
      render: (value: boolean) =>
        value ? (
          <div className="w-full flex justify-center">
            <FaFlag className="text-green-500" />
          </div>
        ) : (
          <div className="w-full text-center">-</div>
        ),
    },
    {
      title: "Is Final?",
      dataIndex: "isFinal",
      width: 80,
      render: (value: boolean) =>
        value ? (
          <div className="w-full flex justify-center">
            <FaFlag className="text-green-500" />
          </div>
        ) : (
          <div className="w-full text-center">-</div>
        ),
    },
    {
      title: "Action",
      width: 80,
      render: (_, record) => (
        <div className="flex gap-1">
          <Button
            size="small"
            type="primary"
            onClick={() => handleEditStatus(record)}
          >
            <FaEdit />
          </Button>

          <Popconfirm
            title="Delete this status?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteStatus(record.id)}
          >
            <Button danger size="small">
              <FaTrash />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const transitionColumns: ColumnsType<TransitionItem> = [
    {
      title: "Name",
      dataIndex: "name",
      width: 120,
    },
    {
      title: "From",
      dataIndex: "from",
      width: 120,
      // render: (v) => v ?? "-",
      render: (value) => <IssueStatusTag status={value} />,
    },
    {
      title: "To",
      dataIndex: "to",
      width: 120,
      render: (value) => <IssueStatusTag status={value} />,
    },
    {
      title: "Action",
      width: 120,
      render: (_, record) => (
        <div className="flex gap-1">
          <Button
            size="small"
            type="primary"
            onClick={() => handleEditTransition(record)}
          >
            <FaEdit />
          </Button>

          <Popconfirm
            title="Delete transition?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteTransition(record.id)}
          >
            <Button danger size="small">
              <FaTrash />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const { data: projectList } = useListProject();

  const onSubmit = (data: WorkflowInput) => {
    const payload = {
      ...data,
      statuses: listStatusTemp,
      transitions: listTransitionTemp,
    };
    if (id) {
      Cookies.set("action_project_id", projectId.toString());
      mutationEdit(
        { id: id, data: payload },
        {
          onSuccess: () => {
            toast.success("Update workflow successfully");
            router.push("/workflow");
          },
          // onError: (error: any) => {
          //   console.log("error:", error);
          //   toast.error("Update workflow failed");
          // },
          onError: (error: any) => {
            if (error?.response?.data?.statusCode === 403) {
              toast.error(error?.response?.data?.message);
            } else {
              toast.error("Update workflow failed");
            }
          },
        }
      );
    } else {
      Cookies.set("action_project_id", projectId.toString());
      mutationAdd(payload, {
        onSuccess: () => {
          toast.success("Create workflow successfully");
          router.push("/workflow");
        },
        onError: (error: any) => {
          if (error?.response?.data?.statusCode === 403) {
            toast.error(error?.response?.data?.message);
          } else {
            toast.error("Created workflow failed");
          }
        },
        // onError: (error: any) => {
        //   console.log("error:", error);
        //   toast.error("Created workflow failed");
        // },
      });
    }
  };

  const handleEditStatus = (status: any) => {
    if (status) {
      setSelectedStatus({
        ...status,
        oldName: status.name,
        is_start: status.isInitial,
        is_final: status.isFinal,
      });
    }
    setOpenEditStatus(true);
  };

  const handleEditTransition = (transition: any) => {
    if (!transition) return;

    const fromStatus = listStatusTemp.find(
      (s) => s.name.toLowerCase() === transition.from?.toLowerCase()
    );

    const toStatus = listStatusTemp.find(
      (s) => s.name.toLowerCase() === transition.to?.toLowerCase()
    );
    if (transition) {
      setSelectedTransition({
        ...transition,
        status_id_from: fromStatus?.id,
        status_id_to: toStatus?.id,
      });
    }
    setOpenEditTransition(true);
  };

  const handleUpdateStatus = (updatedStatus: any) => {
    setListStatusTemp((prevList) =>
      prevList.map((status) =>
        status.id === updatedStatus.id ? updatedStatus : status
      )
    );

    // Update transitions using the old name → new name
    setListTransitionTemp((prevTransitions) =>
      prevTransitions.map((transition) => {
        const updated = { ...transition };

        // Nếu transition.from = tên cũ → đổi sang tên mới
        if (
          transition.from?.toLowerCase() ===
          updatedStatus.oldName?.toLowerCase()
        ) {
          updated.from = updatedStatus.name;
        }

        // Nếu transition.to = tên cũ → đổi sang tên mới
        if (
          transition.to?.toLowerCase() === updatedStatus.oldName?.toLowerCase()
        ) {
          updated.to = updatedStatus.name;
        }

        return updated;
      })
    );

    setOpenEditStatus(false);
  };

  const handleUpdateTransition = (updatedTransition: any) => {
    setListTransitionTemp((prevList) =>
      prevList.map((transition) =>
        transition.id === updatedTransition.id ? updatedTransition : transition
      )
    );
    setOpenEditTransition(false);
  };

  const handleDeleteStatus = (id: number) => {
    setListStatusTemp((prev) => prev.filter((s) => s.id !== id));
    setListTransitionTemp((prev) =>
      prev.filter((t) => t.fromId !== id && t.toId !== id)
    );
  };

  const handleDeleteTransition = (id: number) => {
    setListTransitionTemp((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="flex w-full h-full p-4 gap-4">
      {/* LEFT PANEL */}
      <div className="w-[40%] flex flex-col gap-3 border rounded-lg shadow-sm bg-white p-4">
        <h2 className="flex items-center gap-3 text-xl font-semibold mb-4">
          <button onClick={() => router.back()}>
            <FaArrowLeftLong />
          </button>
          Workflow Information
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <FormRow label="Workflow" error={errors.name?.message}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Workflow" />
              )}
            />
          </FormRow>

          {/* Role Key */}
          <FormRow label="Key" error={errors.key?.message}>
            <Controller
              name="key"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Workflow Key" />
              )}
            />
          </FormRow>

          <FormRow label="Version" error={errors.version?.message}>
            <Controller
              name="version"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Workflow version" />
              )}
            />
          </FormRow>

          <FormRow label="Project" error={errors.projectId?.message}>
            <Controller
              name="projectId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Select project"
                  className="w-full"
                  options={projectList?.map((p: any) => ({
                    label: p.name,
                    value: p.id,
                  }))}
                />
              )}
            />
          </FormRow>

          {/* Description */}
          <FormRow label="Description" error={errors.description?.message}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input.TextArea {...field} placeholder="Description" rows={3} />
              )}
            />
          </FormRow>
          {/* TABS */}
          <div className="flex gap-4 border-b pb-2 mb-4">
            <button
              type="button"
              className={
                activeTab === "status" ? "font-bold text-blue-600" : ""
              }
              onClick={() => setActiveTab("status")}
            >
              Status
            </button>

            <button
              type="button"
              className={
                activeTab === "transition" ? "font-bold text-blue-600" : ""
              }
              onClick={() => setActiveTab("transition")}
            >
              Transition
            </button>
          </div>
          {/* STATUS TABLE */}
          {activeTab === "status" && (
            <>
              <button
                type="button"
                className="px-3 bg-primary w-fit text-white font-semibold cursor-pointer "
                onClick={() => setOpenAddStatus(true)}
              >
                Add status
              </button>
              <Table
                key={"StatusTab"}
                rowKey="id"
                columns={statusColumns}
                dataSource={listStatusTemp}
                pagination={false}
                size="small"
              />
            </>
          )}
          {/* TRANSITION TABLE */}
          {activeTab === "transition" && (
            <>
              <button
                type="button"
                className="px-3 bg-primary w-fit text-white font-semibold cursor-pointer "
                onClick={() => setOpenAddTransiton(true)}
              >
                Add transition
              </button>
              <Table
                key={"TransitionTab"}
                rowKey="id"
                columns={transitionColumns}
                dataSource={listTransitionTemp}
                pagination={false}
                size="small"
              />
            </>
          )}

          {/* FOOTER */}
          <div className="flex justify-end mt-4 gap-3 ">
            <button className="px-3 bg-blue-100 text-primary font-semibold">
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 bg-primary text-white font-semibold"
              disabled={isAdding || isEditing}
            >
              {isAdding || isEditing ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>

      {/* RIGHT PANEL (React Flow) */}
      <div className="flex-1 border rounded-lg bg-gray-50 relative">
        <ActionWorkflowDiagram
          listStatus={listStatusTemp}
          listTransition={listTransitionTemp}
        />
      </div>
      {openAddStatus && (
        <StatusModal
          workflowId={1}
          open={openAddStatus}
          setOpen={setOpenAddStatus}
          mode="add"
          onAddStatus={(newStatus) => {
            setListStatusTemp((prev) => [...prev, newStatus]);
          }}
          listStatusTemp={listStatusTemp}
        />
      )}

      {openEditStatus && selectedStatus && id && (
        <StatusModal
          workflowId={id}
          open={openEditStatus}
          setOpen={setOpenEditStatus}
          mode="edit"
          defaultValues={selectedStatus}
          onAddStatus={handleUpdateStatus}
        />
      )}

      {openAddTransition && (
        <TransitionModal
          workflowId={1}
          open={openAddTransition}
          statusList={listStatusTemp.map((s) => ({
            id: s.id,
            name: s.name,
          }))}
          setOpen={setOpenAddTransiton}
          mode="add"
          onAddTransition={(newTrans) => {
            setListTransitionTemp((prev) => [...prev, newTrans]);
          }}
        />
      )}

      {openEditTransition && selectedTransition && id && (
        <TransitionModal
          workflowId={id}
          open={openEditTransition}
          defaultValues={selectedTransition}
          statusList={listStatusTemp.map((s) => ({
            id: s.id,
            name: s.name,
          }))}
          setOpen={setOpenEditTransition}
          mode="edit"
          onAddTransition={handleUpdateTransition}
        />
      )}
    </div>
  );
};

export default ActionWorkflow;
