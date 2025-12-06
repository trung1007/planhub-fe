"use client";

import { useListProject } from "@/hooks/useProject";
import ButtonGroup from "../ButtonGroupTable";
import DragableBoard from "../board/Board";
import { useRouter } from "next/navigation";

const BoardTable = () => {
    const { data: projectList } = useListProject();
    const router = useRouter()

    return (
        <div className="p-3 flex flex-col gap-2 w-full overflow-x-auto">
            {/* Hiển thị ButtonGroup */}
            <ButtonGroup onAdd={() => router.push('/workflow')} title="Manage workflow" isHideRight={true} />

            {/* Render DragableBoard for each project */}
            {/* {projectList && projectList.length > 0 ? (
                projectList.map((project: any) => (
                    <div className="flex flex-col gap-2">
                        <h2>Project: {project.name}</h2>
                        <DragableBoard key={project.id} />
                    </div>
                ))
            ) : (
                <p>No projects available</p>
            )} */}
            <DragableBoard key={'123123'} />

        </div>
    );
};

export default BoardTable;
