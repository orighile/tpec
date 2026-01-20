import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Crown, Check, CreditCard, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PrimeMembershipType } from '@/hooks/usePrimeMembership';

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
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const initiatePayment = async (tier: PricingTier) => {
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
          payment_provider: 'paystack',
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

      // Call edge function to initialize Paystack payment
      const { data, error } = await supabase.functions.invoke('create-prime-payment', {
        body: {
          paymentId: payment.id,
          amount: tier.price,
          email: user.email,
          membershipType,
          tier: tier.id,
          callbackUrl: `${window.location.origin}/prime-${membershipType}s?payment=success&tier=${tier.id}`
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

  const typeLabel = membershipType === 'vendor' ? 'Vendor' : 'Planner';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            Choose a plan that works best for your business
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {PRICING_TIERS.map((tier) => (
            <Card
              key={tier.id}
              className={`relative cursor-pointer transition-all hover:shadow-lg ${
                tier.isPopular ? 'border-primary ring-2 ring-primary/20' : ''
              } ${selectedTier?.id === tier.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setSelectedTier(tier)}
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
                    initiatePayment(tier);
                  }}
                  disabled={isProcessing}
                >
                  {isProcessing && selectedTier?.id === tier.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Select {tier.name}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Secure payments powered by Paystack</p>
          <p className="mt-1">All prices are in Nigerian Naira (₦)</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrimePaymentButton;
