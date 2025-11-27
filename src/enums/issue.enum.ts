export enum IssueStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  REVIEW = "review",
  DONE = "done",
  CANCELLED = "cancelled",
}

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