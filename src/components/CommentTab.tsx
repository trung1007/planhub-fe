'use client'

import { useAppSelector } from "@/hooks/reduxHook";
import { useAddComment, useGetCommentByIssueId } from "@/hooks/useComment";
import { Button, message, Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { FaEdit, FaTrash, FaUser } from "react-icons/fa";
import CommentElement from "./CommentElement";

const CommentTab = ({ issueId }: { issueId: number }) => {

    const [content, setContent] = useState("");

    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editingContent, setEditingContent] = useState("");

    const {
        data: comments = [],
        isLoading,
        isError,
    } = useGetCommentByIssueId(issueId);

    const { mutate: addComment, isPending } = useAddComment();

    const currentUser = useAppSelector((state) => state.auth.user)

    const handleAddComment = () => {
        if (!content.trim()) {
            message.warning("Content is required");
            return;
        }
        if (!currentUser || !currentUser.id) {
            message.error("You must be logged in to comment");
            return;
        }
        addComment(
            {
                issue_id: issueId,
                created_by: currentUser?.id,
                content: content.trim(),
            },
            {
                onSuccess: () => {
                    setContent("");
                    message.success("Comment added");
                },
                onError: () => {
                    message.error("Failed to add comment");
                },
            }
        );
    };



    return (
        <div className="flex flex-col gap-2">
            {/* Danh sách comment */}
            {isLoading && (
                <div className="flex justify-center py-4">
                    <Spin />
                </div>
            )}

            {isError && (
                <p className="text-sm text-red-500">
                    Failed to load comments
                </p>
            )}

            {!isLoading && !isError && comments.length === 0 && (
                <p className="text-sm text-gray-500">No comments yet</p>
            )}

            {!isLoading &&
                !isError &&
                comments.map((c: any) => (
                    <CommentElement comment={c} currentUser = {currentUser} />
                ))}

            {/* Ô nhập comment mới */}
            <textarea
                className="w-full border p-2 rounded"
                placeholder="Add a comment"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
            />
            <div className="flex w-full justify-end">
                <Button
                    type="primary"
                    onClick={handleAddComment}
                    disabled={isPending}
                >
                    {isPending ? "Posting..." : "Comment"}
                </Button>
            </div>

        </div>
    )
}

export default CommentTab