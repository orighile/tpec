-- Fix security issues in orders table - prevent NULL user_id access
-- Update RLS policies for orders table to prevent unauthorized access

-- Drop existing policy and create more restrictive one
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;

-- Create more secure policies that require authentication
CREATE POLICY "Authenticated users can create orders with their user_id" 
ON orders 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can view their own orders only" 
ON orders 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can update their own orders only" 
ON orders 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Make user_id NOT NULL to prevent security gaps
ALTER TABLE orders ALTER COLUMN user_id SET NOT NULL;

-- Add validation trigger to ensure user_id is always set
CREATE OR REPLACE FUNCTION validate_order_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    RAISE EXCEPTION 'user_id cannot be null for orders';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_orders_user_id
  BEFORE INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION validate_order_user_id();