
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { initPaystack } from "@/lib/payments/paystack";
import { initFlutterwave } from "@/lib/payments/flutterwave";
import { type PaymentProvider } from "@/utils/regionDetection";

interface CheckoutButtonProps {
  eventId: string;
  ticketItems: {
    ticketId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  provider?: PaymentProvider;
}

const CheckoutButton = ({ 
  eventId, 
  ticketItems, 
  totalAmount, 
  provider = "paystack" 
}: CheckoutButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to purchase tickets.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          event_id: eventId,
          amount: totalAmount,
          currency: 'NGN',
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = ticketItems.map(item => ({
        order_id: order.id,
        ticket_id: item.ticketId,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Initialize payment based on provider
      if (provider === "stripe") {
        // Call Stripe payment edge function
        const { data: stripeData, error: stripeError } = await supabase.functions.invoke(
          'create-stripe-payment',
          {
            body: {
              orderId: order.id,
              amount: totalAmount,
              currency: 'usd',
              successUrl: `${window.location.origin}/payment-success?order=${order.id}`,
              cancelUrl: `${window.location.origin}/payment-cancel?order=${order.id}`
            }
          }
        );

        if (stripeError) throw stripeError;
        
        // Open Stripe checkout in new tab
        if (stripeData?.url) {
          window.open(stripeData.url, '_blank');
        }
        
      } else if (provider === "paystack") {
        // Initialize Paystack payment
        const paymentData = {
          publicKey: "pk_test_example", // Should come from environment
          email: user.email || '',
          amountKobo: totalAmount * 100, // Paystack uses kobo
          reference: order.id,
          metadata: { order_id: order.id },
          onSuccess: (ref: string) => {
            toast({
              title: "Payment successful!",
              description: "Your tickets have been purchased successfully.",
            });
            window.location.href = `/payment-success?order=${order.id}`;
          },
          onCancel: () => {
            toast({
              title: "Payment cancelled",
              description: "Your payment was cancelled. You can retry anytime.",
              variant: "destructive",
            });
          },
        };
        
        await initPaystack(paymentData);
        
      } else if (provider === "flutterwave") {
        // Initialize Flutterwave payment
        const paymentData = {
          publicKey: "FLWPUBK-example", // Should come from environment
          email: user.email || '',
          amount: totalAmount,
          tx_ref: order.id,
          name: user.user_metadata?.full_name || 'Customer',
          meta: { order_id: order.id },
          onSuccess: (ref: string) => {
            toast({
              title: "Payment successful!",
              description: "Your tickets have been purchased successfully.",
            });
            window.location.href = `/payment-success?order=${order.id}`;
          },
          onCancel: () => {
            toast({
              title: "Payment cancelled",
              description: "Your payment was cancelled. You can retry anytime.",
              variant: "destructive",
            });
          },
        };
        
        await initFlutterwave(paymentData);
      }

      toast({
        title: "Redirecting to payment",
        description: "Please complete your payment to secure your tickets.",
      });

    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button 
      onClick={handleCheckout}
      disabled={isProcessing}
      className="w-full"
    >
      {isProcessing ? "Processing..." : `Pay ₦${totalAmount.toLocaleString()}`}
    </Button>
  );
};

export default CheckoutButton;
