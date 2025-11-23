"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Select, DatePicker, Input } from "antd";
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
import { ActionProjectMemberInput, ActionProjectMemberSchema } from "@/schemas/project-member.schema";
import { useAddProjectMember, useEditProjectMember } from "@/hooks/useProjectMember";
import { ActionReleaseInput, ACtionReleaseSchema } from "@/schemas/release.schema";
import { formatDateDMY } from "@/utils/format";
import { useAddRelease, useEditRelease } from "@/hooks/useRelease";
import { ReleaseStatus } from "@/enums/release.enum";
import { releaseStatusOptions } from "../ReleaseStatusOptions";
// đổi theo project của bạn

type Release = {
    id: number;
    projectId: number;
    name: string;
    startDate: Date;
    endDate: Date;
    status?: ReleaseStatus;
    version: string;
    description: string
};

interface ReleaseModalProps {
    open: boolean;
    setOpen: (v: boolean) => void;
    mode: "add" | "edit";
    selectedRelease?: Release;
    isLoading?: boolean;
}

const ReleaseModal: React.FC<ReleaseModalProps> = ({
    open,
    setOpen,
    mode,
    selectedRelease,
    isLoading,
}) => {
    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<ActionReleaseInput>({
        resolver: zodResolver(ACtionReleaseSchema),
        defaultValues: {
            projectId: undefined,
            name: undefined,
            version: undefined,
            description: undefined,
            startDate: undefined,
            endDate: undefined,
            createdId: undefined
        },
    });

    // =============================
    // 1) CALL API HOOKS
    // =============================
    const { data: projectList } = useListProject();

    const currentUser = useAppSelector((state) => state.auth.user);

    const { mutate: mutationAdd, isPending: isAdding } = useAddRelease();
    const { mutate: mutationEdit, isPending: isEditing } = useEditRelease();


    useEffect(() => {
        if (mode === "edit" && selectedRelease) {
            reset({
                projectId: selectedRelease.projectId,
                name: selectedRelease.name,
                version: selectedRelease.version,
                description: selectedRelease.description,
                status: selectedRelease.status,
                startDate: selectedRelease.startDate
                    ? new Date(selectedRelease.startDate)
                    : undefined,
                endDate: selectedRelease.endDate
                    ? new Date(selectedRelease.endDate)
                    : undefined,
                createdId: currentUser?.id ?? undefined,
            });
        } else {
            reset({
                projectId: undefined,
                name: undefined,
                version: undefined,
                description: undefined,
                startDate: undefined,
                endDate: undefined,
                createdId: currentUser?.id
            });
        }
    }, [mode, selectedRelease]);

    const handleAdd = (data: ActionReleaseInput) => {
        if (currentUser) {
            const payload = {
                ...data,
                startDate: formatDateDMY(data.startDate),
                endDate: formatDateDMY(data.endDate),
                createdId: currentUser.id
            }

            mutationAdd(payload, {
                onSuccess: () => {
                    toast.success("Release add successfully!");
                    setOpen(false);
                    reset();
                },
                onError: (err: any) => {
                    const message =
                        err?.response?.data?.message ||
                        err?.message ||
                        "Failed to add release";

                    toast.error(message);
                },
            });
        }

    };

    const handleEdit = (data: ActionReleaseInput) => {
        if (currentUser && selectedRelease) {
            const payload = {
                ...data,
                startDate: formatDateDMY(data.startDate),
                endDate: formatDateDMY(data.endDate),
                createdId: currentUser.id
            }
            mutationEdit({ id: selectedRelease.id, data: payload }, {
                onSuccess: () => {
                    toast.success("Release edited successfully!");
                    setOpen(false);
                    reset();
                },
                onError: (err: any) => {
                    const message =
                        err?.response?.data?.message ||
                        err?.message ||
                        "Failed to edit release";

                    toast.error(message);
                },
            });
        }
    };

    const handleSave = (data: ActionReleaseInput) => {
        console.log(mode);

        if (mode === 'add') {
            return handleAdd(data);
        } else {
            return handleEdit(data);
        }
    }

    const title = mode === "add" ? "Add Release" : "Edit Release";

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
                <FormRow label="Release Name" error={errors.name?.message}>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Release Name" />}
                    />
                </FormRow>

                <FormRow label="Version" error={errors.version?.message}>
                    <Controller
                        name="version"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Example: v1.0, v1.1,..." />}
                    />
                </FormRow>

                <FormRow label="Description" error={errors.description?.message}>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <Input.TextArea {...field} placeholder="Description" rows={3} />
                        )}
                    />
                </FormRow>

                {mode === "edit" && (
                    <FormRow label="Status" error={errors.status?.message}>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    placeholder="Select status"
                                    className="w-full"
                                    options={releaseStatusOptions}
                                />
                            )}
                        />
                    </FormRow>
                )}

                <FormRow label="Join date" error={errors.startDate?.message}>
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

                <FormRow label="Join date" error={errors.endDate?.message}>
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

export default ReleaseModal;
