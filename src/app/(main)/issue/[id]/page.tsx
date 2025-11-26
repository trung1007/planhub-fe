"use client";


import SmoothToggle from "@/components/SmothToggle";
import SubTaskTable from "@/components/table/SubTaskTable";
import { useEffect, useState } from "react";
import { FiPaperclip, FiChevronDown, FiChevronUp } from "react-icons/fi";

import { usePathname } from "next/navigation";
import AttachmentUpload from "@/components/AttachmentUpload";
import { useGetDetailIssue } from "@/hooks/useIssue";
import { formatDateDMY } from "@/utils/format";
import { IssueTypeTag } from "@/components/tag/IssueTypeTag";
import { IssuePriorityTag } from "@/components/tag/IssuePriorityTag";
import { IssueTagList } from "@/components/tag/IssueTagList";
import { IssueStatusTag } from "@/components/tag/IssueStatusTag";



const DetailIssue = () => {
    const [showSubTasks, setShowSubTasks] = useState(true);
    const [showActivity, setShowActivity] = useState(true);
    const pathname = usePathname();
    const [issueIdNumber, setIssueIdNumber] = useState<number | undefined>(undefined);

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

    const { data: issueInfo, isLoading } = useGetDetailIssue(issueIdNumber ?? 0)

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
                        <InfoRow
                            label="Type"
                            value={<IssueTypeTag type={issueInfo.type} />}
                        />
                        <InfoRow
                            label="Priority"
                            value={<IssuePriorityTag priority={issueInfo.priority} />}
                        />
                        <InfoRow
                            label="Tag"
                            value={<IssueTagList tags={issueInfo.tags || []} />}
                        />
                    </div>

                    {/* Right column */}
                    <div className="space-y-2">
                        <InfoRow label="Assignee" value={issueInfo.assigneeName || "Unassigned"} />
                        <InfoRow label="Reporter" value={issueInfo.reporterName || "Unassigned"} />
                        <InfoRow
                            label="Status"
                            value={<IssueStatusTag status={issueInfo.status} />}
                        />
                        <InfoRow label="Created At" value={formatDateDMY(issueInfo.createdAt)} />
                        <InfoRow label="Updated At" value={formatDateDMY(issueInfo.updatedAt)} />
                    </div>

                </div>

                {/* Description */}
                <div className="mt-6">
                    <p className="font-semibold text-gray-800 mb-1">Description</p>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {issueInfo.description}
                    </p>
                </div>
            </div>

            {/* Attachments */}
            <AttachmentUpload issueId={issueIdNumber} />
            {/* Sub-task */}
            <div className="mb-6">
                <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setShowSubTasks(!showSubTasks)}
                >
                    <p className="font-semibold">Sub-task (5)</p>
                    {showSubTasks ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                <SmoothToggle open={showSubTasks}>
                    {showSubTasks && (
                        <SubTaskTable
                            data={[
                                { id: 1, code: "PLHB-0001", summary: "Tính năng đăng ký tài khoản", assignee: "Nguyễn Văn An", status: "To Do" },
                                { id: 2, code: "PLHB-0002", summary: "Validate form", assignee: "Nguyễn Văn A", status: "In Progress" },
                            ]}
                        />
                    )}
                </SmoothToggle>
            </div>

            {/* Activity */}
            <div>
                <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setShowActivity(!showActivity)}
                >
                    <p className="font-semibold">Activity</p>
                    {showActivity ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                <SmoothToggle open={showActivity}>
                    <div className="flex flex-col gap-2">
                        {showActivity && (
                            <>
                                <div className="mb-4">
                                    <p className="font-semibold">Nguyễn Văn An (annv1)</p>
                                    <p className="text-gray-700 text-sm">We just need to understand the costs...</p>
                                    <span className="text-xs text-gray-400">08:56 15/11/2025</span>
                                </div>

                                <div className="mb-4">
                                    <p className="font-semibold">Nguyễn Văn An (annv1)</p>
                                    <p className="text-gray-700 text-sm">Waiting for the information from other teams...</p>
                                    <span className="text-xs text-gray-400">08:56 15/11/2025</span>
                                </div>

                                <textarea className="w-full border p-2 rounded" placeholder="Add a comment"></textarea>

                                <button className="mt-2 px-4 py-1 bg-blue-600 text-white rounded">
                                    Comment
                                </button>
                            </>
                        )}
                    </div>
                </SmoothToggle>
            </div>
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
