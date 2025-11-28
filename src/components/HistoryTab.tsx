"use client";

import { HistoryActionText } from "@/enums/issue.enum";
import { useIssueHistory } from "@/hooks/useIssue";
import { formatDateTime, formatHistoryDetail } from "@/utils/format";

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
    const { data: historyResponse = [], isLoading } = useIssueHistory(issueId);

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
                {historyResponse.length === 0 && (
                    <p className="text-gray-500">No history available.</p>
                )}

                {historyResponse.map((item: any) => (
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
            </div>
        </div>
    );
};

export default HistoryTab;


