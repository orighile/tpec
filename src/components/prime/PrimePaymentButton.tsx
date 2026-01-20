import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, Crown, Check, CreditCard, Sparkles, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PrimeMembershipType } from '@/hooks/usePrimeMembership';
import { PaymentProvider, PAYMENT_PROVIDER_CONFIG, getRecommendedPaymentProvider, detectUserLocation } from '@/utils/regionDetection';

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  duration: string;
  features: string[];
  isPopular?: boolean;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 15000,
    currency: 'NGN',
    duration: '1 month',
    features: [
      'Business profile listing',
      'Up to 5 gallery images',
      'Contact information display',
      'Basic search visibility'
    ]
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 35000,
    currency: 'NGN',
    duration: '3 months',
    features: [
      'Everything in Basic',
      'Up to 15 gallery images',
      'Video showcase (50MB)',
      'Priority search ranking',
      'Featured badge'
    ],
    isPopular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 100000,
    currency: 'NGN',
    duration: '12 months',
    features: [
      'Everything in Standard',
      'Unlimited gallery images',
      'Homepage featured spot',
      'Dedicated support',
      'Analytics dashboard',
      'Social media promotion'
    ]
  }
];

interface PrimePaymentButtonProps {
  membershipType: PrimeMembershipType;
  onPaymentSuccess?: (tier: string) => void;
  children?: React.ReactNode;
}

export const PrimePaymentButton: React.FC<PrimePaymentButtonProps> = ({
  membershipType,
  onPaymentSuccess,
  children
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('paystack');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'tier' | 'provider'>('tier');
  const [recommendedProvider, setRecommendedProvider] = useState<PaymentProvider>('paystack');

  // Detect user location on mount
  React.useEffect(() => {
    const detectLocation = async () => {
      const location = await detectUserLocation();
      if (location) {
        const recommended = getRecommendedPaymentProvider(location.countryCode);
        setRecommendedProvider(recommended);
        setSelectedProvider(recommended);
      }
    };
    detectLocation();
  }, []);

  const formatPrice = (amount: number, provider?: PaymentProvider) => {
    // For Stripe, show approximate USD conversion
    if (provider === 'stripe') {
      const usdAmount = Math.ceil(amount / 1600);
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      }).format(usdAmount);
    }
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getEdgeFunctionName = (provider: PaymentProvider): string => {
    switch (provider) {
      case 'stripe':
        return 'create-prime-stripe';
      case 'flutterwave':
        return 'create-prime-flutterwave';
      case 'paystack':
      default:
        return 'create-prime-payment';
    }
  };

  const initiatePayment = async (tier: PricingTier, provider: PaymentProvider) => {
    if (!user?.email) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to subscribe to Prime.',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);
    setSelectedTier(tier);

    try {
      // Create payment record in database
      const { data: payment, error: paymentError } = await supabase
        .from('prime_payments')
        .insert({
          user_id: user.id,
          amount: tier.price,
          currency: tier.currency,
          payment_provider: provider,
          subscription_tier: tier.id,
          status: 'pending',
          metadata: {
            membership_type: membershipType,
            tier_name: tier.name,
            duration: tier.duration
          }
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      const callbackUrl = `${window.location.origin}/prime-${membershipType}s?payment=success&tier=${tier.id}`;
      const cancelUrl = `${window.location.origin}/prime-${membershipType}s?payment=cancelled`;

      // Call appropriate edge function based on provider
      const functionName = getEdgeFunctionName(provider);
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          paymentId: payment.id,
          amount: tier.price,
          email: user.email,
          membershipType,
          tier: tier.id,
          callbackUrl,
          cancelUrl,
          customerName: user.user_metadata?.full_name,
          customerPhone: user.user_metadata?.phone
        }
      });

      if (error) throw error;

      if (data?.authorization_url) {
        // Redirect to payment page
        window.location.href = data.authorization_url;
      } else {
        throw new Error('Failed to get payment URL');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment failed',
        description: error.message || 'Unable to initiate payment. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTierSelect = (tier: PricingTier) => {
    setSelectedTier(tier);
    setStep('provider');
  };

  const handleProviderSelect = (provider: PaymentProvider) => {
    setSelectedProvider(provider);
    if (selectedTier) {
      initiatePayment(selectedTier, provider);
    }
  };

  const handleBack = () => {
    setStep('tier');
  };

  const typeLabel = membershipType === 'vendor' ? 'Vendor' : 'Planner';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) setStep('tier'); }}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="premium" size="lg">
            <Crown className="mr-2 h-5 w-5" />
            Subscribe to Prime
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Crown className="h-6 w-6 text-primary" />
            Prime {typeLabel} Subscription
          </DialogTitle>
          <DialogDescription>
            {step === 'tier' 
              ? 'Choose a plan that works best for your business'
              : 'Select your preferred payment method'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'tier' ? (
          <>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              {PRICING_TIERS.map((tier) => (
                <Card
                  key={tier.id}
                  className={`relative cursor-pointer transition-all hover:shadow-lg ${
                    tier.isPopular ? 'border-primary ring-2 ring-primary/20' : ''
                  } ${selectedTier?.id === tier.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => handleTierSelect(tier)}
                >
                  {tier.isPopular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-lg">{tier.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">{formatPrice(tier.price)}</span>
                      <span className="text-muted-foreground text-sm ml-1">/ {tier.duration}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ul className="space-y-2">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full mt-4"
                      variant={tier.isPopular ? 'default' : 'outline'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTierSelect(tier);
                      }}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Select {tier.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>All prices are in Nigerian Naira (₦)</p>
            </div>
          </>
        ) : (
          <>
            <div className="mt-6 space-y-4">
              <Button variant="ghost" onClick={handleBack} className="mb-2">
                ← Back to plans
              </Button>

              <Card className="p-4 bg-muted/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{selectedTier?.name} Plan</p>
                    <p className="text-sm text-muted-foreground">{selectedTier?.duration}</p>
                  </div>
                  <p className="text-xl font-bold">{selectedTier && formatPrice(selectedTier.price)}</p>
                </div>
              </Card>

              <div className="space-y-3">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Choose Payment Method
                </Label>
                
                <RadioGroup 
                  value={selectedProvider} 
                  onValueChange={(value) => setSelectedProvider(value as PaymentProvider)}
                  className="grid gap-3"
                >
                  {(Object.keys(PAYMENT_PROVIDER_CONFIG) as PaymentProvider[]).map((provider) => {
                    const config = PAYMENT_PROVIDER_CONFIG[provider];
                    const isRecommended = provider === recommendedProvider;
                    
                    return (
                      <div key={provider} className="relative">
                        <RadioGroupItem
                          value={provider}
                          id={provider}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={provider}
                          className={`flex items-center justify-between rounded-lg border-2 p-4 cursor-pointer transition-all
                            peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5
                            hover:bg-muted/50 ${isRecommended ? 'border-primary/50' : 'border-muted'}
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{config.logo}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{config.name}</p>
                                {isRecommended && (
                                  <Badge variant="secondary" className="text-xs">Recommended</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{config.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {config.supportedRegions.join(' • ')}
                              </p>
                            </div>
                          </div>
                          {provider === 'stripe' && selectedTier && (
                            <p className="text-sm font-medium text-muted-foreground">
                              ~{formatPrice(selectedTier.price, 'stripe')}
                            </p>
                          )}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>

              <Button
                className="w-full mt-6"
                size="lg"
                onClick={() => selectedTier && handleProviderSelect(selectedProvider)}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay with {PAYMENT_PROVIDER_CONFIG[selectedProvider].name}
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Secure payment powered by {PAYMENT_PROVIDER_CONFIG[selectedProvider].name}
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PrimePaymentButton;
