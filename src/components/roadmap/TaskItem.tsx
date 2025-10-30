
import React from "react";
import { TaskItem as TaskItemType } from "./types";

interface TaskItemProps {
  task: TaskItemType;
  onClick: () => void;
  statusIcon: React.ReactNode;
}

const TaskItem = ({ task, onClick, statusIcon }: TaskItemProps) => {
  return (
    <div 
      className={`
        flex items-center gap-3 p-3 rounded-md transition-all 
        ${task.isCritical ? 'border-2 border-red-500/70' : 'border border-gray-200'}
        ${task.status === 'completed' ? 'bg-jara-green/5' : ''}
        ${task.status === 'in-progress' ? 'bg-jara-teal/5' : ''}
        ${task.status === 'blocked' ? 'bg-jara-orange/5' : ''}
      `}
    >
      <button 
        onClick={onClick}
        className="flex-shrink-0"
      >
        {statusIcon}
      </button>
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <span className={task.status === 'completed' ? 'line-through text-gray-500' : ''}>
            {task.name}
          </span>
          {task.isCritical && (
            <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">
              Critical
            </span>
          )}
          {task.riskLevel && (
            <span 
              className={`
                text-xs px-2 py-0.5 rounded-full
                ${task.riskLevel === 'high' ? 'bg-red-100 text-red-700' : ''}
                ${task.riskLevel === 'medium' ? 'bg-amber-100 text-amber-700' : ''}
                ${task.riskLevel === 'low' ? 'bg-green-100 text-green-700' : ''}
              `}
            >
              {task.riskLevel} risk
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
