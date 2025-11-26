import api from "@/lib/axios"; // Import API instance
import { AttachmentFormValues } from "@/schemas/attachment.schema";

// Tạo hàm lấy danh sách attachments theo issueId
export const getAttachmentsByIssueId = async (issueId: number) => {
  const response = await api.get(`/core-service/attachments/issue/${issueId}`);
  return response.data;
};

// Tạo hàm upload file mới cho một issue
export const uploadAttachment = async (data: AttachmentFormValues) => {
  const formData = new FormData();

  if (!data.file) {
    console.error("No file selected.");
    return;
  }

  formData.append("file", data.file);
  formData.append("issueId", data.issue_id.toString());

  try {
    const response = await api.post("/core-service/attachments", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Sửa lại header
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "File upload error:",
      error.response ? error.response.data : error
    );
  }
};
export const downloadAttachment = async (id: number) => {
  const response = await api.get(`/core-service/attachments/download/${id}`, {
    responseType: "blob", 
  });

  return response.data;
};

export const deleteAttachment = async (id: number) => {
  const response = await api.delete(`/core-service/attachments/${id}`);
  return response.data;
};
