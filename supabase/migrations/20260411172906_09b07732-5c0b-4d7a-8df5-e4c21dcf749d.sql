
-- Fix #3: Prevent role escalation via profiles UPDATE
DROP POLICY IF EXISTS "Users can update their profile" ON public.profiles;
CREATE POLICY "Users can update their profile" ON public.profiles
  FOR UPDATE TO public
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid()));

-- Fix #4: Harden ticket_issues SELECT - remove null user_id bypass
DROP POLICY IF EXISTS "Users can view their ticket issues" ON public.ticket_issues;
CREATE POLICY "Users can view their ticket issues" ON public.ticket_issues
  FOR SELECT TO public
  USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = ticket_issues.order_id AND orders.user_id = auth.uid()
  ));

-- Fix #4: Harden order_items SELECT - remove null user_id bypass
DROP POLICY IF EXISTS "Users can view their order items" ON public.order_items;
CREATE POLICY "Users can view their order items" ON public.order_items
  FOR SELECT TO public
  USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  ));

-- Fix #8: Restrict gift_purchases INSERT to authenticated users
DROP POLICY IF EXISTS "Anyone can create gift purchases" ON public.gift_purchases;
CREATE POLICY "Authenticated users can create gift purchases" ON public.gift_purchases
  FOR INSERT TO authenticated
  WITH CHECK (true);
