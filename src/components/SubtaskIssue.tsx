"use client"
import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import SmoothToggle from "./SmothToggle";
import SubTaskTable from "./table/SubTaskTable";

const SubTaskIssue = ({ issueId, issueSubTaskNum, parrentSprintId, projectId }: { issueId: number, issueSubTaskNum: number, parrentSprintId?: number, projectId?: number }) => {
    const [showSubTasks, setShowSubTasks] = useState(true);

    return (
        <div className="mb-6">
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setShowSubTasks(!showSubTasks)}
            >
                <div className="flex items-center gap-2">
                    <p className="font-semibold">Sub-task ({issueSubTaskNum})</p>
                    <div>Add subtask with AI agent</div>
                </div>
                {showSubTasks ? <FiChevronUp /> : <FiChevronDown />}
            </div>

            <SmoothToggle open={showSubTasks}>
                {showSubTasks && (
                    <SubTaskTable issueId={issueId} parrentSprintId={parrentSprintId} projectId={projectId} />
                )}
            </SmoothToggle>
        </div>
    )
}

export default SubTaskIssue