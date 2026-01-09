"use client";
import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import SmoothToggle from "./SmothToggle";
import SubTaskTable from "./table/SubTaskTable";

import { FaStar } from "react-icons/fa";

const SubTaskIssue = ({
  issueId,
  parrentSprintId,
  projectId,
}: {
  issueId: number;
  parrentSprintId?: number;
  projectId?: number;
}) => {
  const [showSubTasks, setShowSubTasks] = useState(true);

  const [numOfSubTask, setNumOfSubtask] = useState(0)


  return (
    <div className="mb-6">
      <div className="flex justify-between items-center cursor-pointer">
        <div className="flex items-center gap-2">
          <p className="font-semibold">Sub-task ({numOfSubTask})</p>
        </div>
        <div onClick={() => setShowSubTasks(!showSubTasks)}>
          {showSubTasks ? <FiChevronUp /> : <FiChevronDown />}
        </div>
      </div>

      <SmoothToggle open={showSubTasks}>
        {showSubTasks && (
          <SubTaskTable
            issueId={issueId}
            parrentSprintId={parrentSprintId}
            projectId={projectId}
            setNumOfSubtask={setNumOfSubtask}
          />
        )}
      </SmoothToggle>
    </div>
  );
};

export default SubTaskIssue;
