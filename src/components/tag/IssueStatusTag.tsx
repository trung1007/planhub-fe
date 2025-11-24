"use client";

import { Tag } from "antd";
import { IssueStatus } from "@/enums/issue.enum";

const statusColors: Record<IssueStatus, string> = {
  [IssueStatus.TODO]: "default",
  [IssueStatus.IN_PROGRESS]: "blue",
  [IssueStatus.REVIEW]: "purple",
  [IssueStatus.DONE]: "green",
  [IssueStatus.CANCELLED]: "red",
};

interface Props {
  status: IssueStatus;
}

export const IssueStatusTag: React.FC<Props> = ({ status }) => {
  if (!status) return null;

  return (
    <Tag color={statusColors[status]}>
      {status.replace("_", " ").toUpperCase()}
    </Tag>
  );
};
