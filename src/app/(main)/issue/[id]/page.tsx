"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AttachmentUpload from "@/components/AttachmentUpload";
import { useGetDetailIssue } from "@/hooks/useIssue";
import { formatDateTime } from "@/utils/format";
import { IssueTypeTag } from "@/components/tag/IssueTypeTag";
import { IssuePriorityTag } from "@/components/tag/IssuePriorityTag";
import { IssueTagList } from "@/components/tag/IssueTagList";
import { IssueStatusTag } from "@/components/tag/IssueStatusTag";
import CommentActivity from "@/components/CommentActivity";
import SubTaskIssue from "@/components/SubtaskIssue";
import { useListUser } from "@/hooks/useUser";
import { useActiveSprint, useActiveSprintByProject, useListSprint } from "@/hooks/useSprint";
import { InfoRowEditable } from "@/components/InfoRowEditable";
import { IssuePriority, IssueStatus, IssueType, TagEnum } from "@/enums/issue.enum";
import { Tag } from "antd";

const DetailIssue = () => {
    const pathname = usePathname();
    const [issueIdNumber, setIssueIdNumber] = useState<number | undefined>(undefined);

    const { data: userList = [], isLoading: loadingUser } = useListUser();
    // const { data: activeSprintList = [], isLoading: loadingSprint } = useActiveSprint();
    const { data: issueInfo, isLoading } = useGetDetailIssue(issueIdNumber ?? 0)

    const {
        data: activeSprintList = [],
        isLoading: loadingSprint,
        refetch,
    } = useActiveSprintByProject(issueInfo?.projectId);

    useEffect(() => {
        if (issueInfo?.projectId) {
            refetch();
        }
    }, [issueInfo, refetch]);

    useEffect(() => {
        if (pathname) {
            const match = pathname.match(/\/issue\/(\d+)/);
            if (match && match[1]) {
                const id = Number(match[1]);
                if (!isNaN(id)) {
                    setIssueIdNumber(id);
                }
            }
        }
    }, [pathname]);



    if (issueIdNumber === undefined) {
        return <div>Loading...</div>;
    }
    // Nếu query đang loading
    if (isLoading) {
        return <div>Loading issue details...</div>;
    }

    // Nếu API trả null
    if (!issueInfo) {
        return <div>Issue not found.</div>;
    }



    const createdInfor = {
        username: issueInfo.createdUser,
        fullName: issueInfo.createdName,
        createdAt: formatDateTime(issueInfo.createdAt)
    }

    return (
        <div className="w-full p-3 bg-white rounded shadow">
            {/* Issue Info */}
            <div className="border-b pb-2 mb-3">
                {/* Title + summary */}
                <h2 className="text-2xl font-bold text-primary leading-tight">
                    {issueInfo.name}
                </h2>
                <h4 className="text-gray-700 text-base font-semibold mt-1">
                    {issueInfo.summary}
                </h4>

                {/* Info section */}
                <div className="grid grid-cols-2 gap-6 mt-3 text-sm text-gray-700">

                    {/* Left column */}
                    <div className="space-y-2">
                        <InfoRow label="Project" value={issueInfo.projectName} />
                        <InfoRow label="Release" value={issueInfo.releaseName} />
                        <InfoRowEditable
                            label="Sprint"
                            value={issueInfo.sprintId}
                            options={activeSprintList.map((sprint: any) => ({
                                value: sprint.id,
                                label: sprint.name,
                            }))}
                            renderValue={(id) => {
                                const sprint = activeSprintList.find((sprint: any) => sprint.id === id);
                                return sprint ? `${sprint.name}` : "Not Found";
                            }}
                            issueId={issueIdNumber}
                            projectId={issueInfo?.projectId}
                            currentIssueValue={issueInfo}
                            property="sprintId"
                        />
                        <InfoRowEditable
                            label="Type"
                            value={issueInfo.type || []}
                            editType="select"
                            options={Object.values(IssueType).map((v) => ({
                                value: v,
                                label: <IssueTypeTag type={v} />,
                            }))}
                            renderValue={() => <IssueTypeTag type={issueInfo.type} />}
                            issueId={issueIdNumber}
                            projectId={issueInfo?.projectId}
                            currentIssueValue={issueInfo}
                            property="type"
                        />
                        <InfoRowEditable
                            label="Tag"
                            value={issueInfo.tags || []}
                            mode="multiple"
                            editType="select"
                            options={Object.values(TagEnum).map((t) => ({
                                value: t,
                                label: <IssueTagList tags={[t]} />,
                            }))}
                            renderValue={() => <IssueTagList tags={issueInfo.tags} />}
                            issueId={issueIdNumber}
                            projectId={issueInfo?.projectId}
                            currentIssueValue={issueInfo}
                            property="tags"
                        />
                    </div>

                    {/* Right column */}
                    <div className="space-y-2">
                        {/* <InfoRow label="Assignee" value={issueInfo.assigneeName || "Unassigned"} /> */}
                        <InfoRowEditable
                            label="Assignee"
                            value={issueInfo.assigneeId}
                            options={userList.map((u: any) => ({
                                value: u.id,
                                label: u.username,
                            }))}
                            renderValue={(id) => {
                                const user = userList.find((u: any) => u.id === id);
                                return user ? `${user.username}` : "Unassigned";
                            }}
                            issueId={issueIdNumber}
                            projectId={issueInfo?.projectId}
                            currentIssueValue={issueInfo}
                            property="assigneeId"
                        />
                        <InfoRowEditable
                            label="Reporter"
                            value={issueInfo.reporterId}
                            options={userList.map((u: any) => ({
                                value: u.id,
                                label: u.username,
                            }))}
                            renderValue={(id) => {
                                const user = userList.find((u: any) => u.id === id);
                                return user ? `${user.username}` : "Unassigned";
                            }}
                            issueId={issueIdNumber}
                            projectId={issueInfo?.projectId}
                            currentIssueValue={issueInfo}
                            property="reporterId"
                        />
                        <InfoRowEditable
                            label="Status"
                            value={issueInfo.status}
                            editType="select"
                            options={issueInfo?.statusList.map((status: any) => ({
                                value: IssueStatus[status.name.toUpperCase() as keyof typeof IssueStatus],
                                label: <IssueStatusTag status={status.name} />,
                            }))}
                            renderValue={() => <IssueStatusTag status={issueInfo.status} />}
                            issueId={issueIdNumber}
                            projectId={issueInfo?.projectId}
                            currentIssueValue={issueInfo}
                            property="status"
                        />
                        <InfoRowEditable
                            label="Priority"
                            value={issueInfo.priority || []}
                            editType="select"
                            options={Object.values(IssuePriority).map((v) => ({
                                value: v,
                                label: <IssuePriorityTag priority={v} />,
                            }))}
                            renderValue={() => <IssuePriorityTag priority={issueInfo.priority} />}
                            issueId={issueIdNumber}
                            projectId={issueInfo?.projectId}
                            currentIssueValue={issueInfo}
                            property="priority"
                        />
                        <InfoRow label="Created At" value={formatDateTime(issueInfo.createdAt)} />
                        <InfoRow label="Updated At" value={formatDateTime(issueInfo.updatedAt)} />
                    </div>

                </div>

                {/* Description */}
                <div className="mt-6">
                    {/* <p className="font-semibold text-gray-800 mb-1">Description</p>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {issueInfo.description}
                    </p> */}
                    <InfoRowEditable
                        property="description"
                        label="Description"
                        issueId={issueIdNumber}
                        projectId={issueInfo?.projectId}
                        currentIssueValue={issueInfo}
                        value={issueInfo.description}
                        editType="textarea"
                        renderValue={(v) => (
                            <p className="text-gray-600 whitespace-pre-line">{v}</p>
                        )}
                    />
                </div>
            </div>

            {/* Attachments */}
            <AttachmentUpload issueId={issueIdNumber} projectId={issueInfo?.projectId} />
            {/* Sub-task */}
            <SubTaskIssue issueId={issueIdNumber} issueSubTaskNum={issueInfo.subtasksNum | 0} parrentSprintId={issueInfo.sprintId}  projectId={issueInfo?.projectId}  />

            {/* Activity */}
            <CommentActivity issueId={issueIdNumber} createdInfor={createdInfor} projectId={issueInfo?.projectId} />
        </div>
    );
};

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex items-start gap-2">
        <span className="font-semibold text-primary min-w-[110px]">{label}:</span>
        <div className="text-gray-700">{value}</div>
    </div>
);

export default DetailIssue;
