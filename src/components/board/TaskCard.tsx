import { useDraggable } from '@dnd-kit/core';
import { Task } from './types';
import { useEffect } from 'react';


type TaskCardProps = {
  task: Task;
};

export function TaskCard({ task }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });



  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cursor-grab bg-white p-4 shadow-sm hover:shadow-md"
      style={style}
    >
      <h3 className="font-medium text-black">{task.title}</h3>
      <p className="mt-2 text-sm text-black">{task.description}</p>
    </div>
  );
}