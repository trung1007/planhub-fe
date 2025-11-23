"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Input } from "antd";
import { Controller, useForm } from "react-hook-form";
import FormRow from "../FormRow";
import { ActionRoleInput, ActionRoleSchema } from "@/schemas/role.schema";
import { useEffect } from "react";
import { useAddRole, useEditRole } from "@/hooks/useRole";
import { toast } from "react-toastify";
import { useAppSelector } from "@/hooks/reduxHook";

interface RoleModalProps {
    open: boolean;
    setOpen: (v: boolean) => void;

    // add | edit
    mode: "add" | "edit";
    // default data (edit)
    defaultValues?: Partial<ActionRoleInput>;

    isLoading?: boolean;
    role?: any
}

const RoleModal: React.FC<RoleModalProps> = ({
    open,
    setOpen,
    mode,
    defaultValues,
    isLoading,
    role
}) => {

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<ActionRoleInput>({
        resolver: zodResolver(ActionRoleSchema),
        defaultValues: {
            actionUserId: null,
            name: "",
            key: "",
            description: "",
            ...defaultValues,
        },
    });
    const currentUser = useAppSelector((state) => state.auth.user);
    useEffect(() => {
        reset({
            name: defaultValues?.name || "",
            key: defaultValues?.key || "",
            description: defaultValues?.description || "",
            actionUserId: currentUser?.id ?? null,
        });
        if (role) {
            reset({
                name: defaultValues?.name || "",
                key: defaultValues?.key || "",
                description: defaultValues?.description || "",
                actionUserId: currentUser?.id ?? null,
            });
        }
    }, [defaultValues, reset, currentUser, role]);

    const title = mode === "add" ? "Add Role" : "Edit Role";
    const { mutate: mutationAdd, isPending: isAdding } = useAddRole();
    const { mutate: mutationEdit, isPending: isEditing } = useEditRole();

    const handleAdd = (data: ActionRoleInput) => {
        if (currentUser) {
            data.actionUserId = currentUser.id;
            const payload = {
                name: data.name,
                key: data.key,
                description: data.description,
                createdUserId: data.actionUserId
            }
            mutationAdd(payload, {
                onSuccess: () => {
                    toast.success("Role created successfully!");
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
            });
        }
        else {
            console.error("Người dùng ko xác định");
        }

    };

    const handleEdit = (data: ActionRoleInput) => {
        if (currentUser) {
            data.actionUserId = currentUser.id;
            const payload = {
                name: data.name,
                key: data.key,
                description: data.description,
                updatedUserId: data.actionUserId
            }
            mutationEdit({ id: role.id, data: payload }, {
                onSuccess: () => {
                    toast.success("Role edited successfully!");
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
            });
        }
        else {
            console.error("Người dùng ko xác định");
        }

    };

    const handleSave = (data: ActionRoleInput) => {
        console.log("MODE:", mode);
        if (mode === 'add') {
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
            <form onSubmit={handleSubmit(handleSave)} className="p-5 flex flex-col gap-4">

                {/* Role Name */}
                <FormRow label="Role Name" error={errors.name?.message}>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Role Name" />}
                    />
                </FormRow>

                {/* Role Key */}
                <FormRow label="Role Key" error={errors.key?.message}>
                    <Controller
                        name="key"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Role Key (e.g., ADMIN)" />}
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

export default RoleModal;
