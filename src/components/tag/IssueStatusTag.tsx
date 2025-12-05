"use client";

import { Tag } from "antd";
import { IssueStatus, statusThemes } from "@/enums/issue.enum";


interface Props {
  status: IssueStatus;
}

export const IssueStatusTag: React.FC<Props> = ({ status }) => {
  if (!status) return null;

  return (
    <Tag color={statusThemes[status]}>
      {status.replace("_", " ").toUpperCase()}
    </Tag>
  );
};
