
import React from "react";
import { Microphone, MicrophoneSlash } from "phosphor-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface VoiceCommandsProps {
  isListening: boolean;
  voiceCommand: string;
  voiceResults: string[];
  toggleVoiceRecognition: () => void;
}

const VoiceCommands: React.FC<VoiceCommandsProps> = ({ 
  isListening, 
  voiceCommand, 
  voiceResults, 
  toggleVoiceRecognition 
}) => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            {isListening ? <Microphone className="h-6 w-6 mr-2 text-red-500 animate-pulse" /> : <Microphone className="h-6 w-6 mr-2 text-gray-500" />}
            Voice Search & Commands
          </CardTitle>
          <CardDescription>
            Control your event planning experience with natural voice commands. Search, schedule, and manage your event hands-free.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Voice Command Center</h3>
              <Button 
                variant={isListening ? "destructive" : "default"}
                className={isListening ? "bg-red-500" : ""}
                onClick={toggleVoiceRecognition}
              >
                {isListening ? (
                  <span className="flex items-center">
                    <MicrophoneSlash className="h-4 w-4 mr-2" /> Stop Listening
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Microphone className="h-4 w-4 mr-2" /> Start Listening
                  </span>
                )}
              </Button>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4 min-h-[100px] flex items-center justify-center">
              {isListening ? (
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="bg-red-100 rounded-full p-3">
                      <Microphone className="h-6 w-6 text-red-500" />
                    </div>
                  </div>
                  <p className="text-gray-600 animate-pulse">Listening...</p>
                  {voiceCommand && (
                    <p className="font-medium text-lg mt-2">"{voiceCommand}"</p>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <Microphone className="h-6 w-6 mx-auto mb-2 opacity-50" />
                  <p>Click "Start Listening" and speak your command</p>
                </div>
              )}
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Example Commands:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-200 rounded-lg px-3 py-2">"Find venues in Lagos"</div>
                <div className="bg-gray-200 rounded-lg px-3 py-2">"Set budget for catering to ₦250,000"</div>
                <div className="bg-gray-200 rounded-lg px-3 py-2">"Add task to contact DJ by Friday"</div>
                <div className="bg-gray-200 rounded-lg px-3 py-2">"Show me traditional wedding venues"</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-3">Recent Commands</h3>
            {voiceResults.length > 0 ? (
              <div className="space-y-3">
                {voiceResults.map((result, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 flex items-start">
                    <Microphone className="h-4 w-4 text-gray-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium">"{result}"</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {index === 0 ? "Just now" : `${index + 1} ${index === 0 ? "minute" : "minutes"} ago`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No recent commands</p>
                <p className="text-sm mt-1">Try speaking a command to see it here</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-800 text-sm w-full">
            <p className="font-medium">Voice Technology Powered by Chief AI</p>
            <p className="mt-1">
              Our voice recognition system is specifically trained on Nigerian accents and local terminology for accurate results.
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VoiceCommands;
