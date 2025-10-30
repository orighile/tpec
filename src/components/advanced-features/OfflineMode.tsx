
import React from "react";
import { WifiHigh, WifiSlash } from "phosphor-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface OfflineModeProps {
  offlineMode: boolean;
  toggleOfflineMode: () => void;
}

const OfflineMode: React.FC<OfflineModeProps> = ({ offlineMode, toggleOfflineMode }) => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            {offlineMode ? <WifiSlash className="h-6 w-6 mr-2 text-jara-orange" /> : <WifiHigh className="h-6 w-6 mr-2 text-jara-green" />}
            Offline-First Technology
          </CardTitle>
          <CardDescription>
            Continue planning your events even without internet connectivity. All changes sync automatically when you're back online.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-gray-100 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4">How It Works</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <div className="bg-jara-green text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">1</div>
                  <span>All your event data is cached locally on your device</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-jara-green text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">2</div>
                  <span>Edit, update, and create events without an internet connection</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-jara-green text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">3</div>
                  <span>All changes automatically sync when connectivity is restored</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-jara-green text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">4</div>
                  <span>Conflict resolution ensures no data is lost between devices</span>
                </li>
              </ul>
            </div>
            <div className="flex-1 bg-gray-100 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4">Benefits</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <div className="text-jara-green mr-3">✓</div>
                  <span>Plan events from anywhere, even in areas with poor connectivity</span>
                </li>
                <li className="flex items-center">
                  <div className="text-jara-green mr-3">✓</div>
                  <span>Never lose your work due to connection drops</span>
                </li>
                <li className="flex items-center">
                  <div className="text-jara-green mr-3">✓</div>
                  <span>Reduced data usage with smart syncing</span>
                </li>
                <li className="flex items-center">
                  <div className="text-jara-green mr-3">✓</div>
                  <span>Faster app performance with local data access</span>
                </li>
                <li className="flex items-center">
                  <div className="text-jara-green mr-3">✓</div>
                  <span>Perfect for unreliable network conditions across Nigeria</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className={`w-full ${offlineMode ? 'bg-jara-orange hover:bg-jara-orange/90' : 'bg-jara-green hover:bg-jara-green/90'}`} 
            onClick={toggleOfflineMode}
          >
            {offlineMode ? 'Switch to Online Mode' : 'Enable Offline Mode'}
          </Button>
        </CardFooter>
      </Card>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
        <p className="font-medium">Current status: {offlineMode ? 'Offline Mode' : 'Online Mode'} active</p>
        <p className="text-sm mt-1">
          {offlineMode 
            ? 'All changes are being saved locally and will sync when you reconnect.' 
            : 'Connected to the server. All changes are being saved in real-time.'}
        </p>
      </div>
    </div>
  );
};

export default OfflineMode;
