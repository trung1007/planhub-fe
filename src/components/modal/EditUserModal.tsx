"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Modal } from "antd";
import FormRow from "../FormRow";
import { EditUserSchema, EditUserInput } from "@/schemas/user.schema";
import { useUpdateUser } from "@/hooks/useUser";
import { useAppSelector } from "@/hooks/reduxHook";
import { toast } from "react-toastify";
import { useEffect } from "react";

interface EditModalProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    user: any; // user đang edit
}

const EditUserModal: React.FC<EditModalProps> = ({ open, setOpen, user }) => {
    const currentUser = useAppSelector((state) => state.auth.user);

    const {
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm<EditUserInput>({
        resolver: zodResolver(EditUserSchema),
        defaultValues: {
            fullName: "",
            username: "",
            email: "",
            phoneNumber: "",
            updatedUserId: null,
        },
    });

    useEffect(() => {
        if (user) {
            reset({
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
                updatedUserId: null,
            });
        }
    }, [user, setValue]);

    const { mutate, isPending } = useUpdateUser();

    const handleSave = (data: EditUserInput) => {
        if (!currentUser) return;

        data.updatedUserId = currentUser.id;

        mutate(
            { id: user.id, data },
            {
                onSuccess: () => {
                    toast.success("User updated successfully");
                    setOpen(false);
                    
                },
                onError: (err: any) => {
                    toast.error(err?.message || "Could not update user");
                },
            }
        );
    };

    return (
        <Modal open={open} footer={null} closable={false} width={500} className="custom-modal">
            {/* HEADER */}
            <div className="bg-blue-100 px-4 py-2 flex justify-between items-center border-b">
                <span className="text-[16px] font-semibold">Edit User</span>
                <button onClick={() => setOpen(false)} className="text-gray-700 text-lg font-bold">
                    ×
                </button>
            </div>

            {/* BODY */}
            <form onSubmit={handleSubmit(handleSave)} className="p-5 flex flex-col gap-4">
                {/* Full Name */}
                <FormRow label="Full Name" error={errors.fullName?.message}>
                    <Controller
                        name="fullName"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Full Name" />}
                    />
                </FormRow>

                {/* Username */}
                <FormRow label="Username" error={errors.username?.message}>
                    <Controller
                        name="username"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Username" />}
                    />
                </FormRow>

                {/* Email */}
                <FormRow label="Email" error={errors.email?.message}>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Email" />}
                    />
                </FormRow>

                {/* Phone Number */}
                <FormRow label="Phone Number" error={errors.phoneNumber?.message}>
                    <Controller
                        name="phoneNumber"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Phone Number" />}
                    />
                </FormRow>

                {/* BUTTONS */}
                <div className="flex justify-end gap-3 px-5 pb-4">
                    <button onClick={() => setOpen(false)} className="px-3 bg-blue-100 text-primary font-semibold">
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-3 bg-primary text-white font-semibold"
                    >
                        {isPending ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default EditUserModal;
