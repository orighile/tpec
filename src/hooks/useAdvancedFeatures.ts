
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useAdvancedFeatures = () => {
  const { toast } = useToast();
  const [offlineMode, setOfflineMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState("");
  const [voiceResults, setVoiceResults] = useState<string[]>([]);
  const [arModelLoading, setArModelLoading] = useState(false);
  const [arModelLoaded, setArModelLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const toggleOfflineMode = () => {
    setOfflineMode(!offlineMode);
    toast({
      title: offlineMode ? "Online Mode Activated" : "Offline Mode Activated",
      description: offlineMode 
        ? "Online mode activated. Syncing data with server..." 
        : "Offline mode activated. All changes will be stored locally."
    });
  };

  const loadArVenueModel = () => {
    if (arModelLoaded) {
      setArModelLoaded(false);
      setLoadingProgress(0);
      toast({
        title: "AR Model Unloaded",
        description: "AR model unloaded. Resources freed."
      });
      return;
    }

    setArModelLoading(true);
    setLoadingProgress(0);
    toast({
      title: "Loading AR Model",
      description: "Initializing AR engine and loading 3D model..."
    });

    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + (Math.random() * 3 + 2);
        if (newProgress >= 100) {
          clearInterval(interval);
          setArModelLoading(false);
          setArModelLoaded(true);
          toast({
            title: "AR Model Ready",
            description: "AR venue model loaded successfully! Click to interact."
          });
          return 100;
        }
        return newProgress;
      });
    }, 100);
  };

  const toggleVoiceRecognition = () => {
    if (isListening) {
      setIsListening(false);
      if (voiceCommand) {
        setVoiceResults(prev => [voiceCommand, ...prev.slice(0, 4)]);
        simulateVoiceCommandResponse(voiceCommand);
        setVoiceCommand("");
      }
    } else {
      setIsListening(true);
      toast({
        title: "Voice Recognition Active",
        description: "Voice recognition activated. Speak your command..."
      });
      setTimeout(() => {
        const sampleCommands = [
          "Show me available venues in Lagos",
          "Find caterers near me",
          "Schedule meeting with wedding planner",
          "Add budget item for decorations",
          "What's the weather forecast for my event date?"
        ];
        const randomCommand = sampleCommands[Math.floor(Math.random() * sampleCommands.length)];
        setVoiceCommand(randomCommand);
      }, 2000);
    }
  };

  const simulateVoiceCommandResponse = (command: string) => {
    if (command.toLowerCase().includes("venue")) {
      toast({
        title: "Venues Found",
        description: "Found 12 venues matching your criteria."
      });
    } else if (command.toLowerCase().includes("caterer") || command.toLowerCase().includes("caterers")) {
      toast({
        title: "Caterers Found",
        description: "Found 5 caterers in your area."
      });
    } else if (command.toLowerCase().includes("schedule") || command.toLowerCase().includes("meeting")) {
      toast({
        title: "Meeting Scheduled",
        description: "Meeting scheduled for tomorrow at 2 PM."
      });
    } else if (command.toLowerCase().includes("budget")) {
      toast({
        title: "Budget Updated",
        description: "Added ₦50,000 for decorations to your budget."
      });
    } else if (command.toLowerCase().includes("weather")) {
      toast({
        title: "Weather Forecast",
        description: "Weather forecast: Sunny, 28°C on your event date."
      });
    } else {
      toast({
        title: "Command Received",
        description: "Command received. Processing your request."
      });
    }
  };

  return {
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
  };
};
