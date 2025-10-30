
import { useState } from "react";
import { CheckCircle, Circle, AlertCircle, XCircle } from "lucide-react";
import { Phase, TaskStatus } from "./types";
import { initialPhases } from "./roadmapData";

export const useRoadmap = () => {
  const [phases, setPhases] = useState<Phase[]>(initialPhases);
  const [expandedPhases, setExpandedPhases] = useState<number[]>([3, 7, 9, 10]);
  const [editingPhase, setEditingPhase] = useState<number | null>(null);

  const togglePhase = (phaseId: number) => {
    setExpandedPhases(prev => 
      prev.includes(phaseId) 
        ? prev.filter(id => id !== phaseId) 
        : [...prev, phaseId]
    );
  };

  const updateTaskStatus = (phaseId: number, taskIndex: number) => {
    const newPhases = [...phases];
    const phase = newPhases.find(p => p.id === phaseId);
    
    if (!phase) return;
    
    const task = phase.tasks[taskIndex];
    
    const statusOrder: TaskStatus[] = ['upcoming', 'in-progress', 'blocked', 'completed', 'canceled'];
    const currentStatusIndex = statusOrder.indexOf(task.status);
    const newStatus = statusOrder[(currentStatusIndex + 1) % statusOrder.length];
    
    task.status = newStatus;
    
    updatePhaseStatus(phaseId, newPhases);
    
    setPhases(newPhases);
  };

  const updatePhaseStatus = (phaseId: number, phasesArray: Phase[]) => {
    const phase = phasesArray.find(p => p.id === phaseId);
    if (!phase) return;
    
    const tasksStatuses = phase.tasks.map(t => t.status);
    
    if (tasksStatuses.every(status => status === 'canceled')) {
      phase.status = 'canceled';
    } else if (tasksStatuses.every(status => status === 'completed')) {
      phase.status = 'completed';
    } else if (tasksStatuses.some(status => status === 'blocked')) {
      phase.status = 'blocked';
    } else if (tasksStatuses.some(status => status === 'in-progress')) {
      phase.status = 'in-progress';
    } else {
      phase.status = 'upcoming';
    }
  };

  const getStatusBadgeClass = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-jara-green/20 text-jara-green border-jara-green';
      case 'in-progress':
        return 'bg-jara-teal/20 text-jara-teal border-jara-teal';
      case 'upcoming':
        return 'bg-gray-200 text-gray-600 border-gray-400';
      case 'blocked':
        return 'bg-jara-orange/20 text-jara-orange border-jara-orange';
      case 'canceled':
        return 'bg-red-100 text-red-600 border-red-500';
      default:
        return 'bg-gray-200 text-gray-600';
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-jara-green" />;
      case 'in-progress':
        return <Circle className="h-5 w-5 text-jara-teal animate-pulse" />;
      case 'blocked':
        return <AlertCircle className="h-5 w-5 text-jara-orange" />;
      case 'canceled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  // Calculate progress (exclude canceled phases from calculation)
  const activeTasks = phases
    .filter(phase => phase.status !== 'canceled')
    .reduce((sum, phase) => sum + phase.tasks.filter(task => task.status !== 'canceled').length, 0);
  
  const completedTasks = phases
    .filter(phase => phase.status !== 'canceled')
    .reduce((sum, phase) => sum + phase.tasks.filter(task => task.status === 'completed').length, 0);
  
  const progressPercentage = activeTasks > 0 ? Math.round((completedTasks / activeTasks) * 100) : 0;

  return {
    phases,
    expandedPhases,
    editingPhase,
    togglePhase,
    updateTaskStatus,
    getStatusBadgeClass,
    getStatusIcon,
    progressPercentage
  };
};
