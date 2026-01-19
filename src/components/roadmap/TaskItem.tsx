
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
        ${task.isCritical ? 'border-2 border-destructive/70' : 'border border-border'}
        ${task.status === 'completed' ? 'bg-primary/5' : ''}
        ${task.status === 'in-progress' ? 'bg-accent/5' : ''}
        ${task.status === 'blocked' ? 'bg-secondary/5' : ''}
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
          <span className={task.status === 'completed' ? 'line-through text-muted-foreground' : ''}>
            {task.name}
          </span>
          {task.isCritical && (
            <span className="bg-destructive/10 text-destructive text-xs px-2 py-0.5 rounded-full">
              Critical
            </span>
          )}
          {task.riskLevel && (
            <span 
              className={`
                text-xs px-2 py-0.5 rounded-full
                ${task.riskLevel === 'high' ? 'bg-destructive/10 text-destructive' : ''}
                ${task.riskLevel === 'medium' ? 'bg-secondary text-secondary-foreground' : ''}
                ${task.riskLevel === 'low' ? 'bg-primary/10 text-primary' : ''}
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
