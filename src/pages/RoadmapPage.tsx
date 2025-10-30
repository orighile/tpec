
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Roadmap from "../components/Roadmap";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const RoadmapPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Development Roadmap</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Track our progress as we build Nigeria's premier event planning platform
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              <CheckCircle className="h-4 w-4" /> Project Phase 1 Complete!
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <Link to="/advanced-features">
                <Button className="bg-jara-teal hover:bg-jara-teal/90">
                  Explore Advanced Features Demo
                </Button>
              </Link>
              <Link to="/ai-recommendations">
                <Button variant="outline" className="border-jara-teal text-jara-teal hover:bg-jara-teal/10">
                  Try AI Recommendations
                </Button>
              </Link>
            </div>
          </div>
          
          <Roadmap />
          
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold mb-4">Project Milestone Achieved!</h3>
            <p className="text-gray-600 mb-6">
              We've successfully completed all planned features for this release. Phase 2 development planning is now underway.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link to="/advanced-features">
                <Button className="bg-jara-green hover:bg-jara-green/90">
                  Try Our New Features
                </Button>
              </Link>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center bg-jara-purple hover:bg-jara-purple/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Give Us Feedback
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RoadmapPage;
