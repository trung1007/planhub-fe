"use client"
import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import SmoothToggle from "./SmothToggle";
import SubTaskTable from "./table/SubTaskTable";

const SubTaskIssue = ({ issueId, issueSubTaskNum, parrentSprintId }: { issueId: number, issueSubTaskNum: number, parrentSprintId?:number }) => {
    const [showSubTasks, setShowSubTasks] = useState(true);

    return (
        <div className="mb-6">
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setShowSubTasks(!showSubTasks)}
            >
                <p className="font-semibold">Sub-task ({issueSubTaskNum})</p>
                {showSubTasks ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            <SmoothToggle open={showSubTasks}>
                {showSubTasks && (
                    <SubTaskTable issueId={issueId} parrentSprintId={parrentSprintId}/>
                )}
            </SmoothToggle>
        </div>
    )
}

export default SubTaskIssue