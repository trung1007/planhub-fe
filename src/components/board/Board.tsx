import React, { useEffect, useState } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    CollisionDetection,
    rectIntersection,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Column } from './Column'; // Giả sử Column là component cột của bạn
import { Task, Column as ColumnType } from './types'; // Giả sử Task là kiểu công việc của bạn

import { toast } from "react-toastify";


interface Tasks {
    [key: string]: Task[];
}


const STATUS_COLUMN = [
    { id: '28', title: 'to_do' },
    { id: '29', title: 'in_progress' },
    { id: '31', title: 'review' },
    { id: '30', title: 'done' },
]


const TRANSITION = [
    { id: '17', from_id: '28', to_id: '29' },
    { id: '18', from_id: '29', to_id: '30' },
    { id: '19', from_id: '29', to_id: '31' },
    { id: '20', from_id: '31', to_id: '30' },
    { id: '20', from_id: '31', to_id: '29' }

]

const INITIAL_TASKS: any[] = [
    {
        id: '1',
        status_id: '28',
        title: 'Research Project',
        description: 'Gather requirements and create initial documentation',
    },
    {
        id: '2',
        status_id: '28',
        title: 'Design System',
        description: 'Create component library and design tokens',
    },
    {
        id: '3',
        status_id: '29',
        title: 'API Integration',
        description: 'Implement REST API endpoints',
    },
    {
        id: '4',
        status_id: '30',
        title: 'Testing',
        description: 'Write unit tests for core functionality',
    },
];

const createColumnFirstCollision =
    (validStatuses: any[]): CollisionDetection =>
        (args) => {
            // Get all collisions
            const collisions = rectIntersection(args)
            // Prefer collisions with column droppables (ids are status keys)
            const columnCollisions = collisions.filter((c) =>
                validStatuses.includes(c.id)
            )
            if (columnCollisions.length > 0) return columnCollisions
            // Fallback to default behavior for item-level sorting
            return closestCorners(args)
        }


const validStatuses = STATUS_COLUMN.map((c) => c.title)
const collisionDetection = createColumnFirstCollision(validStatuses)

function canMove(from: string, to: string) {

    const from_id = STATUS_COLUMN.find((status) => status.title === from)?.id;
    const to_id = STATUS_COLUMN.find((status) => status.title === to)?.id

    return TRANSITION.some((transition) => transition.from_id === from_id && transition.to_id === to_id);
}

export default function DragableBoard() {


    const [tasks, setTasks] = useState<Tasks>({
        to_do: INITIAL_TASKS.filter((task) => task.status_id === '28'),
        in_progress: INITIAL_TASKS.filter((task) => task.status_id === '29'),
        done: INITIAL_TASKS.filter((task) => task.status_id === '30'),
        review: INITIAL_TASKS.filter((task) => task.status_id === '31'),
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    return (
        <div className="flex flex-row">
            <DndContext
                sensors={sensors}
                collisionDetection={collisionDetection}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                {STATUS_COLUMN.map((column) => (
                    <Column
                        key={column.id}
                        column={column}
                        tasks={tasks[column.title]}
                    />
                ))}
            </DndContext>
        </div>
    );

    function findActiveContainer(id: string) {
        for (let container in tasks) {
            const task = tasks[container].find((task) => task.id === id);
            if (task) {
                const column = STATUS_COLUMN.find((column) => column.id === task.status_id);
                return column ? column.title : null;
            }
        }
        return null;
    }

    function findOVerContainer(id: string) {
        const column = STATUS_COLUMN.find(column => column.id === id);

        return column ? column.title : null;

    }


    // Khi kéo bắt đầu
    function handleDragStart(event: any) {
        const { active } = event;
        const { id } = active;
        // setActiveId(id);
    }

    // Khi kéo xong
    function handleDragEnd(event: any) {

        const { active, over } = event;
        const { id } = active;
        const { id: overId } = over;

        const activeContainer = findActiveContainer(id);
        const overContainer = findOVerContainer(overId);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        if (!canMove(activeContainer, overContainer)) {
            toast.warn("Wrong workflow process")
            return;
        }

        const activeIndex = tasks[activeContainer].findIndex((task) => task.id === id);
        const overIndex = tasks[overContainer] ? tasks[overContainer].findIndex((task) => task.status_id === overId) : -1;

        if (activeIndex !== -1) {
            const movedTask = tasks[activeContainer][activeIndex];

            const updatedTasks = {
                ...tasks,
                [activeContainer]: tasks[activeContainer].filter((task) => task.id !== id),
                [overContainer]: overIndex !== -1
                    ? [
                        ...tasks[overContainer],
                        { ...movedTask, status_id: overId },
                    ]
                    : [
                        { ...movedTask, status_id: overId },
                    ],
            };
            // Gọi hàm update issue ở đây 
            setTasks(updatedTasks);
            toast.success("Update issue status successfully")
        }

    }
}
