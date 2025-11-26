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
  SUBTASK = 'subtask'
}
