import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Sparkles, X, ExternalLink, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";
import JaraBot from "@/components/jarabot";

const AIRecommendationsPage = () => {
  const { recommendations, loading, generateRecommendations, dismissRecommendation } = useAIRecommendations();

  return (
    <>
      <main className="flex-1 py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">AI Recommendations</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Smart vendor recommendations based on your event needs and preferences
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <Button 
              onClick={() => generateRecommendations()} 
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Finding recommendations..." : "Refresh Recommendations"}
            </Button>
          </div>

          {loading && recommendations.length === 0 ? (
            <div className="text-center py-20">
              <Sparkles className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
              <p className="text-muted-foreground">Analyzing vendors for you...</p>
            </div>
          ) : recommendations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No recommendations yet</h3>
                <p className="text-muted-foreground mb-4">
                  Click "Refresh Recommendations" to get vendor suggestions
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((rec) => (
                <Card key={rec.id} className={`relative ${rec.applied ? "opacity-60" : ""}`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => dismissRecommendation(rec.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs capitalize">{rec.category}</Badge>
                      <Badge variant="outline" className="text-xs">{rec.confidence}% match</Badge>
                      {rec.applied && <Badge className="bg-green-600 text-xs">Applied</Badge>}
                    </div>
                    <CardTitle className="text-lg">{rec.title}</CardTitle>
                    <CardDescription>{rec.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {rec.vendorId && (
                      <div className="flex items-center gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
                        <img
                          src={rec.vendorImage || "/placeholder.svg"}
                          alt={rec.vendorName || ""}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{rec.vendorName}</p>
                          {rec.vendorLocation && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{rec.vendorLocation}</span>
                            </div>
                          )}
                          {rec.vendorRating && (
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="h-3 w-3 fill-secondary text-secondary" />
                              <span>{rec.vendorRating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mb-4">{rec.reasoning}</p>
                    <div className="flex gap-2">
                      {rec.vendorId && (
                        <Button size="sm" asChild>
                          <Link to={`/vendors/${rec.vendorId}`} className="gap-1">
                            <ExternalLink className="h-3 w-3" />
                            View Vendor
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <JaraBot />
    </>
  );
};

export default AIRecommendationsPage;
