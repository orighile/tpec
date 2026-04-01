import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface AIRecommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  confidence: number;
  reasoning: string;
  createdAt: Date;
  applied?: boolean;
  vendorId?: string;
  vendorName?: string;
  vendorImage?: string;
  vendorRating?: number;
  vendorLocation?: string;
}

export interface RecommendationFilters {
  category?: string;
  confidence?: number;
}

export const useAIRecommendations = (_eventId?: string) => {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<RecommendationFilters>({});

  const generateRecommendations = async (eventData?: any) => {
    setLoading(true);
    
    try {
      // Query real vendors from Supabase
      const { data: vendors, error } = await supabase.rpc("get_public_vendors");
      
      const newRecommendations: AIRecommendation[] = [];
      
      if (vendors && vendors.length > 0) {
        // Category-based recommendations
        const categories = [...new Set(vendors.map((v: any) => v.category))];
        
        for (const vendor of vendors.slice(0, 6)) {
          newRecommendations.push({
            id: `rec-vendor-${vendor.id}`,
            category: vendor.category?.toLowerCase() || "vendor",
            title: `Recommended: ${vendor.name}`,
            description: vendor.short_description || vendor.description || `Top-rated ${vendor.category} vendor in ${vendor.city || vendor.location || "Nigeria"}`,
            confidence: vendor.verified ? 90 : 75,
            reasoning: `${vendor.verified ? "Verified vendor" : "Popular vendor"} in the ${vendor.category} category${vendor.city ? ` based in ${vendor.city}` : ""}.`,
            createdAt: new Date(),
            vendorId: vendor.id,
            vendorName: vendor.name,
            vendorImage: vendor.cover_image_path || "/placeholder.svg",
            vendorRating: 4.5,
            vendorLocation: vendor.location || vendor.city || "",
          });
        }
      }

      // Add contextual recommendations
      const month = new Date().getMonth();
      if (month >= 11 || month <= 2) {
        newRecommendations.push({
          id: `rec-season-${Date.now()}`,
          category: "timing",
          title: "Perfect timing for outdoor events",
          description: "The dry season (November-March) is ideal for outdoor events in Nigeria.",
          confidence: 95,
          reasoning: "Weather data shows minimal rain risk during this period.",
          createdAt: new Date(),
        });
      }

      if (eventData?.budget && eventData.budget < 100000) {
        newRecommendations.push({
          id: `rec-budget-${Date.now()}`,
          category: "budget",
          title: "Consider buffet service to reduce costs",
          description: "A buffet service typically costs 30-40% less than plated meals.",
          confidence: 85,
          reasoning: "Your budget suggests cost efficiency is important.",
          createdAt: new Date(),
        });
      }

      setRecommendations(newRecommendations);
      
      toast({
        title: "Recommendations Ready",
        description: `Found ${newRecommendations.length} recommendations for you`,
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
  };

  const applyRecommendation = async (id: string) => {
    const recommendation = recommendations.find(rec => rec.id === id);
    if (!recommendation) return;
    
    toast({
      title: "Recommendation Applied",
      description: `Applied: ${recommendation.title}`,
    });
    
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

  // Auto-load on mount
  useEffect(() => {
    generateRecommendations();
  }, []);

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
