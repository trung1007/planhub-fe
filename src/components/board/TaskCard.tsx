'use client'
import { useDraggable } from '@dnd-kit/core';
import { Issue, Task } from './types';
import { useEffect, useState } from 'react';
import { IssueTagList } from '../tag/IssueTagList';
import { IssueTypeTag } from '../tag/IssueTypeTag';
import { MdDragIndicator, MdOutlinePushPin } from 'react-icons/md';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { FaRegComment } from 'react-icons/fa';
import { IssuePriorityTag } from '../tag/IssuePriorityTag';


type TaskCardProps = {
  task: Issue;
};

export function TaskCard({ task }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
      transform: `translate(${transform.x}px, ${transform.y}px)`,
      zIndex: 999
    }
    : undefined;


  const [showAll, setShowAll] = useState(false);

  const visibleTags = showAll ? task.tags : task.tags.slice(0, 3);
  const hiddenTagsCount = task.tags.length - visibleTags.length;

  const handleShowMore = (e: React.MouseEvent) => {
    setShowAll(true);
  };

  return (
    <div
      ref={setNodeRef}
      className=" bg-white p-1 hover:shadow-md flex justify-start rounded-lg "
      style={style}
    >
      <div
        {...attributes}
        {...listeners}
        style={{ cursor: "grab" }}>
        <MdDragIndicator />
      </div>
      <div className='flex flex-1 flex-col gap-2 p-2'>
        <div className='flex flex-col gap-2'>
          <div className='flex gap-1 items-center'>

            <IssueTagList tags={visibleTags} />
            {hiddenTagsCount > 0 && !showAll && (
              <button
                onClick={handleShowMore}
                className="mt-2 text-sm text-blue-500 hover:underline cursor-pointer"
                style={{ pointerEvents: 'auto' }}
              >
                +{hiddenTagsCount} more
              </button>
            )}
          </div>
          <div className='flex justify-between items-center' >
            <p className="text-sm flex flex-1 text-black font-semibold ">{task.summary}</p>

            <IssuePriorityTag priority={task.priority} />

          </div>
        </div>
        <div className='flex justify-between items-center'>
          <div className='flex gap-1'>
            <IssueTypeTag type={task.type} />
            <span>{task.name}</span>
          </div>
          <div className='flex gap-2'>
            <div className='flex gap-1 items-center opacity-50'>
              <MdOutlinePushPin /> {task.numOfAttachment}
            </div>
            <div className='flex gap-1 items-center opacity-50'>
              <IoDocumentTextOutline /> {task.numOfSubtask}
            </div>
            <div className='flex gap-1 items-center opacity-50'>
              <FaRegComment /> {task.numOfComment}
            </div>
          </div>
        </div>
        {/* <div className="flex items-center justify-between gap-2 w-full">
       
          <div className="flex items-center gap-1 min-w-0 flex-1">
            <IssueTypeTag type={task.type} />
            <span className="truncate font-medium">
              {task.name}
            </span>
          </div>

     
          <div className="flex gap-2 shrink-0 whitespace-nowrap max-md:hidden">
            <div className="flex gap-1 items-center opacity-50">
              <MdOutlinePushPin /> {task.numOfAttachment}
            </div>
            <div className="flex gap-1 items-center opacity-50">
              <IoDocumentTextOutline /> {task.numOfSubtask}
            </div>
            <div className="flex gap-1 items-center opacity-50">
              <FaRegComment /> {task.numOfComment}
            </div>
          </div>
        </div> */}
      </div>

    </div>
  );
}
