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
import { Column } from "./Column";
import { Task, Column as ColumnType, Issue } from "./types";

import { toast } from "react-toastify";
import { useEditIssue } from "@/hooks/useIssue";
import Cookies from "js-cookie";
import { Spin } from "antd";

interface Tasks {
  [key: string]: Issue[];
}

const DragableBoard = ({
  projectId,
  issues,
  workflow,
}: {
  projectId: number;
  issues: any[];
  workflow: any;
}) => {
  const [statusColumn, setStatusColumn] = useState<
    { id: number; title: string; name: string }[] | undefined
  >(undefined);
  const [transitionStatus, setTransitionStatus] = useState<
    { id: number; from_id: number; to_id: number }[] | undefined
  >(undefined);

  const [tasks, setTasks] = useState<Tasks>({});

  const { mutate: mutationEdit, isPending: isEditingStatus } = useEditIssue();

  useEffect(() => {
    if (workflow) {
      const sortedStatus = workflow.status.sort((a: any, b: any) => {
        if (a.isInit && !b.isInit) return -1;
        if (!a.isInit && b.isInit) return 1;
        if (!a.isFinal && b.isFinal) return -1;
        if (a.isFinal && !b.isFinal) return 1;
        return 0;
      });
      const STATUS_COLUMN = sortedStatus.map((status: any) => ({
        id: status.id,
        name: status.name,
        title: status.name
          .replace(/_/g, " ")
          .split(" ")
          .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      }));

      const STATUS_TRANSITION = workflow?.transition.map((transition: any) => ({
        id: transition.id,
        from_id: transition.statusIdFrom,
        to_id: transition.statusIdTo,
      }));

      const categorizedTasks: Tasks = {};

      const ISSUE_ITEM = issues?.map((issue: any) => ({
        ...issue,
        status_id: STATUS_COLUMN?.find(
          (status: any) => status.name === issue.status
        )?.id,
      }));

      setStatusColumn(STATUS_COLUMN);

      setTransitionStatus(STATUS_TRANSITION);

      STATUS_COLUMN.forEach((status: any) => {
        categorizedTasks[status.name] = ISSUE_ITEM.filter(
          (task) => task.status_id === status.id
        );
      });

      setTasks(categorizedTasks);
    }
  }, [workflow, issues]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const createColumnFirstCollision =
    (validStatuses: any[] | undefined): CollisionDetection =>
    (args) => {
      const collisions = rectIntersection(args);

      if (validStatuses) {
        const columnCollisions = collisions.filter((c) =>
          validStatuses.includes(c.id)
        );

        if (columnCollisions.length > 0) return columnCollisions;
      }
      return closestCorners(args);
    };

  const validStatuses = statusColumn?.map((c) => c.name);
  const collisionDetection = createColumnFirstCollision(validStatuses);

  function canMove(from: string, to: string) {
    const from_id = statusColumn?.find((status) => status.name === from)?.id;
    const to_id = statusColumn?.find((status) => status.name === to)?.id;

    if (transitionStatus) {
      return transitionStatus.some(
        (transition) =>
          Number(transition.from_id) === from_id &&
          Number(transition.to_id) === to_id
      );
    }
    return false;
  }

  function findActiveContainer(id: number) {
    for (let container in tasks) {
      const task = tasks[container].find((task) => task.id === id);
      if (task) {
        const column = statusColumn?.find(
          (column) => column.id === task.status_id
        );
        return column ? column.name : null;
      }
    }
    return null;
  }

  function findOVerContainer(id: number) {
    const column = statusColumn?.find((column) => column.id === id);

    return column ? column.name : null;
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

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    if (!canMove(activeContainer, overContainer)) {
      toast.warn("Wrong workflow process");
      return;
    }

    const activeIndex = tasks[activeContainer].findIndex(
      (task) => task.id === id
    );
    const overIndex = tasks[overContainer]
      ? tasks[overContainer].findIndex((task) => task.status_id === overId)
      : -1;

    if (activeIndex !== -1) {
      const movedTask = tasks[activeContainer][activeIndex];
      Cookies.set("action_project_id", projectId?.toString());
      mutationEdit(
        {
          id: movedTask.id,
          data: {
            status: overContainer,
          },
        },
        {
          onSuccess: () => {
            const updatedTasks = {
              ...tasks,
              [activeContainer]: tasks[activeContainer].filter(
                (task) => task.id !== id
              ),
              [overContainer]:
                overIndex !== -1
                  ? [
                      ...tasks[overContainer],
                      { ...movedTask, status_id: overId },
                    ]
                  : [{ ...movedTask, status_id: overId }],
            };
            setTasks(updatedTasks);
            toast.success("Update issue status successfully");
          },
          onError: (error: any) => {
            if (error?.response?.data?.statusCode === 403) {
              toast.error(error?.response?.data?.message);
            } else {
              toast.error("Update issue status failed");
            }
          },
        }
      );
    }
  }

  return (
    <div className="w-full overflow-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* <div className="flex flex-row gap-4">
                    {statusColumn?.map((column) => (
                        <Column
                            key={column.id}
                            column={column}
                            tasks={tasks[column.name]}
                        />
                    ))}
                </div> */}
        <div className=" flex overflow-auto">
          {statusColumn?.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={tasks[column.name]}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default DragableBoard;
