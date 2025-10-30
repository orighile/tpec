import { useState, useEffect } from 'react';
import { detectUserLocation, getRecommendedPaymentProvider, type PaymentProvider, type UserLocation } from '@/utils/regionDetection';

interface UsePaymentProviderReturn {
  recommendedProvider: PaymentProvider;
  selectedProvider: PaymentProvider;
  setSelectedProvider: (provider: PaymentProvider) => void;
  userLocation: UserLocation | null;
  isDetecting: boolean;
  supportedProviders: PaymentProvider[];
}

export function usePaymentProvider(): UsePaymentProviderReturn {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [recommendedProvider, setRecommendedProvider] = useState<PaymentProvider>('stripe');
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('stripe');
  const [isDetecting, setIsDetecting] = useState(true);

  // All available providers
  const supportedProviders: PaymentProvider[] = ['stripe', 'paystack'];

  useEffect(() => {
    const detectLocation = async () => {
      try {
        setIsDetecting(true);
        const location = await detectUserLocation();
        setUserLocation(location);
        
        const recommended = getRecommendedPaymentProvider(location?.countryCode);
        setRecommendedProvider(recommended);
        setSelectedProvider(recommended);
      } catch (error) {
        console.error('Failed to detect location:', error);
        // Fallback to Stripe
        setRecommendedProvider('stripe');
        setSelectedProvider('stripe');
      } finally {
        setIsDetecting(false);
      }
    };

    detectLocation();
  }, []);

  return {
    recommendedProvider,
    selectedProvider,
    setSelectedProvider,
    userLocation,
    isDetecting,
    supportedProviders
  };
}