"use client";

import { Tag } from "antd";
import { TagEnum } from "@/enums/issue.enum";

const tagColors: Record<TagEnum, string> = {
  [TagEnum.FRONTEND]: "cyan",
  [TagEnum.BACKEND]: "purple",
  [TagEnum.DATABASE]: "geekblue",
  [TagEnum.UI_UX]: "magenta",
  [TagEnum.DEVOPS]: "volcano",
  [TagEnum.DOCUMENT]: "gold",
  [TagEnum.PERFORMANCE]: "lime",
  [TagEnum.SECURITY]: "red",
};

interface Props {
  tags: TagEnum[] | null;
}

export const IssueTagList: React.FC<Props> = ({ tags }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((t) => (
        <Tag color={tagColors[t]} key={t}>
          {t.replace("_", " ").toUpperCase()}
        </Tag>
      ))}
    </div>
  );
};
