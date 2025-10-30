import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Shield, CheckCircle } from 'lucide-react';

interface PaymentData {
  amount: number;
  currency: string;
  email: string;
  phone: string;
  name: string;
}

interface PaymentIntegrationProps {
  onPaymentSuccess?: (data: any) => void;
  onPaymentError?: (error: any) => void;
  amount: number;
  description: string;
  vendorId?: string;
  eventId?: string;
}

const PaymentIntegration: React.FC<PaymentIntegrationProps> = ({
  onPaymentSuccess,
  onPaymentError,
  amount,
  description,
  vendorId,
  eventId
}) => {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    amount: amount,
    currency: 'NGN',
    email: '',
    phone: '',
    name: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const validatePaymentData = () => {
    if (!paymentData.email || !paymentData.phone || !paymentData.name) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(paymentData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleFlutterwavePayment = async () => {
    if (!validatePaymentData()) return;

    setIsProcessing(true);
    
    try {
      // Simulate Flutterwave payment initialization
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentData.amount,
          currency: paymentData.currency,
          email: paymentData.email,
          phone_number: paymentData.phone,
          name: paymentData.name,
          redirect_url: window.location.origin + '/payment/callback',
          payment_method: paymentMethod,
          vendor_id: vendorId,
          event_id: eventId,
          description: description
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        // Redirect to Flutterwave payment page
        window.location.href = data.data.link;
        
        toast({
          title: "Payment Initiated",
          description: "Redirecting to secure payment page...",
        });
        
        onPaymentSuccess?.(data);
      } else {
        throw new Error(data.message || 'Payment initialization failed');
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initialize payment",
        variant: "destructive"
      });
      onPaymentError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Secure Payment
        </CardTitle>
        <CardDescription>
          {description} - {formatCurrency(amount)}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Enter your full name"
            value={paymentData.name}
            onChange={(e) => setPaymentData({...paymentData, name: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={paymentData.email}
            onChange={(e) => setPaymentData({...paymentData, email: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            placeholder="+234 800 000 0000"
            value={paymentData.phone}
            onChange={(e) => setPaymentData({...paymentData, phone: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="payment-method">Payment Method</Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="card">Debit/Credit Card</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="ussd">USSD</SelectItem>
              <SelectItem value="mobile_money">Mobile Money</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Amount</Label>
          <div className="text-2xl font-bold text-primary">
            {formatCurrency(paymentData.amount)}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          Secured by Flutterwave
        </div>
        
        <Button 
          onClick={handleFlutterwavePayment}
          disabled={isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            "Processing Payment..."
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay {formatCurrency(paymentData.amount)}
            </>
          )}
        </Button>
        
        <div className="text-xs text-center text-muted-foreground">
          By proceeding, you agree to our terms of service and privacy policy
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentIntegration;
