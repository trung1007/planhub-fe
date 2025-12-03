"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Input, Select } from "antd";
import { Controller, useForm } from "react-hook-form";

import { TransitionSchema, TransitionInput } from "@/schemas/workflow.schema";
import { useEffect } from "react";
import FormRow from "../FormRow";

interface TransitionModalProps {
    open: boolean;
    setOpen: (v: boolean) => void;

    mode: "add" | "edit";

    workflowId: number;

    // danh sách status để chọn from/to
    statusList: { id: number; name: string }[];

    defaultValues?: Partial<TransitionInput>;
    isLoading?: boolean;
    transition?: any;
    onAddTransition?: (transition: any) => void;
}

const TransitionModal: React.FC<TransitionModalProps> = ({
    open,
    setOpen,
    mode,
    workflowId,
    statusList,
    defaultValues,
    isLoading,
    transition,
    onAddTransition
}) => {

    const {
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors },
    } = useForm<TransitionInput>({
        resolver: zodResolver(TransitionSchema),
        defaultValues: {
            workflow_id: workflowId,
            name: "",
            status_id_from: null,
            status_id_to: undefined,
            ...defaultValues,
        },
    });
    console.log("statusList:", statusList);


    useEffect(() => {
        reset({
            workflow_id: workflowId,
            name: defaultValues?.name || "",
            status_id_from: defaultValues?.status_id_from ?? null,
            status_id_to: defaultValues?.status_id_to ?? undefined,
        });
    }, [defaultValues, workflowId]);

    const title = mode === "add" ? "Add Transition" : "Edit Transition";

    // Tạm thời cho console.log để debug local
    const handleAdd = (data: TransitionInput) => {
        const newTransition = {
            id: crypto.randomUUID(),
            name: data.name,
            from: statusList.find(s => s.id === data.status_id_from)?.name ?? null,
            to: statusList.find(s => s.id === data.status_id_to)?.name ?? "",
            status_id_from: data.status_id_from,
            status_id_to: data.status_id_to,
        };

        onAddTransition?.(newTransition);
        setOpen(false);
        reset();
    };

    const handleEdit = (data: TransitionInput) => {

    };

    const handleSave = (data: TransitionInput) => {
        if (mode === "add") handleAdd(data);
        else handleEdit(data);
    };

    const fromId = watch("status_id_from");
    const toId = watch("status_id_to");

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

            {/* FORM */}
            <form onSubmit={handleSubmit(handleSave)} className="p-5 flex flex-col gap-4">

                {/* Name */}
                <FormRow label="Transition Name" error={errors.name?.message}>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="Enter transition name" />
                        )}
                    />
                </FormRow>

                {/* Status From */}
                <FormRow label="From Status">
                    <Controller
                        name="status_id_from"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                allowClear
                                value={field.value ?? undefined}
                                placeholder="(Optional) Select origin status"
                                className="w-full"
                                options={statusList.map((s) => ({
                                    value: s.id,
                                    label: s.name,
                                }))}
                                // Không cho chọn trùng To
                                disabled={field.value !== null && field.value === toId}
                            />
                        )}
                    />
                </FormRow>

                {/* Status To */}
                <FormRow label="To Status" error={errors.status_id_to?.message}>
                    <Controller
                        name="status_id_to"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                placeholder="Select target status"
                                className="w-full"
                                options={statusList.map((s) => ({
                                    value: s.id,
                                    label: s.name,
                                }))}
                                // Không cho chọn trùng From
                                disabled={field.value === fromId}
                            />
                        )}
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

export default TransitionModal;
