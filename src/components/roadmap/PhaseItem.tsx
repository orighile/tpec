
import React from "react";
import { Phase, TaskItem as TaskItemType } from "./types";
import TaskItem from "./TaskItem";
import { ChevronDown, ChevronUp } from "lucide-react";

interface PhaseItemProps {
  phase: Phase;
  isExpanded: boolean;
  togglePhase: () => void;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusBadgeClass: (status: string) => string;
  updateTaskStatus: (taskIndex: number) => void;
  index: number;
  isLastPhase: boolean;
}

const PhaseItem = ({ 
  phase, 
  isExpanded, 
  togglePhase,
  getStatusIcon,
  getStatusBadgeClass,
  updateTaskStatus,
  index,
  isLastPhase
}: PhaseItemProps) => {
  return (
    <div className="mb-6 relative">
      {!isLastPhase && (
        <div className="absolute left-[1.25rem] top-[2.75rem] bottom-0 w-1 bg-gray-200"></div>
      )}
      
      <div 
        className={`
          border-2 rounded-lg overflow-hidden shadow-sm transition-all duration-300 
          ${phase.status === 'completed' ? 'border-jara-green/70' : ''}
          ${phase.status === 'in-progress' ? 'border-jara-teal/70' : ''}
          ${phase.status === 'blocked' ? 'border-jara-orange/70' : ''}
          ${phase.status === 'upcoming' ? 'border-gray-300' : ''}
        `}
      >
        <div 
          className={`
            p-4 flex items-center justify-between cursor-pointer
            ${phase.status === 'completed' ? 'bg-jara-green/10' : ''}
            ${phase.status === 'in-progress' ? 'bg-jara-teal/10' : ''}
            ${phase.status === 'blocked' ? 'bg-jara-orange/10' : ''}
            ${phase.status === 'upcoming' ? 'bg-gray-100' : ''}
          `}
          onClick={togglePhase}
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {getStatusIcon(phase.status)}
            </div>
            <div>
              <h3 className="font-bold text-xl flex items-center gap-2">
                Phase {phase.id}: {phase.name}
                <span 
                  className={`text-xs px-2 py-0.5 rounded-full border ${getStatusBadgeClass(phase.status)}`}
                >
                  {phase.status.replace('-', ' ')}
                </span>
              </h3>
              <p className="text-sm text-gray-600">{phase.timeframe}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-600" />
            )}
          </div>
        </div>
        
        {isExpanded && (
          <div className="p-4 bg-white">
            <p className="text-gray-700 mb-4">{phase.description}</p>
            
            {phase.dependencies && phase.dependencies.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600">
                  Dependencies: Phase{phase.dependencies.length > 1 ? 's' : ''} {phase.dependencies.join(', ')}
                </p>
              </div>
            )}
            
            <div className="space-y-3 mt-4">
              <h4 className="font-medium">Tasks:</h4>
              {phase.tasks.map((task, taskIndex) => (
                <TaskItem 
                  key={taskIndex}
                  task={task}
                  onClick={() => updateTaskStatus(taskIndex)}
                  statusIcon={getStatusIcon(task.status)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhaseItem;
