"use client";

import { ReleaseStatus } from "@/enums/release.enum";
import { Tag } from "antd";


interface Props {
  status: ReleaseStatus;
}

const statusMap: Record<
  ReleaseStatus,
  { label: string; color: string }
> = {
  [ReleaseStatus.PLANNED]: { label: "Planned", color: "blue" },
  [ReleaseStatus.IN_PROGRESS]: { label: "In Progress", color: "geekblue" },
  [ReleaseStatus.PENDING]: { label: "Pending", color: "orange" },
  [ReleaseStatus.RELEASED]: { label: "Released", color: "green" },
  [ReleaseStatus.ARCHIVED]: { label: "Archived", color: "default" },
  [ReleaseStatus.CANCELLED]: { label: "Cancelled", color: "red" },
};

export default function ReleaseStatusTag({ status }: Props) {
  const data = statusMap[status] || {
    label: status,
    color: "default",
  };

  return <Tag color={data.color}>{data.label}</Tag>;
}
