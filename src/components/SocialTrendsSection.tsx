
import React from "react";
import { ChatCircle, Trophy, ArrowRight } from "phosphor-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const SocialTrendsSection: React.FC = () => {
  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Community & Social Hub</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with other event planners, share experiences, and stay updated with latest Nigerian event trends
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-card rounded-xl shadow-sm p-5 text-center flex flex-col items-center">
            <div className="bg-primary/10 p-3 rounded-full mb-3">
              <ChatCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg text-foreground">Social Proof</h3>
            <p className="text-muted-foreground text-sm mt-1 mb-4">Share and discover event success stories</p>
          </div>
          <div className="bg-card rounded-xl shadow-sm p-5 text-center flex flex-col items-center">
            <div className="bg-primary/10 p-3 rounded-full mb-3">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg text-foreground">Event Gallery</h3>
            <p className="text-muted-foreground text-sm mt-1 mb-4">Showcase your event photographs</p>
          </div>
        </div>

        <div className="text-center">
          <Button asChild>
            <Link to="/social-and-trends" className="inline-flex items-center gap-2">
              Explore Social & Trends Hub
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SocialTrendsSection;
