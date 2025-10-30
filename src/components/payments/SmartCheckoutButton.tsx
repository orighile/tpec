import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import PaymentProviderSelector from './PaymentProviderSelector';
import CheckoutButton from './CheckoutButton';
import { usePaymentProvider } from '@/hooks/usePaymentProvider';
import { type PaymentProvider } from '@/utils/regionDetection';

interface SmartCheckoutButtonProps {
  eventId: string;
  ticketItems: {
    ticketId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  children?: React.ReactNode;
}

const SmartCheckoutButton: React.FC<SmartCheckoutButtonProps> = ({
  eventId,
  ticketItems,
  totalAmount,
  children
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider | null>(null);
  const { recommendedProvider, isDetecting } = usePaymentProvider();
  const { toast } = useToast();

  const handleProviderSelect = (provider: PaymentProvider) => {
    setSelectedProvider(provider);
  };

  const handleProceedToPayment = () => {
    if (!selectedProvider) {
      toast({
        title: "Please select a payment method",
        description: "Choose your preferred payment provider to continue.",
        variant: "destructive",
      });
      return;
    }
    setIsDialogOpen(false);
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          {children || (
            <Button size="lg" className="w-full">
              Buy Tickets - ₦{totalAmount.toLocaleString()}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Payment Method</DialogTitle>
            <DialogDescription>
              Select your preferred payment provider. We've recommended the best option for your region.
            </DialogDescription>
          </DialogHeader>
          
          <PaymentProviderSelector 
            onProviderSelect={handleProviderSelect}
            disabled={isDetecting}
          />
        </DialogContent>
      </Dialog>

      {/* Render the actual checkout button when provider is selected */}
      {selectedProvider && (
        <CheckoutButton
          eventId={eventId}
          ticketItems={ticketItems}
          totalAmount={totalAmount}
          provider={selectedProvider}
        />
      )}
    </>
  );
};

export default SmartCheckoutButton;