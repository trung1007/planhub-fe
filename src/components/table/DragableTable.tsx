'use client'
import { useState } from "react"
import DragableBoard from "../board/Board"
import { FaAngleDoubleDown } from "react-icons/fa"


const DragableTable = ({ index, project, issues, workflow }:
    {
        index?: number
        project: any,
        issues: any[],
        workflow: any
    }) => {

    const [visibleScumboard, setVisibleScrumboard] = useState(index === 0 ? true : false)


    return (
        <div className="flex flex-col gap-2 max-w-full ">
            <div className="flex w-full justify-between">
                <h2 >
                    <span>Project: </span>
                    <span className="text-l font-semibold">{project.name} </span>
                </h2>
                <button
                    onClick={() => setVisibleScrumboard(!visibleScumboard)}
                    className="transition-transform duration-500 ease-in-out"
                >
                    <FaAngleDoubleDown
                        className={`text-l transition-transform duration-500 ease-in-out
              ${visibleScumboard ? "rotate-180" : "rotate-0"}`}
                    />
                </button>
            </div>
            {/* {visibleScumboard && <DragableBoard key={project.id} issues={issues} workflow={workflow} />} */}
            <div
                className={`
    overflow-hidden transition-all duration-700 ease-in-out
    ${visibleScumboard
                        ? "max-h-[400px] opacity-100 translate-y-0  ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                        : "max-h-0 opacity-0 -translate-y-3 ease-in "}
  `}
            >
                <DragableBoard
                    key={project.id}
                    issues={issues}
                    workflow={workflow}
                />
            </div>

        </div>
    )
}

export default DragableTable