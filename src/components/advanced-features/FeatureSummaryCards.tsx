
import React from "react";
import { Package, Microphone, WifiSlash } from "phosphor-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FeatureSummaryCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <WifiSlash className="h-5 w-5 mr-2 text-jara-orange" />
            Offline-First
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Plan your events anywhere in Nigeria regardless of internet connectivity. Perfect for areas with unstable networks or when traveling.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Package className="h-5 w-5 mr-2 text-jara-teal" />
            AR Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Make confident venue decisions without physical visits. Save time and money while ensuring the perfect space for your event.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Microphone className="h-5 w-5 mr-2 text-jara-purple" />
            Voice Control
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Manage your event planning hands-free with natural language commands. Perfect for multitasking or on-the-go planning.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureSummaryCards;
