"use client";


import SmoothToggle from "@/components/SmothToggle";
import SubTaskTable from "@/components/table/SubTaskTable";
import { useEffect, useState } from "react";
import { FiPaperclip, FiChevronDown, FiChevronUp } from "react-icons/fi";

import { usePathname } from "next/navigation";
import AttachmentUpload from "@/components/AttachmentUpload";



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

    if (issueIdNumber === undefined) {
        return <div>Loading...</div>;
    }

    return (
        <div className="w-full p-3 bg-white rounded shadow">
            {/* Issue Info */}
            <div className="border-b pb-4 mb-4">
                <h2 className="text-xl font-semibold">PLHB-001</h2>
                <p className="text-gray-700 text-lg font-medium">Tính năng đăng ký tài khoản</p>

                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                        <p><strong>Assignee:</strong> Nguyễn Văn An (annv1)</p>
                        <p><strong>Type:</strong> Story</p>
                        <p><strong>Priority:</strong> High</p>
                        <p><strong>Tag:</strong> Urgen, User Management</p>
                    </div>
                    <div>
                        <p><strong>Project:</strong> PLANHUB</p>
                        <p><strong>Release:</strong> Version 1.0.4</p>
                        <p><strong>Status:</strong> In Progress</p>
                        <p><strong>Created At:</strong> 08:42 14/11/2025</p>
                        <p><strong>Updated At:</strong> 08:42 14/11/2025</p>
                    </div>
                </div>

                <div className="mt-4">
                    <p className="font-semibold text-gray-700">Description</p>
                    <p className="text-gray-600">
                        Là người dùng, tôi muốn đăng ký tài khoản để sử dụng PlanHub.
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

export default DetailIssue;
