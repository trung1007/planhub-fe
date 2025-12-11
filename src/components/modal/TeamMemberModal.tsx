"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Select, DatePicker } from "antd";
import { Controller, useForm } from "react-hook-form";
import FormRow from "../FormRow";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "@/hooks/reduxHook";
import dayjs from "dayjs";
// Hooks API
import { useListUser } from "@/hooks/useUser";
import { useListProject } from "@/hooks/useProject";
import { useListRole } from "@/hooks/useRole";
import {
  ActionProjectMemberInput,
  ActionProjectMemberSchema,
} from "@/schemas/project-member.schema";
import {
  useAddProjectMember,
  useEditProjectMember,
} from "@/hooks/useProjectMember";
import Cookies from "js-cookie";
// đổi theo project của bạn

type Member = {
  id: number;
  userId: number;
  roleId: number;
  projectId: number;
  joinDate: Date;
};

interface ProjectModalProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  mode: "add" | "edit";
  selectedMember?: Member;
  isLoading?: boolean;
}

const TeamMemberModal: React.FC<ProjectModalProps> = ({
  open,
  setOpen,
  mode,
  selectedMember,
  isLoading,
}) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
  } = useForm<ActionProjectMemberInput>({
    resolver: zodResolver(ActionProjectMemberSchema),
    defaultValues: {
      userId: undefined,
      roleId: undefined,
      projectId: undefined,
      joinDate: undefined,
      createdId: undefined,
    },
  });

  // =============================
  // 1) CALL API HOOKS
  // =============================
  const { data: userList } = useListUser();
  const { data: projectList } = useListProject();
  const { data: roleList } = useListRole();

  const currentUser = useAppSelector((state) => state.auth.user);

  const { mutate: mutationAdd, isPending: isAdding } = useAddProjectMember();
  const { mutate: mutationEdit, isPending: isEditing } = useEditProjectMember();

  const action_project_id = watch("projectId");

  useEffect(() => {
    if (mode === "edit" && selectedMember) {
      reset({
        userId: selectedMember.userId,
        roleId: selectedMember.roleId,
        projectId: selectedMember.projectId,
        joinDate: selectedMember.joinDate
          ? new Date(selectedMember.joinDate) // 🟩 FIX HERE
          : undefined,
        createdId: currentUser?.id ?? undefined,
      });
    } else {
      reset({
        userId: undefined,
        roleId: undefined,
        projectId: undefined,
        joinDate: undefined,
        createdId: currentUser?.id,
      });
    }
  }, [mode, selectedMember]);

  const handleAdd = (data: ActionProjectMemberInput) => {
    const d = new Date(data.joinDate);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const formatted = `${day}-${month}-${year}`;
    Cookies.set("action_project_id", action_project_id.toString());
    if (currentUser) {
      const payload = {
        ...data,
        joinDate: formatted,
        createdId: currentUser.id,
      };

      mutationAdd(payload, {
        onSuccess: () => {
          toast.success("Member add successfully!");
          setOpen(false);
          reset();
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to add member";

          toast.error(message);
        },
      });
    }
  };

  const handleEdit = (data: ActionProjectMemberInput) => {
    const d = new Date(data.joinDate);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    const formatted = `${day}-${month}-${year}`;

    if (currentUser && selectedMember) {
      const payload = {
        ...data,
        joinDate: formatted,
        createdId: currentUser.id,
      };
      Cookies.set("action_project_id", action_project_id.toString());
      mutationEdit(
        { id: selectedMember.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Member edited successfully!");
            setOpen(false);
            reset();
          },
          onError: (err: any) => {
            const message =
              err?.response?.data?.message ||
              err?.message ||
              "Failed to edit member";

            toast.error(message);
          },
        }
      );
    }
  };

  const handleSave = (data: ActionProjectMemberInput) => {
    console.log(mode);

    if (mode === "add") {
      return handleAdd(data);
    } else {
      return handleEdit(data);
    }
  };

  const title = mode === "add" ? "Add Member" : "Edit Member";

  return (
    <Modal
      open={open}
      footer={null}
      closable={false}
      width={500}
      className="custom-modal"
    >
      {/* HEADER */}
      <div className="bg-blue-100 px-4 py-2 flex justify-between items-center border-b">
        <span className="text-[16px] font-semibold">{title}</span>
        <button
          onClick={() => setOpen(false)}
          className="text-gray-700 text-lg font-bold"
        >
          ×
        </button>
      </div>

      {/* BODY */}
      <form
        onSubmit={handleSubmit(handleSave)}
        className="p-5 flex flex-col gap-4"
      >
        {/* SELECT PROJECT */}
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

        {/* SELECT USER */}
        <FormRow label="User" error={errors.userId?.message}>
          <Controller
            name="userId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select user"
                className="w-full"
                showSearch
                optionFilterProp="label"
                options={userList?.map((u: any) => ({
                  label: u.username,
                  value: u.id,
                }))}
              />
            )}
          />
        </FormRow>

        {/* SELECT ROLE */}
        <FormRow label="Role" error={errors.roleId?.message}>
          <Controller
            name="roleId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select role"
                className="w-full"
                options={roleList?.map((r: any) => ({
                  label: r.key,
                  value: r.id,
                }))}
              />
            )}
          />
        </FormRow>

        {/* JOIN DATE */}
        <FormRow label="Join date" error={errors.joinDate?.message}>
          <Controller
            name="joinDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                value={field.value ? dayjs(field.value) : null}
                onChange={(value) => field.onChange(value?.toDate())}
                format="DD-MM-YYYY"
                className="w-full"
              />
            )}
          />
        </FormRow>

        {/* BUTTONS */}
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
            disabled={isLoading}
            className="px-3 bg-primary text-white font-semibold"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TeamMemberModal;
