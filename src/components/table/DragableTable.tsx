'use client'
import DragableBoard from "../board/Board"


const DragableTable = ({ project, issues, workflow }:
    {
        project: any,
        issues: any[],
        workflow: any
    }) => {



    return (
        <div className="flex flex-col gap-2">
            <h2>Project: {project.name}</h2>
            <DragableBoard key={project.id} issues={issues} workflow={workflow} />
        </div>
    )
}

export default DragableTable