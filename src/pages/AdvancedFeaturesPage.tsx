
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAdvancedFeatures } from "../hooks/useAdvancedFeatures";

// Import our new components
import OfflineMode from "../components/advanced-features/OfflineMode";
import ARPreview from "../components/advanced-features/ARPreview";
import VoiceCommands from "../components/advanced-features/VoiceCommands";
import FeatureSummaryCards from "../components/advanced-features/FeatureSummaryCards";

const AdvancedFeaturesPage: React.FC = () => {
  const {
    offlineMode,
    isListening,
    voiceCommand,
    voiceResults,
    arModelLoading,
    arModelLoaded,
    loadingProgress,
    toggleOfflineMode,
    loadArVenueModel,
    toggleVoiceRecognition
  } = useAdvancedFeatures();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Advanced Technology Features</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore cutting-edge technology capabilities designed to revolutionize Nigerian event planning
            </p>
          </div>

          <Tabs defaultValue="offline" className="w-full max-w-5xl mx-auto">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="offline" className="text-lg py-3">Offline-First Mode</TabsTrigger>
              <TabsTrigger value="ar" className="text-lg py-3">AR Venue Preview</TabsTrigger>
              <TabsTrigger value="voice" className="text-lg py-3">Voice Search & Commands</TabsTrigger>
            </TabsList>

            <TabsContent value="offline">
              <OfflineMode 
                offlineMode={offlineMode} 
                toggleOfflineMode={toggleOfflineMode} 
              />
            </TabsContent>

            <TabsContent value="ar">
              <ARPreview 
                arModelLoaded={arModelLoaded}
                arModelLoading={arModelLoading}
                loadingProgress={loadingProgress}
                loadArVenueModel={loadArVenueModel}
              />
            </TabsContent>

            <TabsContent value="voice">
              <VoiceCommands 
                isListening={isListening}
                voiceCommand={voiceCommand}
                voiceResults={voiceResults}
                toggleVoiceRecognition={toggleVoiceRecognition}
              />
            </TabsContent>
          </Tabs>
          
          <div className="mt-12 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">How These Features Transform Event Planning</h2>
            <FeatureSummaryCards />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdvancedFeaturesPage;
