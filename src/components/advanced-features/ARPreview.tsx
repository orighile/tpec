
import React, { useState, useEffect } from "react";
import { Package, Stack } from "phosphor-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ARPreviewProps {
  arModelLoaded: boolean;
  arModelLoading: boolean;
  loadingProgress: number;
  loadArVenueModel: () => void;
}

const ARPreview: React.FC<ARPreviewProps> = ({ 
  arModelLoaded, 
  arModelLoading, 
  loadingProgress, 
  loadArVenueModel 
}) => {
  const [interactionActive, setInteractionActive] = useState(false);
  const [envMappingProgress, setEnvMappingProgress] = useState(0);
  const [mappingComplete, setMappingComplete] = useState(false);

  useEffect(() => {
    let interval: number | null = null;
    
    if (interactionActive && envMappingProgress < 100 && !mappingComplete) {
      interval = window.setInterval(() => {
        setEnvMappingProgress(prev => {
          const newProgress = prev + (Math.random() * 5 + 3);
          if (newProgress >= 100) {
            setMappingComplete(true);
            return 100;
          }
          return newProgress;
        });
      }, 300);
    }
    
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [interactionActive, envMappingProgress, mappingComplete]);

  const handleInteraction = () => {
    if (arModelLoaded) {
      setInteractionActive(!interactionActive);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Package className="h-6 w-6 mr-2 text-primary" />
            AR Venue Preview Technology
          </CardTitle>
          <CardDescription>
            Experience venue spaces in augmented reality before booking. Visualize your event setup in real-scale 3D.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="relative aspect-video rounded-lg overflow-hidden bg-foreground mb-6 cursor-pointer"
            onClick={handleInteraction}
          >
            {arModelLoaded ? (
              <div className="w-full h-full flex items-center justify-center text-white relative">
                {/* AR Venue Preview Image */}
                <img 
                  src={mappingComplete ? "/ar-venue-preview.jpg" : "/ar-scanning.jpg"} 
                  alt="AR Venue Preview" 
                  className="w-full h-full object-cover"
                />

                <div className={`absolute inset-0 flex items-center justify-center ${interactionActive ? 'bg-opacity-70 bg-foreground' : 'bg-opacity-40 bg-foreground'}`}>
                  <div className="text-center">
                    <Stack className="h-16 w-16 mx-auto mb-4 text-primary" />
                    <h3 className="text-xl font-bold">Imperial Hall, Lagos</h3>
                    <p className="text-background/80 mt-2">AR Preview Active</p>
                    <p className="text-background/60 mt-1">
                      {interactionActive && !mappingComplete ? 'Scanning environment...' : 'Click to interact with the preview'}
                    </p>
                    {(interactionActive || mappingComplete) && (
                      <div className="mt-4 max-w-sm mx-auto">
                        <Progress value={envMappingProgress} className="h-2 mb-2" />
                        <p className="text-sm text-background/60">
                          Environment mapping: {Math.round(envMappingProgress)}%
                          {envMappingProgress === 100 && ' - Complete!'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* AR Furniture Elements - Only shown when mapping is complete */}
                {mappingComplete && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute bottom-5 right-10 w-24 h-24 flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-foreground/70 px-2 py-1 rounded text-xs text-background whitespace-nowrap">
                          Interactive Table
                        </div>
                        <div className="w-16 h-16 border-2 border-primary rounded-md opacity-80"></div>
                      </div>
                    </div>
                    <div className="absolute top-1/3 left-1/4 w-32 h-16 flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-foreground/70 px-2 py-1 rounded text-xs text-background whitespace-nowrap">
                          Stage Area
                        </div>
                        <div className="w-32 h-16 border-2 border-secondary rounded-md opacity-80"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                {arModelLoading ? (
                  <div className="text-center w-3/4">
                    <p className="mb-2 font-medium">Loading AR Model...</p>
                    <Progress value={loadingProgress} className="h-2 mb-2" />
                    <p className="text-sm text-background/60">{Math.round(loadingProgress)}% - Preparing 3D environment</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p>Load AR model to preview venues in augmented reality</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-muted rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3">Key Features</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="text-primary mr-3">•</div>
                  <span>True-to-scale venue visualization</span>
                </li>
                <li className="flex items-center">
                  <div className="text-primary mr-3">•</div>
                  <span>Interactive furniture placement</span>
                </li>
                <li className="flex items-center">
                  <div className="text-primary mr-3">•</div>
                  <span>Lighting simulation at different times of day</span>
                </li>
                <li className="flex items-center">
                  <div className="text-primary mr-3">•</div>
                  <span>Capacity visualization with guest avatars</span>
                </li>
                <li className="flex items-center">
                  <div className="text-primary mr-3">•</div>
                  <span>Virtual walkthrough capability</span>
                </li>
            </ul>
            </div>
            <div className="bg-muted rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3">Supported Venues</h3>
              <p className="text-sm text-muted-foreground mb-4">These popular Nigerian venues have 3D models available:</p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="text-green-500 mr-3">✓</div>
                  <span>Imperial Hall, Lagos</span>
                </li>
                <li className="flex items-center">
                  <div className="text-green-500 mr-3">✓</div>
                  <span>Bon Villa Events, Abuja</span>
                </li>
                <li className="flex items-center">
                  <div className="text-green-500 mr-3">✓</div>
                  <span>RadissonBlu Hotel, Victoria Island</span>
                </li>
                <li className="flex items-center">
                  <div className="text-green-500 mr-3">✓</div>
                  <span>The Pavilion, Port Harcourt</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* AR Example Gallery */}
          {arModelLoaded && mappingComplete && (
            <div className="mt-6">
              <h3 className="font-bold text-lg mb-3">AR Examples</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" 
                    alt="AR Example 1" 
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" 
                    alt="AR Example 2" 
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                    alt="AR Example 3" 
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className={`w-full ${arModelLoaded ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'}`}
            onClick={loadArVenueModel}
            disabled={arModelLoading}
          >
            {arModelLoading ? 'Loading AR Model...' : (arModelLoaded ? 'Unload AR Model' : 'Load AR Venue Preview')}
          </Button>
        </CardFooter>
      </Card>
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-amber-800 dark:text-amber-400">
        <p className="font-medium">Device Requirements</p>
        <p className="text-sm mt-1">
          AR venue preview requires a device with ARCore (Android) or ARKit (iOS) support and an active camera.
          For the best experience, we recommend using a smartphone or tablet released after 2019.
        </p>
      </div>
    </div>
  );
};

export default ARPreview;
