export enum IssueStatus {
  TO_DO = "to_do", 
  IN_PROGRESS = "in_progress", 
  REVIEW = "review", 
  DONE = "done", 
  CANCELLED = "cancelled",
  REOPEN = "reopen",
}

export const statusColors: Record<IssueStatus, string> = {
  [IssueStatus.TO_DO]: "#FFEB3B",
  [IssueStatus.IN_PROGRESS]: "#FF9800",
  [IssueStatus.REVIEW]: "#2196F3",
  [IssueStatus.DONE]: "#4CAF50",
  [IssueStatus.CANCELLED]: "#9C27B0",
  [IssueStatus.REOPEN]: "#F44336", 
};

export const statusThemes: Record<IssueStatus, string> = {
  [IssueStatus.TO_DO]: "default",
  [IssueStatus.IN_PROGRESS]: "orange",
  [IssueStatus.REVIEW]: "blue",
  [IssueStatus.DONE]: "green",
  [IssueStatus.CANCELLED]: "purple",
  [IssueStatus.REOPEN]: "red",
};

export enum IssuePriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum TagEnum {
  FRONTEND = "frontend",
  BACKEND = "backend",
  DATABASE = "database",
  UI_UX = "ui_ux",
  DEVOPS = "devops",
  DOCUMENT = "document",
  PERFORMANCE = "performance",
  SECURITY = "security",
}

export enum IssueType {
  BUG = "bug",
  TASK = "task",
  STORY = "story",
  FEATURE = "feature",
  IMPROVEMENT = "improvement",
}

export enum HistoryActionText {
  // Issue
  issue_create = "Issue created",
  issue_update = "Issue updated",
  issue_delete = "Issue deleted",

  // Comment
  comment_add = "Comment added",
  comment_edit = "Comment edited",
  comment_delete = "Comment deleted",

  // Attachment
  attachment_add = "Attachment added",
  attachment_delete = "Attachment deleted",
}
