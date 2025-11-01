import { MessageCircle, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import JaraBot from "@/components/JaraBot";

const JaraBotPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Ask JaraBot
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your smart Nigerian event assistant. Get instant help with planning, vendor recommendations, and event advice — all in a friendly, conversational way!
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Smart Conversations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Chat naturally with JaraBot in English or Pidgin. Get helpful suggestions tailored to your event needs.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Vendor Matching
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                JaraBot knows all our verified vendors and can recommend the perfect match based on your location and budget.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Cultural Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get advice on Nigerian traditions, typical event costs, and culturally appropriate planning tips.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Component */}
        <JaraBot />
      </div>
    </div>
  );
};

export default JaraBotPage;
