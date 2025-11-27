"use client";

import { Tag } from "antd";
import { IssueType } from "@/enums/issue.enum";

const typeColors: Record<IssueType, string> = {
  bug: "red",
  task: "blue",
  story: "green",
  feature: "gold",
  improvement:"purple",
};

export const IssueTypeTag = ({ type }: { type: IssueType }) => {
  if (!type) return null;

  return <Tag color={typeColors[type]}>{type.toUpperCase()}</Tag>;
};
