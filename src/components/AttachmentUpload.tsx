import { Button, message } from "antd";
import { useState, useEffect, useRef } from "react";
import { FiChevronDown, FiChevronUp, FiPaperclip } from "react-icons/fi";
import { FaTrash, FaUpload } from "react-icons/fa";
import { useDeleteAttachment, useDownloadAttachment, useGetAttachmentByIssueId, useUploadAttachment } from "@/hooks/useAttachment";
import { AttachmentFormValues } from "@/schemas/attachment.schema";
import SmoothToggle from "./SmothToggle";
import { toast } from "react-toastify";
import { IoMdDownload } from "react-icons/io";

const AttachmentUpload = ({ issueId }: { issueId: number }) => {
    const [showAttachment, setShowAttachment] = useState(true);
    const [attachmentError, setAttachmentError] = useState<string | null>(null);
    const [fileList, setFileList] = useState<File[]>([]); // List of files selected by user

    const { data: attachmentsData = [], isLoading: loadingAttachments } = useGetAttachmentByIssueId(issueId);
    const { mutate: uploadFile, isPending: isUploading } = useUploadAttachment();
    const { mutate: deleteFile, isPending: isDeleting } = useDeleteAttachment()
    const { mutate: downloadFile, isPending: isDownloading } = useDownloadAttachment();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Trigger the file input click event
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setFileList((prevList) => [...prevList, ...newFiles]);
            setAttachmentError(null);
        }
    };

    // Handle file upload when the user clicks "Upload"
    const handleFileUpload = async () => {
        if (fileList.length === 0) {
            setAttachmentError("Please select a file to upload.");
            return;
        }
        fileList.forEach((file) => {
            const data = {
                issue_id: issueId,
                file,
            };

            uploadFile(data, {
                onSuccess: () => {
                    toast.success(`Uploaded ${file.name} successfully!`);

                    setFileList((prev) => prev.filter((f) => f !== file));
                },
                onError: (err: any) => {
                    const message =
                        err?.response?.data?.message ||
                        err?.message ||
                        "Failed to upload file";

                    toast.error(`${file.name}: ` + message);
                },
            });
        });
    };


    const handleDownload = (attachment: any) => {
        downloadFile({
            id: attachment.id,
            filename: attachment.file_name,
        });
    };

    const handleRemoveFile = ({ id, fileName }: { id: number, fileName: any }) => {
        deleteFile(id, {
            onSuccess: () => {
                toast.success(`Delete file ${fileName} successfully!`)
            },
            onError: (err: any) => {
                const message =
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to delete file";
                toast.error(`${fileName}: ` + message);
            }
        })
    };

    const handleRemoveFileSelected = (file: File) => {
        setFileList((prevList) => prevList.filter((item) => item !== file));
    };

    return (
        <div className="mb-6">
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setShowAttachment(!showAttachment)}
            >
                <p className="font-semibold flex items-center gap-2">
                    <FiPaperclip /> Attachment ({attachmentsData.length})
                </p>
                {showAttachment ? <FiChevronUp /> : <FiChevronDown />}
            </div>

            {/* SmoothToggle is used to show/hide content */}
            <SmoothToggle open={showAttachment}>
                <div className="flex flex-col gap-2">
                    {loadingAttachments ? (
                        <p>Loading attachments...</p>
                    ) : attachmentsData.length === 0 ? (
                        <p>No attachments available.</p>
                    ) : (
                        attachmentsData.map((attachment: any) => (
                            <div key={attachment.id} className="flex w-[210px] items-center gap-2 text-blue-600 cursor-pointer">
                                <FiPaperclip /> <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap" >
                                    {attachment.file_name}
                                </span>
                                <Button
                                    size="small"
                                    type="dashed"
                                    onClick={()=>handleDownload(attachment)}
                                >
                                    <IoMdDownload />
                                </Button>
                                <Button danger size="small" onClick={() => handleRemoveFile({ id: attachment.id, fileName: attachment.file_name })}><FaTrash /></Button>
                            </div>
                        ))
                    )}

                    {/* Display selected files */}
                    {fileList.length > 0 && (
                        <div>
                            <h4 className="font-semibold">Selected Files</h4>
                            <ul className="flex flex-col gap-2">
                                {fileList.map((file, index) => (
                                    <li key={index} className="w-[210px] flex items-center justify-between gap-1 text-sm">
                                        <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap" >
                                            {file.name}
                                        </span>
                                        <Button danger size="small" onClick={() => handleRemoveFileSelected(file)}><FaTrash /></Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex gap-2">
                        {/* Standard HTML file input */}
                        <div className="relative">
                            {/* Custom button for file selection */}
                            <Button
                                icon={<FaUpload />}
                                className="custom-file-btn"
                                onClick={handleButtonClick}
                            >
                                Select File
                            </Button>

                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef} // Attach ref here
                                type="file"
                                onChange={handleFileSelect}
                                multiple
                                className="hidden-file-input"
                            />
                        </div>

                        {attachmentError && <p className="text-red-500 text-sm">{attachmentError}</p>}

                        <Button
                            onClick={handleFileUpload}
                            loading={isUploading}
                            type="primary"
                            disabled={isUploading || fileList.length === 0}
                        >
                            {isUploading ? "Uploading..." : "Upload"}
                        </Button>
                    </div>
                </div>
            </SmoothToggle>
        </div>
    );
};

export default AttachmentUpload;
