import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, MapPin } from 'lucide-react';
import { PAYMENT_PROVIDER_CONFIG, type PaymentProvider } from '@/utils/regionDetection';
import { usePaymentProvider } from '@/hooks/usePaymentProvider';

interface PaymentProviderSelectorProps {
  onProviderSelect?: (provider: PaymentProvider) => void;
  disabled?: boolean;
}

const PaymentProviderSelector: React.FC<PaymentProviderSelectorProps> = ({ 
  onProviderSelect, 
  disabled = false 
}) => {
  const { 
    recommendedProvider, 
    selectedProvider, 
    setSelectedProvider, 
    userLocation, 
    isDetecting,
    supportedProviders 
  } = usePaymentProvider();

  const handleProviderSelect = (provider: PaymentProvider) => {
    if (disabled) return;
    setSelectedProvider(provider);
    onProviderSelect?.(provider);
  };

  if (isDetecting) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 animate-pulse" />
            Detecting your location...
          </CardTitle>
          <CardDescription>
            We're finding the best payment option for your region
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {userLocation && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>Detected location: {userLocation.country}</span>
        </div>
      )}

      <div className="grid gap-3">
        {supportedProviders.map((provider) => {
          const config = PAYMENT_PROVIDER_CONFIG[provider];
          const isRecommended = provider === recommendedProvider;
          const isSelected = provider === selectedProvider;

          return (
            <Card
              key={provider}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected 
                  ? 'ring-2 ring-primary border-primary' 
                  : 'hover:border-primary/50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => handleProviderSelect(provider)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{config.logo}</span>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {config.name}
                        {isRecommended && (
                          <Badge variant="secondary" className="text-xs">
                            Recommended
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {config.description}
                      </CardDescription>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  Supported regions: {config.supportedRegions.join(', ')}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedProvider && (
        <div className="text-center">
          <Button 
            onClick={() => onProviderSelect?.(selectedProvider)}
            disabled={disabled}
            className="w-full"
          >
            Continue with {PAYMENT_PROVIDER_CONFIG[selectedProvider].name}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentProviderSelector;