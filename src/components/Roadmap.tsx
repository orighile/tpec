
import React from "react";
import { useRoadmap } from "./roadmap/useRoadmap";
import PhaseItem from "./roadmap/PhaseItem";
import RoadmapHeader from "./roadmap/RoadmapHeader";
import RoadmapLegend from "./roadmap/RoadmapLegend";

const Roadmap = () => {
  const {
    phases,
    expandedPhases,
    togglePhase,
    updateTaskStatus,
    getStatusBadgeClass,
    getStatusIcon,
    progressPercentage
  } = useRoadmap();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-5xl mx-auto">
      <RoadmapHeader progressPercentage={progressPercentage} />

      <div className="relative">
        {phases.map((phase, index) => (
          <PhaseItem 
            key={phase.id}
            phase={phase}
            isExpanded={expandedPhases.includes(phase.id)}
            togglePhase={() => togglePhase(phase.id)}
            getStatusIcon={getStatusIcon}
            getStatusBadgeClass={getStatusBadgeClass}
            updateTaskStatus={(taskIndex) => updateTaskStatus(phase.id, taskIndex)}
            index={index}
            isLastPhase={index === phases.length - 1}
          />
        ))}
      </div>
      
      <RoadmapLegend />
    </div>
  );
};

export default Roadmap;
