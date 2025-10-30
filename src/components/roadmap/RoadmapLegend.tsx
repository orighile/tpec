
import React from "react";

const RoadmapLegend = () => {
  return (
    <div className="mt-8 border-t pt-4">
      <h4 className="font-medium mb-2">Legend:</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-jara-green"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-jara-teal"></div>
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-400"></div>
          <span>Upcoming</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-jara-orange"></div>
          <span>Blocked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-red-500 rounded-md"></div>
          <span>Critical Path</span>
        </div>
      </div>
    </div>
  );
};

export default RoadmapLegend;
