import { HistoryActionText } from "@/enums/issue.enum";

export const formatDateDMY = (
  dateInput: string | Date | null | undefined
): string => {
  if (!dateInput) return "";

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export function formatDateTime(
  input: string | Date | null | undefined
): string {
  if (!input) return "";
  const date = new Date(input);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year} `;
}

export const formatHistoryDetail = (item: any) => {
  switch (item.action) {
    // ===== ISSUE UPDATE =====
    case "issue_update":
      return `${item.field}: ${item.old_value ?? "empty"} → ${
        item.new_value ?? "empty"
      }`;

    // ===== COMMENT =====
    case "comment_add":
      return `Added comment: "${item.metadata?.content}"`;

    case "comment_edit":
      return `Edited comment: ${item.old_value ?? ""} → ${
        item.new_value ?? ""
      }`;

    case "comment_delete":
      return `Deleted comment: "${item.metadata?.deleted_content}"`;

    // ===== ATTACHMENT =====
    case "attachment_add":
      return `Uploaded file: ${item.metadata?.file_name}`;

    case "attachment_delete":
      return `Deleted file: ${item.metadata?.file_name}`;

    // ===== ISSUE CREATE / DELETE =====
    case "issue_create":
      return `Issue created`;

    case "issue_delete":
      return `Issue deleted`;

    default:
      return (
        HistoryActionText[item.action as keyof typeof HistoryActionText] ||
        "Unknown action"
      );
  }
};
