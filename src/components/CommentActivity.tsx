"use client";

import { useState } from "react";
import { Tabs, Spin, message, Button } from "antd";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import SmoothToggle from "./SmothToggle";
import CommentTab from "./CommentTab";
import HistoryTab from "./HistoryTab";

interface CreatedInfo {
  fullName: string;
  username: string;
  createdAt: string; // hoặc Date nếu bạn muốn
}

const CommentActivity = ({ issueId, createdInfor }: { issueId: number; createdInfor: CreatedInfo }) => {
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
            <HistoryTab issueId={issueId} createdInfor={createdInfor} />
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
