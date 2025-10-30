import React from "react";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, CheckCircle, X, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AIRecommendationEngine = ({ eventId, eventData }: { eventId?: string; eventData?: any }) => {
  const { toast } = useToast();
  const {
    recommendations,
    loading,
    generateRecommendations,
    dismissRecommendation,
    applyRecommendation,
  } = useAIRecommendations(eventId);

  const handleGenerateRecommendations = () => {
    const sampleEventData = {
      budget: 150000,
      guestCount: 100,
      eventType: "wedding",
      location: "Lagos",
      season: "dry"
    };
    generateRecommendations(eventData || sampleEventData);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "bg-green-500";
    if (confidence >= 75) return "bg-blue-500";
    if (confidence >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "budget": return "💰";
      case "venue": return "🏢";
      case "catering": return "🍽️";
      case "entertainment": return "🎵";
      case "timing": return "⏰";
      default: return "💡";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Recommendations
            </CardTitle>
            <Button onClick={handleGenerateRecommendations} disabled={loading}>
              <Lightbulb className="h-4 w-4 mr-2" />
              {loading ? "Generating..." : "Generate Recommendations"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <Card key={rec.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{getCategoryIcon(rec.category)}</span>
                          <h3 className="font-medium">{rec.title}</h3>
                          <Badge variant="outline" className="capitalize">
                            {rec.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {rec.description}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          <strong>Reasoning:</strong> {rec.reasoning}
                        </div>
                        <div className="flex items-center mt-3 gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-xs">
                              {rec.confidence}% confidence
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {rec.createdAt.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => applyRecommendation(rec.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Apply
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => dismissRecommendation(rec.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No recommendations yet</h3>
              <p className="text-muted-foreground mb-4">
                Generate AI-powered recommendations based on your event details
              </p>
              <Button onClick={handleGenerateRecommendations} disabled={loading}>
                <Lightbulb className="h-4 w-4 mr-2" />
                {loading ? "Generating..." : "Get Recommendations"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIRecommendationEngine;