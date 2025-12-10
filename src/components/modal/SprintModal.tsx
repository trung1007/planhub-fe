"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Select, DatePicker, Input, Checkbox } from "antd";
import { Controller, useForm } from "react-hook-form";
import FormRow from "../FormRow";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "@/hooks/reduxHook";
import dayjs from "dayjs";
// Hooks API
import { ActionSprintInput, ACtionSprintSchema } from "@/schemas/sprint-schema";
import { useAddSprint, useEditSprint } from "@/hooks/useSprint";
import { useListRelease } from "@/hooks/useRelease";
import { formatDateDMY } from "@/utils/format";
// đổi theo project của bạn

type Sprint = {
  id: number;
  releaseId: number;
  name: string;
  key: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  numOfIssue?: number;
};

interface SprintModalProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  mode: "add" | "edit";
  selectedSprint?: Sprint;
  isLoading?: boolean;
}

const SprintModal: React.FC<SprintModalProps> = ({
  open,
  setOpen,
  mode,
  selectedSprint,
  isLoading,
}) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ActionSprintInput>({
    resolver: zodResolver(ACtionSprintSchema),
    defaultValues: {
      name: undefined,
      key: undefined,
      releaseId: undefined,
      isActive: false,
      startDate: undefined,
      endDate: undefined,
      createdId: undefined,
    },
  });

  // =============================
  // 1) CALL API HOOKS
  // =============================
  const { data: releaseList } = useListRelease();

  const currentUser = useAppSelector((state) => state.auth.user);

  const { mutate: mutationAdd, isPending: isAdding } = useAddSprint();
  const { mutate: mutationEdit, isPending: isEditing } = useEditSprint();

  const [confirmCloseModal, setConfirmCloseModal] = useState(false);
  const [pendingEditData, setPendingEditData] =
    useState<ActionSprintInput | null>(null);

  useEffect(() => {
    if (mode === "edit" && selectedSprint) {
      reset({
        name: selectedSprint.name,
        key: selectedSprint.key,
        releaseId: selectedSprint.releaseId,
        isActive: selectedSprint.isActive,
        startDate: selectedSprint.startDate
          ? new Date(selectedSprint.startDate)
          : undefined,
        endDate: selectedSprint.endDate
          ? new Date(selectedSprint.endDate)
          : undefined,
        createdId: currentUser?.id ?? undefined,
      });
    } else {
      reset({
        name: undefined,
        key: undefined,
        releaseId: undefined,
        isActive: false,
        startDate: undefined,
        endDate: undefined,
        createdId: currentUser?.id,
      });
    }
  }, [mode, selectedSprint]);

  const numOfIssue = selectedSprint?.numOfIssue || 0;

  const handleAdd = (data: ActionSprintInput) => {
    if (currentUser) {
      const payload = {
        ...data,
        startDate: formatDateDMY(data.startDate),
        endDate: formatDateDMY(data.endDate),
        createdId: currentUser.id,
      };

      mutationAdd(payload, {
        onSuccess: () => {
          toast.success("Srpint add successfully!");
          setOpen(false);
          reset();
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to add sprint";

          toast.error(message);
        },
      });
    }
  };

  const handleEdit = (data: ActionSprintInput) => {
    if (currentUser && selectedSprint) {
      const payload = {
        ...data,
        startDate: formatDateDMY(data.startDate),
        endDate: formatDateDMY(data.endDate),
        createdId: currentUser.id,
      };
      mutationEdit(
        { id: selectedSprint.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Srpint edited successfully!");
            setOpen(false);
            reset();
          },
          onError: (err: any) => {
            const message =
              err?.response?.data?.message ||
              err?.message ||
              "Failed to edit sprint";

            toast.error(message);
          },
        }
      );
    }
  };

  const handleSave = (data: ActionSprintInput) => {
    // Nếu edit sprint
    if (mode === "edit" && selectedSprint) {
      const isTurningOff =
        selectedSprint.isActive === true && data.isActive === false;
      const numOfIssue = selectedSprint.numOfIssue || 0;

      if (isTurningOff && numOfIssue > 0) {
        // Lưu tạm data, show confirm
        setPendingEditData(data);
        setConfirmCloseModal(true);
        return;
      }

      return handleEdit(data);
    }

    // Add sprint bình thường
    return handleAdd(data);
  };

  //   const handleSave = (data: ActionSprintInput) => {
  //     console.log(data);

  //     if (mode === "add") {
  //       return handleAdd(data);
  //     } else {
  //       return handleEdit(data);
  //     }
  //   };

  const title = mode === "add" ? "Add Sprint" : "Edit Sprint";

  return (
    <Modal
      open={open}
      footer={null}
      closable={false}
      width={500}
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
        {/* Sprint name */}
        <FormRow label="Sprint Name" error={errors.name?.message}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Enter sprint name" />
            )}
          />
        </FormRow>

        <FormRow label="Sprint Key" error={errors.key?.message}>
          <Controller
            name="key"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Enter sprint key" />
            )}
          />
        </FormRow>

        <FormRow label="Release" error={errors.releaseId?.message}>
          <Controller
            name="releaseId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select release"
                className="w-full"
                options={releaseList?.map((p: any) => ({
                  label: p.name,
                  value: p.id,
                }))}
              />
            )}
          />
        </FormRow>

        <FormRow label="Active" error={errors.isActive?.message}>
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value ?? false}
                onChange={(e) => field.onChange(e.target.checked)}
              >
                Is Active
              </Checkbox>
            )}
          />
        </FormRow>

        {/* Start date */}
        <FormRow label="Start Date" error={errors.startDate?.message}>
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                placeholder="Select start date"
                value={field.value ? dayjs(field.value) : null}
                onChange={(value) => field.onChange(value?.toDate())}
                format="DD-MM-YYYY"
                className="w-full"
              />
            )}
          />
        </FormRow>

        {/* End date */}
        <FormRow label="End Date" error={errors.endDate?.message}>
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                placeholder="Select end date"
                value={field.value ? dayjs(field.value) : null}
                onChange={(value) => field.onChange(value?.toDate())}
                format="DD-MM-YYYY"
                className="w-full"
                disabledDate={(current) => {
                  const start = control._formValues.startDate;
                  return start ? current.isBefore(dayjs(start), "day") : false;
                }}
              />
            )}
          />
        </FormRow>

        {/* Buttons */}
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

      <Modal
        open={confirmCloseModal}
        onCancel={() => setConfirmCloseModal(false)}
        footer={null}
        width={500}
        className="custom-modal"
      >
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-3">
            Are you sure you want to deactivate this sprint?
          </h3>

          <p className="text-gray-600 mb-4">
            This sprint currently has <b>{numOfIssue}</b> issues assigned.
            Turning it inactive may affect your workflow.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setConfirmCloseModal(false)}
              className="px-3 bg-blue-100 text-primary font-semibold"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                if (pendingEditData && selectedSprint) {
                  handleEdit(pendingEditData);
                }
                setConfirmCloseModal(false);
                setPendingEditData(null);
              }}
              disabled={isLoading || isEditing}
              className="px-3 bg-primary text-white font-semibold"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </Modal>
  );
};

export default SprintModal;
