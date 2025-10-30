
import React from "react";

interface RoadmapHeaderProps {
  progressPercentage: number;
}

const RoadmapHeader = ({ progressPercentage }: RoadmapHeaderProps) => {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-3xl font-bold text-jara-green mb-2">
        TPEC Development Roadmap
      </h2>
      <p className="text-gray-600 mb-4">
        Nigerian Event Planning Platform - Implementation Timeline
      </p>
      
      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div 
          className="bg-gradient-to-r from-jara-green to-jara-teal h-4 rounded-full" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600">Overall Progress: {progressPercentage}% complete</p>
    </div>
  );
};

export default RoadmapHeader;
