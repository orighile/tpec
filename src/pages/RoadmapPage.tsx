import Roadmap from "../components/Roadmap";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const RoadmapPage = () => {
  return (
    <main className="flex-1 py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Development Roadmap</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Track our progress as we build Nigeria's premier event planning platform
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <CheckCircle className="h-4 w-4" /> Project Phase 1 Complete!
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <Link to="/advanced-features">
              <Button>
                Explore Advanced Features Demo
              </Button>
            </Link>
            <Link to="/ai-recommendations">
              <Button variant="outline">
                Try AI Recommendations
              </Button>
            </Link>
          </div>
        </div>
        
        <Roadmap />
        
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold mb-4">Project Milestone Achieved!</h3>
          <p className="text-muted-foreground mb-6">
            We've successfully completed all planned features for this release. Phase 2 development planning is now underway.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/advanced-features">
              <Button>
                Try Our New Features
              </Button>
            </Link>
            <Button variant="outline" asChild>
              <a href="/contact">
                Give Us Feedback
              </a>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RoadmapPage;
