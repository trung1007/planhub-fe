"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Select, Input } from "antd";
import { Controller, useForm } from "react-hook-form";
import FormRow from "../FormRow";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "@/hooks/reduxHook";
import { useListUser } from "@/hooks/useUser";

// Enums
import {
  IssuePriority,
  IssueStatus,
  TagEnum,
  IssueType,
} from "@/enums/issue.enum";

// Schema
import { IssueFormValues, IssueSchema } from "@/schemas/issue.schema";

// Hooks
import {
  useAddIssue,
  useAllIssuesIds,
  useEditIssue,
  useGetIssueStatus,
  useListIssue,
} from "@/hooks/useIssue";
import {
  useActiveSprint,
  useActiveSprintByProject,
  useListSprint,
} from "@/hooks/useSprint";

// UI Tags
import { IssueTypeTag } from "../tag/IssueTypeTag";
import { IssueStatusTag } from "../tag/IssueStatusTag";
import { IssuePriorityTag } from "../tag/IssuePriorityTag";
import { IssueTagList } from "../tag/IssueTagList";
import { useListProject } from "@/hooks/useProject";

interface IssueModalProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  mode: "add" | "edit";
  selectedIssue?: IssueFormValues & { id: number };
  isLoading?: boolean;
  parrentId?: number;
  parrentSprintId?: number;
}

const IssueModal: React.FC<IssueModalProps> = ({
  open,
  setOpen,
  mode,
  selectedIssue,
  isLoading,
  parrentId,
  parrentSprintId,
}) => {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm<IssueFormValues>({
    resolver: zodResolver(IssueSchema),
    defaultValues: {
      name: "",
      type: undefined,
      summary: "",
      description: "",
      status: undefined,
      priority: undefined,
      tags: [],
      projectId: undefined,
      sprintId: undefined,
      assigneeId: undefined,
      reporterId: undefined,
      createdBy: undefined,
      parentIssueId: undefined,
    },
  });

  const currentUser = useAppSelector((state) => state.auth.user);
  const projectId = watch("projectId");
  const sprintId = watch("sprintId");

  const { mutate: mutationAdd, isPending: isAdding } = useAddIssue();
  const { mutate: mutationEdit, isPending: isEditing } = useEditIssue();

  // const watchType = watch("type");
  // const isSubtask = watchType === IssueType.SUBTASK;
  const { data: projectList, isLoading: loadingProject } = useListProject();
  const { data: userList = [], isLoading: loadingUser } = useListUser();
  //   const { data: activeSprintList = [], isLoading: loadingSprint } =
  //     useActiveSprint();

  const {
    data: statusList = [],
    isLoading: loadingStatus,
    refetch: refetchStatus,
  } = useGetIssueStatus(sprintId);

  const {
    data: activeSprintList = [],
    isLoading: loadingSprint,
    refetch: refetchAtiveSprint,
  } = useActiveSprintByProject(projectId);

  useEffect(() => {
    if (sprintId) {
      refetchStatus();
    }
    if (projectId) {
      refetchAtiveSprint();
    }
  }, [sprintId, refetchStatus, projectId, refetchAtiveSprint]);

  // Prefill when editing
  useEffect(() => {
    if (mode === "edit" && selectedIssue) {
      reset({
        ...selectedIssue,
        createdBy: currentUser?.id,
      });
    } else {
      reset({
        name: "",
        type: undefined,
        summary: "",
        description: "",
        status: undefined,
        priority: undefined,
        tags: [],
        projectId: undefined,
        sprintId: parrentSprintId || undefined,
        assigneeId: undefined,
        reporterId: undefined,
        parentIssueId: undefined,
        createdBy: currentUser?.id,
      });
    }
  }, [mode, selectedIssue]);

  // ADD
  const handleAdd = (data: IssueFormValues) => {
    Cookies.set('action_project_id', projectId?.toString())
    mutationAdd(
      { ...data, createdBy: currentUser?.id, parentIssueId: parrentId },
      {
        onSuccess: () => {
          toast.success("Issue added successfully!");
          setOpen(false);
          reset();
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to add issue");
        },
      }
    );
  };

  // EDIT
  const handleEdit = (data: IssueFormValues) => {
    if (!selectedIssue) return;

    mutationEdit(
      { id: selectedIssue.id, data: { ...data, createdBy: currentUser?.id } },
      {
        onSuccess: () => {
          toast.success("Issue updated successfully!");
          setOpen(false);
          reset();
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to edit issue");
        },
      }
    );
  };

  const handleSave = (data: IssueFormValues) =>
    mode === "add" ? handleAdd(data) : handleEdit(data);

  const title = mode === "add" ? "Add Issue" : "Edit Issue";

  return (
    <Modal
      open={open}
      footer={null}
      closable={false}
      width={600}
      className="custom-modal"
    >
      {/* Header */}
      <div className="bg-blue-100 px-4 py-2 flex justify-between items-center border-b">
        <span className="text-[16px] font-semibold">{title}</span>
        <button
          onClick={() => setOpen(false)}
          className="text-gray-700 text-lg font-bold"
        >
          ×
        </button>
      </div>

      {/* Body */}
      <form
        onSubmit={handleSubmit(handleSave)}
        className="p-5 flex flex-col gap-4"
      >
        {/* Name */}
        <FormRow label="Issue Name" error={errors.name?.message}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Enter issue name" />
            )}
          />
        </FormRow>

        {/* Type */}
        <FormRow label="Issue Type" error={errors.type?.message}>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                allowClear
                placeholder="Select type"
                className="w-full"
                value={field.value ?? undefined}
                onChange={(v) => field.onChange(v ?? null)}
                options={Object.values(IssueType).map((v) => ({
                  value: v,
                  label: <IssueTypeTag type={v} />,
                }))}
                optionRender={(option) => option.data.label}
              />
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
                allowClear
                value={field.value ?? undefined}
                loading={loadingProject}
                placeholder="Select project"
                className="w-full"
                onChange={(v) => field.onChange(v ?? null)}
                options={projectList.map((s: any) => ({
                  value: s.id,
                  label: s.name,
                }))}
                showSearch
              />
            )}
          />
        </FormRow>

        {/* Sprint */}
        {/* <FormRow label="Active Sprint" error={errors.sprintId?.message}>
          <Controller
            name="sprintId"
            control={control}
            disabled={!!parrentSprintId || !projectId}
            render={({ field }) => (
              <Select
                {...field}
                allowClear
                value={field.value ?? undefined}
                loading={loadingSprint}
                placeholder="Select sprint"
                className="w-full"
                onChange={(v) => field.onChange(v ?? null)}
                options={activeSprintList.map((s: any) => ({
                  value: s.id,
                  label: s.name,
                }))}
                showSearch
              />
            )}
          />
        </FormRow> */}

        <FormRow label="Active Sprint" error={errors.sprintId?.message}>
          {watch("projectId") && activeSprintList ? (
            <Controller
              name="sprintId"
              control={control}
              disabled={!!parrentSprintId}
              render={({ field }) => (
                <Select
                  {...field}
                  allowClear
                  value={field.value ?? undefined}
                  loading={loadingSprint}
                  placeholder="Select sprint"
                  className="w-full"
                  onChange={(v) => field.onChange(v ?? null)}
                  options={activeSprintList.map((s: any) => ({
                    value: s.id,
                    label: s.name,
                  }))}
                  showSearch
                />
              )}
            />
          ) : (
            <span className="text-red-500">Please select project</span>
          )}
        </FormRow>

        {/* Status */}
        <FormRow label="Status" error={errors.status?.message}>
          {watch("sprintId") && statusList ? (
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  allowClear
                  placeholder="Select status"
                  className="w-full"
                  value={field.value ?? undefined}
                  onChange={(v) => field.onChange(v ?? null)}
                  options={statusList.map((status: any) => ({
                    value:
                      IssueStatus[
                        status.name.toUpperCase() as keyof typeof IssueStatus
                      ],
                    label: <IssueStatusTag status={status.name} />,
                  }))}
                  optionRender={(option) => option.data.label}
                />
              )}
            />
          ) : (
            <span className="text-red-500">Please select sprint</span>
          )}
        </FormRow>

        {/* Priority */}
        <FormRow label="Priority" error={errors.priority?.message}>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                allowClear
                placeholder="Select priority"
                className="w-full"
                value={field.value ?? undefined}
                onChange={(v) => field.onChange(v ?? null)}
                options={Object.values(IssuePriority).map((v) => ({
                  value: v,
                  label: <IssuePriorityTag priority={v} />,
                }))}
                optionRender={(option) => option.data.label}
              />
            )}
          />
        </FormRow>

        {/* Tags */}
        <FormRow label="Tags" error={errors.tags?.message}>
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                mode="multiple"
                allowClear
                className="w-full"
                placeholder="Select tags"
                value={field.value ?? []}
                onChange={(v) => field.onChange(v)}
                options={Object.values(TagEnum).map((t) => ({
                  value: t,
                  label: <IssueTagList tags={[t]} />,
                }))}
                optionRender={(option) => option.data.label}
              />
            )}
          />
        </FormRow>

        {/* Summary */}
        <FormRow label="Summary" error={errors.summary?.message}>
          <Controller
            name="summary"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                rows={3}
                placeholder="Short summary"
                value={field.value ?? ""}
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
              <Input.TextArea
                {...field}
                rows={5}
                placeholder="Full description"
                value={field.value ?? ""}
              />
            )}
          />
        </FormRow>

        {/* Assignee */}
        <FormRow label="Assignee" error={errors.assigneeId?.message}>
          <Controller
            name="assigneeId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                allowClear
                className="w-full"
                loading={loadingUser}
                value={field.value ?? undefined}
                placeholder="Select assignee"
                onChange={(v) => field.onChange(v ?? null)}
                options={userList.map((u: any) => ({
                  value: u.id,
                  label: u.username,
                }))}
                showSearch
              />
            )}
          />
        </FormRow>

        {/* Reporter */}
        <FormRow label="Reporter" error={errors.reporterId?.message}>
          <Controller
            name="reporterId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                allowClear
                value={field.value ?? undefined}
                placeholder="Select reporter"
                loading={loadingUser}
                className="w-full"
                onChange={(v) => field.onChange(v ?? null)}
                options={userList.map((u: any) => ({
                  value: u.id,
                  label: u.username,
                }))}
                showSearch
              />
            )}
          />
        </FormRow>

        {/* Footer buttons */}
        <div className="flex justify-end gap-3 px-5 pb-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-3 bg-blue-100 text-primary font-semibold"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isLoading || isAdding || isEditing}
            className="px-3 bg-primary text-white font-semibold"
          >
            {isLoading || isAdding || isEditing ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default IssueModal;
