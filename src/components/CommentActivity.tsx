"use client";

import { useState } from "react";
import { Tabs, Spin, message, Button } from "antd";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import SmoothToggle from "./SmothToggle";
import CommentTab from "./CommentTab";

const CommentActivity = ({ issueId }: { issueId: number; }) => {
    const [showActivity, setShowActivity] = useState(true);

    const commentTab = {
        key: "comments",
        label: "Comments",
        children: (
            <CommentTab issueId={issueId} />
        ),
    };

    const historyTab = {
        key: "history",
        label: "History",
        children: (
            <div className="flex flex-col gap-3 text-sm">
                {/* History issue (mock / TODO: call API history sau) */}
                <div>
                    <p className="font-semibold">Status changed</p>
                    <p className="text-gray-700">
                        Open → In Progress by Nguyễn Văn An (annv1)
                    </p>
                    <span className="text-xs text-gray-400">
                        08:00 15/11/2025
                    </span>
                </div>

                <div>
                    <p className="font-semibold">Priority changed</p>
                    <p className="text-gray-700">
                        Medium → High by Trần Thị B (btt2)
                    </p>
                    <span className="text-xs text-gray-400">
                        10:15 16/11/2025
                    </span>
                </div>

                <div>
                    <p className="font-semibold">Assignee changed</p>
                    <p className="text-gray-700">
                        Unassigned → Nguyễn Văn An (annv1)
                    </p>
                    <span className="text-xs text-gray-400">
                        14:20 17/11/2025
                    </span>
                </div>
            </div>
        ),
    };

    return (
        <div>
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setShowActivity(!showActivity)}
            >
                <p className="font-semibold">Activity</p>
                {showActivity ? <FiChevronUp /> : <FiChevronDown />}
            </div>

            <SmoothToggle open={showActivity}>
                <Tabs defaultActiveKey="comments" items={[commentTab, historyTab]} />
            </SmoothToggle>
        </div>
    );
};

export default CommentActivity;
