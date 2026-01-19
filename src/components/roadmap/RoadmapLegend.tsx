
import React from "react";

const RoadmapLegend = () => {
  return (
    <div className="mt-8 border-t border-border pt-4">
      <h4 className="font-medium mb-2 text-foreground">Legend:</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-sm text-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-primary"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-accent"></div>
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-muted-foreground"></div>
          <span>Upcoming</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-secondary"></div>
          <span>Blocked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-destructive rounded-md"></div>
          <span>Critical Path</span>
        </div>
      </div>
    </div>
  );
};

export default RoadmapLegend;
