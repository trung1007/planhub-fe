import { IssuePriority, IssueType, TagEnum } from "@/enums/issue.enum";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type Task = {
  id: number;
  status_id: number;
  status: TaskStatus;
  title: string;
  description: string;
};

export interface Issue {
  id: number;
  name: string;
  summary: string;
  type: IssueType;
  tags: TagEnum[];
  status: string;
  priority: IssuePriority;
  sprintId: number;
  sprintName: string;
  numOfAttachment: number;
  numOfSubtask: number;
  numOfComment: number;
  status_id: number;
}

export type Column = {
  id: number;
  name: string;
  title: string;
};
