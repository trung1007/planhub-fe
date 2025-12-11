"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Input } from "antd";
import { Controller, useForm } from "react-hook-form";
import FormRow from "../FormRow";
import { toast } from "react-toastify";
import { useAppSelector } from "@/hooks/reduxHook";
import { useAddProject, useEditProject } from "@/hooks/useProject";
import Cookies from "js-cookie";
import {
  ActionProjectInput,
  ActionProjectSchema,
} from "@/schemas/project.schema";

type Project = {
  id: number;
  name: string;
  code: string;
  description: string;
  creatorId: number;
};

interface ProjectModalProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  // add | edit
  mode: "add" | "edit";
  // default data (edit)
  selectedProject?: Project;

  isLoading?: boolean;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  open,
  setOpen,
  mode,
  selectedProject,
  isLoading,
}) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ActionProjectInput>({
    resolver: zodResolver(ActionProjectSchema),
    defaultValues: selectedProject
      ? {
          name: selectedProject.name ?? "",
          code: selectedProject.code ?? "",
          description: selectedProject.description ?? "",
          creatorId: selectedProject.creatorId ?? null,
        }
      : {
          name: "",
          code: "",
          description: "",
          creatorId: null,
        },
  });
  const currentUser = useAppSelector((state) => state.auth.user);
  const title = mode === "add" ? "Add project" : "Edit project";
  const { mutate: mutationAdd, isPending: isAdding } = useAddProject();
  const { mutate: mutationEdit, isPending: isEditing } = useEditProject();

  const handleAdd = (data: ActionProjectInput) => {
    if (currentUser) {
      data.creatorId = currentUser.id;
      const payload = {
        ...data,
      };
      mutationAdd(payload, {
        onSuccess: () => {
          toast.success("Project created successfully!");
          setOpen(false);
          reset();
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to create project";

          toast.error(message);
        },
      });
    } else {
      console.error("Người dùng ko xác định");
    }
  };

  const handleEdit = (data: ActionProjectInput) => {
    if (currentUser && selectedProject) {
      data.creatorId = currentUser.id;
      const payload = {
        ...data,
      };
      console.log({ id: selectedProject.id, data: payload });
      Cookies.set("action_project_id", selectedProject.id.toString());

      mutationEdit(
        { id: selectedProject.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Project edited successfully!");
            setOpen(false);
            reset();
          },
          onError: (err: any) => {
            const message =
              err?.response?.data?.message ||
              err?.message ||
              "Failed to create role";

            toast.error(message);
          },
        }
      );
    } else {
      console.error("Người dùng ko xác định");
    }
  };

  const handleSave = (data: ActionProjectInput) => {
    console.log("MODE:", mode);
    if (mode === "add") {
      return handleAdd(data);
    } else {
      return handleEdit(data);
    }
  };

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
        {/* Role Name */}
        <FormRow label="Project name" error={errors.name?.message}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Project name" />
            )}
          />
        </FormRow>

        {/* Role Key */}
        <FormRow label="Project code" error={errors.code?.message}>
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Project code" />
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
            disabled={isLoading || isAdding || isEditing}
            className="px-3 bg-primary text-white font-semibold"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectModal;
