"use client"

import { useDeleteComment, useEditComment } from "@/hooks/useComment"
import { Button, Popconfirm } from "antd"
import TextArea from "antd/es/input/TextArea"
import { useState } from "react"
import { FaEdit, FaTrash, FaUser } from "react-icons/fa"
import { MdCancel, MdOutlineDone } from "react-icons/md"
import { toast } from "react-toastify"

const CommentElement = ({ comment, currentUser }: { comment: any, currentUser: any }) => {
    const [isEditing, setIsEditing] = useState(false)

    const [localContent, setLocalContent] = useState(comment.content);


    const { mutate: editComment, isPending: isEditingPending } = useEditComment();
    const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();


    const handleSave = () => {
        if (!localContent.trim()) {
            toast.warning("Content is required");
            return;
        }
        if (!currentUser) {
            toast.error("Undefined user")
            return;
        }
        const payload = {
            content: localContent.trim(),
            created_by: currentUser.id
        }
        editComment(
            {
                id: comment.id,
                data: payload,
            },
            {
                onSuccess: () => {
                    toast.success("Comment updated");
                    setIsEditing(false);
                },
                onError: () => {
                    toast.error("Failed to update comment");
                },
            }
        );
    };

    const handleDelete = () => {
        deleteComment(comment.id, {
            onSuccess: () => {
                toast.success("Comment deleted");
            },
            onError: () => {
                toast.error("Failed to delete comment");
            },
        });
    };


    return (
        <div key={comment.id} className="mb-3 flex flex-col gap-2">
            {/* Nếu API trả thêm tên user thì dùng c.created_by_name, v.v. */}
            <div className="flex justify-between w-full">
                <div className="font-semibold flex items-center gap-2" >
                    <FaUser /> <span>{comment.fullName}({comment.username})</span>
                </div>
                <span className="text-xs text-gray-400">
                    {comment.created_at
                        ? new Date(comment.created_at).toLocaleString()
                        : ""}
                </span>
            </div>
            {/* <p className="text-gray-700 text-sm">{c.content}</p> */}
            <TextArea
                className="w-full border p-2 rounded"
                value={localContent}
                onChange={(e) => setLocalContent(e.target.value)}
                rows={3}
                disabled={!isEditing}
            />
            {!isEditing ? (<div className="flex items-center gap-2">
                <Button size="small" type="primary" onClick={() => setIsEditing(true)} >
                    <FaEdit />
                </Button>
                <Popconfirm
                    title="Delete comment"
                    description="Are you sure you want to delete this comment?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={handleDelete}
                >
                    <Button
                        danger
                        size="small"
                        loading={isDeleting}
                        disabled={isEditingPending}
                    >
                        <FaTrash />
                    </Button>
                </Popconfirm>
            </div>) : (<div className="flex items-center gap-2">
                <Button size="small" type="default" onClick={() => {
                    setIsEditing(false)
                    setLocalContent(comment.content)
                }} >
                    <MdCancel />
                </Button>
                <Button size="small" type="primary" onClick={handleSave}
                    loading={isEditingPending} >
                    <MdOutlineDone />
                </Button>
            </div>)}

        </div>
    )
}

export default CommentElement