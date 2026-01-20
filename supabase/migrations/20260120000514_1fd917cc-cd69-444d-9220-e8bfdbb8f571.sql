-- Add payment tracking to prime_members table
ALTER TABLE public.prime_members
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_reference TEXT,
ADD COLUMN IF NOT EXISTS payment_provider TEXT,
ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'basic';

-- Create prime_payments table for payment history
CREATE TABLE IF NOT EXISTS public.prime_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prime_member_id UUID REFERENCES public.prime_members(id) ON DELETE SET NULL,
    user_id UUID NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'NGN',
    payment_provider TEXT NOT NULL,
    payment_reference TEXT,
    status TEXT DEFAULT 'pending',
    subscription_tier TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on prime_payments
ALTER TABLE public.prime_payments ENABLE ROW LEVEL SECURITY;

-- Users can view their own payment history
CREATE POLICY "Users can view their own payments"
ON public.prime_payments
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own payment records
CREATE POLICY "Users can create their own payments"
ON public.prime_payments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at on prime_payments
CREATE TRIGGER update_prime_payments_updated_at
BEFORE UPDATE ON public.prime_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();