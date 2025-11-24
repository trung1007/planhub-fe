"use client";

import { Tag } from "antd";
import { IssuePriority } from "@/enums/issue.enum";

const priorityColors: Record<IssuePriority, string> = {
  [IssuePriority.LOW]: "green",
  [IssuePriority.MEDIUM]: "gold",
  [IssuePriority.HIGH]: "orange",
  [IssuePriority.CRITICAL]: "red",
};

interface Props {
  priority: IssuePriority;
}

export const IssuePriorityTag: React.FC<Props> = ({ priority }) => {
  if (!priority) return null;

  return (
    <Tag color={priorityColors[priority]}>
      {priority.toUpperCase()}
    </Tag>
  );
};
