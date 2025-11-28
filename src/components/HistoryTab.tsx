"use client";

import { HistoryActionText } from "@/enums/issue.enum";
import { useIssueHistory } from "@/hooks/useIssue";
import { formatDateTime, formatHistoryDetail } from "@/utils/format";
import { useEffect, useState } from "react";

interface CreatedInfo {
    fullName: string;
    username: string;
    createdAt: string;
}

const HistoryTab = ({
    issueId,
    createdInfor,
}: {
    issueId: number;
    createdInfor: CreatedInfo;
}) => {
    const [page, setPage] = useState(1);
    const [allHistory, setAllHistory] = useState<any[]>([]);
    const limit = 10;
    const { data: historyResponse = [], isLoading } = useIssueHistory(issueId, page, limit);

    const currentPageData = historyResponse?.data || [];
    const total = historyResponse?.total || 0;

    useEffect(() => {
        if (currentPageData.length > 0) {
            setAllHistory(prev => {
                // tránh bị duplicate nếu query refetch
                const ids = new Set(prev.map(item => item.id));

                const newItems = currentPageData.filter((item: any) => !ids.has(item.id));

                return [...prev, ...newItems];
            });
        }
    }, [currentPageData]);

    if (isLoading) return <p>Loading issue history...</p>;

    return (
        <div className="flex flex-col gap-4 text-sm">

            {/* ISSUE CREATED INFO */}
            <div className="flex">
                <p>
                    <span className="font-semibold">
                        {createdInfor.fullName} ({createdInfor.username})
                    </span>{" "}
                    created this issue at{" "}
                    <span className="font-semibold">{createdInfor.createdAt}</span>
                </p>
            </div>

            <hr />
            <div className="max-h-[220px] overflow-y-auto pr-2 space-y-4">
                {/* HISTORY ITEMS */}
                {allHistory.length === 0 && (
                    <p className="text-gray-500">No history available.</p>
                )}

                {allHistory.map((item: any) => (
                    <div key={item.id} className="flex flex-col">
                        <p>
                            <span className="font-semibold">
                                {item.changeName} ({item.changeUser})
                            </span>{" "}
                            made change at{" "}
                            <span className="font-semibold">{formatDateTime(item.created_at)}</span>
                        </p>

                        {/* ACTION TEXT */}
                        <div className="flex gap-2">
                            <p className="font-semibold">
                                {HistoryActionText[item.action as keyof typeof HistoryActionText]}
                            </p>

                            <p className="text-gray-700">{formatHistoryDetail(item)}</p>
                        </div>
                    </div>
                ))}
                {allHistory.length < total && (
                    <button
                        disabled={isLoading}
                        onClick={() => setPage((prev) => prev + 1)}
                        className="text-primary mt-2 underline"
                    >
                        {isLoading ? "Loading..." : "Load more"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default HistoryTab;


