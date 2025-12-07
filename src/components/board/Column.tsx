'use client'

import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard';
import { Column as ColumnType, Issue, Task } from './types';
import { useEffect } from 'react';

type ColumnProps = {
  column: ColumnType;  // column có kiểu Column, không phải kiểu có id là number
  tasks: Issue[];
};

export function Column({ column, tasks = [] }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });




  return (
    <div className="flex w-full flex-col bg-white border">
      <h2 className="text-center font-semibold p-4 text-black bg-background border-b">{column.title}</h2>
      <div ref={setNodeRef} className="flex flex-1 p-2 gap-1 flex-col bg-background">
        {tasks && tasks.map((task) => (
          task.status_id === column.id && (
            <TaskCard key={task.id} task={task} />
          )
        ))}
      </div>
    </div>
  );
}
