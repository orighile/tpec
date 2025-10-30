import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AIRecommendation } from "@/components/jarabot";

export interface RecommendationFilters {
  category?: string;
  confidence?: number;
}

export const useAIRecommendations = (eventId?: string) => {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<RecommendationFilters>({});

  // Generate intelligent recommendations based on event data
  const generateRecommendations = async (eventData: any) => {
    setLoading(true);
    
    try {
      // In a real implementation, this would call an AI service
      // For now, we'll generate contextual recommendations based on the event data
      const newRecommendations: AIRecommendation[] = [];
      
      // Budget-based recommendations
      if (eventData?.budget) {
        if (eventData.budget < 100000) {
          newRecommendations.push({
            id: `rec-budget-${Date.now()}`,
            category: "budget",
            title: "Consider buffet service to reduce costs",
            description: "A buffet service typically costs 30-40% less than plated meals while still providing variety for your guests.",
            confidence: 85,
            reasoning: "Your current budget suggests cost efficiency is important. Buffet service reduces labor costs and food waste.",
            createdAt: new Date(),
          });
        }
      }
      
      // Guest count recommendations
      if (eventData?.guestCount) {
        if (eventData.guestCount > 200) {
          newRecommendations.push({
            id: `rec-venue-${Date.now()}`,
            category: "venue",
            title: "Consider outdoor venue for large gatherings",
            description: "For events with 200+ guests, outdoor venues often provide better space utilization and atmosphere.",
            confidence: 80,
            reasoning: "Large guest counts require significant space. Outdoor venues typically offer more flexibility and better cost per square meter.",
            createdAt: new Date(),
          });
        }
      }
      
      // Seasonal recommendations
      const currentMonth = new Date().getMonth();
      if (currentMonth >= 11 || currentMonth <= 2) { // Dry season in Nigeria
        newRecommendations.push({
          id: `rec-season-${Date.now()}`,
          category: "timing",
          title: "Perfect timing for outdoor events",
          description: "The dry season (November-March) is ideal for outdoor events in Nigeria with minimal rain risk.",
          confidence: 95,
          reasoning: "Weather data shows less than 5% chance of rain during this period, making outdoor events more reliable.",
          createdAt: new Date(),
        });
      }

      setRecommendations(prev => [...prev, ...newRecommendations]);
      
      toast({
        title: "New Recommendations",
        description: `Generated ${newRecommendations.length} new recommendations for your event`,
      });
      
    } catch (error) {
      console.error("Error generating recommendations:", error);
      toast({
        title: "Error",
        description: "Failed to generate recommendations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const dismissRecommendation = (id: string) => {
    setRecommendations(prev => prev.filter(rec => rec.id !== id));
    
    toast({
      title: "Recommendation dismissed",
      description: "The recommendation has been removed from your list",
    });
  };

  const applyRecommendation = async (id: string) => {
    const recommendation = recommendations.find(rec => rec.id === id);
    if (!recommendation) return;

    // In a real implementation, this would apply the recommendation to the event
    toast({
      title: "Recommendation Applied",
      description: `Applied: ${recommendation.title}`,
    });
    
    // Mark as applied (could add an 'applied' field to the recommendation)
    setRecommendations(prev => prev.map(rec => 
      rec.id === id ? { ...rec, applied: true } : rec
    ));
  };

  const getFilteredRecommendations = () => {
    return recommendations.filter(rec => {
      if (filters.category && rec.category !== filters.category) return false;
      if (filters.confidence && rec.confidence < filters.confidence) return false;
      return true;
    });
  };

  // Load recommendations from localStorage for demo
  useEffect(() => {
    if (!eventId) return;
    
    const stored = localStorage.getItem(`recommendations-${eventId}`);
    if (stored) {
      try {
        setRecommendations(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading recommendations:", error);
      }
    }
  }, [eventId]);

  // Save recommendations to localStorage
  useEffect(() => {
    if (eventId && recommendations.length > 0) {
      localStorage.setItem(`recommendations-${eventId}`, JSON.stringify(recommendations));
    }
  }, [eventId, recommendations]);

  return {
    recommendations: getFilteredRecommendations(),
    loading,
    filters,
    setFilters,
    generateRecommendations,
    dismissRecommendation,
    applyRecommendation,
  };
};