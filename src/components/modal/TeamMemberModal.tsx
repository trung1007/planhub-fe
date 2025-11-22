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
// đổi theo project của bạn

type Member = {
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
    } = useForm<Member>({
        // resolver: zodResolver(null), // bạn sẽ thay schema khi có
        defaultValues: {
            userId: undefined,
            roleId: undefined,
            projectId: undefined,
            joinDate: undefined,
        },
    });

    // =============================
    // 1) CALL API HOOKS
    // =============================
    const { data: userList } = useListUser();
    const { data: projectList } = useListProject();
    const { data: roleList } = useListRole();

    // =============================
    // 2) SET DEFAULT VALUE WHEN EDIT
    // =============================
    useEffect(() => {
        if (mode === "edit" && selectedMember) {
            reset({
                userId: selectedMember.userId,
                roleId: selectedMember.roleId,
                projectId: selectedMember.projectId,
                joinDate: selectedMember.joinDate,
            });
        } else {
            reset({
                userId: undefined,
                roleId: undefined,
                projectId: undefined,
                joinDate: undefined,
            });
        }
    }, [mode, selectedMember]);

    // =============================
    // HANDLE SAVE
    // =============================
    const handleSave = (data: Member) => {
        const d = new Date(data.joinDate);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();

        const formatted = `${day}-${month}-${year}`;

        console.log("FORM DATA:", {
            ...data,
            joinDate: formatted,
        });
    };

    const title = mode === "add" ? "Add Member" : "Edit Member";

    return (
        <Modal open={open} footer={null} closable={false} width={500} className="custom-modal">
            {/* HEADER */}
            <div className="bg-blue-100 px-4 py-2 flex justify-between items-center border-b">
                <span className="text-[16px] font-semibold">{title}</span>
                <button onClick={() => setOpen(false)} className="text-gray-700 text-lg font-bold">
                    ×
                </button>
            </div>

            {/* BODY */}
            <form onSubmit={handleSubmit(handleSave)} className="p-5 flex flex-col gap-4">

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
