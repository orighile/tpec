
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SocialProof2 from "../components/social/SocialProof2";
import TrendingAlerts2 from "../components/social/TrendingAlerts2";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MessageSquare, Trophy } from "lucide-react";
import { toast } from "sonner";

const SocialAndTrendsPage: React.FC = () => {
  const handleBrowseStories = () => {
    toast.info("Browsing stories feature coming soon!");
    // In a real implementation, this would navigate to a stories page
  };

  const handleViewGallery = () => {
    toast.info("Event gallery feature coming soon!");
    // In a real implementation, this would navigate to a gallery page
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Social & Trends Hub</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with other event planners, share your experiences, and stay updated with latest Nigerian event trends
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-sm p-5 text-center flex flex-col items-center">
              <div className="bg-jara-teal/10 p-3 rounded-full mb-3">
                <MessageSquare className="h-6 w-6 text-jara-teal" />
              </div>
              <h3 className="font-bold text-lg">Social Proof</h3>
              <p className="text-gray-600 text-sm mt-1 mb-4">Share and discover event success stories</p>
              <Button variant="outline" size="sm" className="w-full" onClick={handleBrowseStories}>
                Browse Stories
              </Button>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5 text-center flex flex-col items-center">
              <div className="bg-jara-teal/10 p-3 rounded-full mb-3">
                <Trophy className="h-6 w-6 text-jara-teal" />
              </div>
              <h3 className="font-bold text-lg">Event Gallery</h3>
              <p className="text-gray-600 text-sm mt-1 mb-4">Showcase your event photographs</p>
              <Button variant="outline" size="sm" className="w-full" onClick={handleViewGallery}>
                View Gallery
              </Button>
            </div>
          </div>

          <Tabs defaultValue="social" className="w-full max-w-5xl mx-auto">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="social" className="text-lg py-3">Social Proof 2.0</TabsTrigger>
              <TabsTrigger value="trending" className="text-lg py-3">Trending Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value="social">
              <SocialProof2 />
            </TabsContent>

            <TabsContent value="trending">
              <TrendingAlerts2 />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SocialAndTrendsPage;
