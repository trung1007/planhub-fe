"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Input, Switch } from "antd";
import { Controller, useForm } from "react-hook-form";

import { StatusSchema, StatusInput } from "@/schemas/workflow.schema";
import { useEffect } from "react";
import { toast } from "react-toastify";

import FormRow from "../FormRow";

// API hooks
// import { useAddStatus, useEditStatus } from "@/hooks/useStatus";

interface StatusModalProps {
    open: boolean;
    setOpen: (v: boolean) => void;
    mode: "add" | "edit";

    workflowId: number; // 🔥 bắt buộc truyền vào

    defaultValues?: Partial<StatusInput>;
    isLoading?: boolean;
    status?: any;
    onAddStatus?: (status: any) => void;
    listStatusTemp?: any[]
}

const StatusModal: React.FC<StatusModalProps> = ({
    open,
    setOpen,
    mode,
    workflowId,
    defaultValues,
    isLoading,
    onAddStatus,
    listStatusTemp = [],
}) => {

    const {
        handleSubmit,
        control,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<StatusInput>({
        resolver: zodResolver(StatusSchema),
        defaultValues: {
            workflow_id: workflowId,
            name: "",
            color: "#000000",
            is_start: false,
            is_final: false,
            // ...defaultValues,
        },
    });

    useEffect(() => {
        reset({
            workflow_id: Number(workflowId),
            name: defaultValues?.name || "",
            color: defaultValues?.color || "#000000",
            is_start: defaultValues?.is_start || false,
            is_final: defaultValues?.is_final || false,
        });
    }, [defaultValues, workflowId, reset]);

    useEffect(() => {
        console.log({ ...listStatusTemp });

    }, [listStatusTemp])

    const isInitialDisabled = listStatusTemp.some(
        (t) => t.isInitial
    );
    const isFinalDisabled = listStatusTemp.some(
        (t) => t.isFinal
    );

    const title = mode === "add" ? "Add Status" : "Edit Status";

    const handleAdd = (data: StatusInput) => {
        const newStatus = {
            id: Math.floor(Math.random() * 1000000000),
            name: data.name,
            color: data.color,
            isInitial: data.is_start ?? false,
            isFinal: data.is_final ?? false,
        };

        onAddStatus?.(newStatus);

        setOpen(false);
        reset();

    };

    const handleEdit = (data: StatusInput) => {
        const updatedStatus = {
            ...defaultValues,
            name: data.name,
            color: data.color,
            is_start: data.is_start,
            is_final: data.is_final,
        };

        onAddStatus?.(updatedStatus);
        setOpen(false);
        reset();
    };


    const handleSave = (data: StatusInput) => {
        if (mode === "add") {
            handleAdd(data);
        } else {
            handleEdit(data);
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
                <button onClick={() => setOpen(false)} className="text-gray-700 text-lg font-bold">
                    ×
                </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit(handleSave)} className="p-5 flex flex-col gap-4">

                {/* Name */}
                <FormRow label="Name" error={errors.name?.message}>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Status Name" />}
                    />
                </FormRow>

                {/* Color */}
                <FormRow label="Color" error={errors.color?.message}>
                    <Controller
                        name="color"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center gap-3">

                                {/* Color Picker */}
                                <input
                                    type="color"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    className="w-10 h-10 p-0 border rounded cursor-pointer"
                                />

                                {/* Text Input for HEX */}
                                <Input
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    placeholder="#ffc000"
                                    className="w-32"
                                />
                            </div>
                        )}
                    />
                </FormRow>

                {/* is_start */}
                <FormRow label="Start Status">
                    <Controller
                        name="is_start"
                        control={control}
                        render={({ field }) => {
                            const isFinal = watch("is_final");
                            return (
                                <Switch
                                    checked={field.value}
                                    onChange={(val) => {
                                        field.onChange(val);
                                        if (val) setValue("is_final", false);
                                    }}
                                    disabled={isFinal || isInitialDisabled}
                                />
                            );
                        }}
                    />
                </FormRow>

                {/* is_final */}
                <FormRow label="Final Status">
                    <Controller
                        name="is_final"
                        control={control}
                        render={({ field }) => {
                            const isStart = watch("is_start");
                            return (
                                <Switch
                                    checked={field.value}
                                    onChange={(val) => {
                                        field.onChange(val);
                                        if (val) setValue("is_start", false);
                                    }}
                                    disabled={isStart || isFinalDisabled}
                                />
                            );
                        }}
                    />
                </FormRow>

                {/* BUTTONS */}
                <div className="flex justify-end gap-3 px-5 pb-4">
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="px-3 bg-gray-200 text-gray-700 font-semibold"
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

export default StatusModal;
