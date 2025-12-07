"use client";

import { useListProject } from "@/hooks/useProject";
import ButtonGroup from "../ButtonGroupTable";
import DragableBoard from "../board/Board";
import { useRouter } from "next/navigation";
import DragableTable from "./DragableTable";
import { useListIssueScrum } from "@/hooks/useIssue";
import { useEffect } from "react";

const BoardTable = () => {
    const { data: issueScrumList } = useListIssueScrum();
    const router = useRouter()

    return (
        <div className="p-3 flex flex-col gap-2 w-full overflow-x-auto">
            {/* Hiển thị ButtonGroup */}
            <ButtonGroup onAdd={() => router.push('/workflow')} title="Manage workflow" isHideRight={true} />

            {/* Render DragableBoard for each project */}
            {issueScrumList && issueScrumList.length > 0 ? (
                issueScrumList.map((scrum: any) => (
                    <DragableTable
                        project={scrum.project}
                        issues={scrum.issues}
                        workflow={scrum.workflow} />
                ))
            ) : (
                <p>No projects available</p>
            )}
            {/* <DragableBoard key={'123123'} /> */}

        </div>
    );
};

export default BoardTable;
