import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const TIER_DURATIONS: Record<string, number> = {
  basic: 30,
  standard: 90,
  premium: 365
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Stripe not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event: Stripe.Event;

    // Verify webhook signature if secret is configured
    if (stripeWebhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);
      } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return new Response(
          JSON.stringify({ error: "Invalid signature" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      event = JSON.parse(body);
    }

    console.log("Stripe webhook event:", event.type);

    // Only process completed checkout sessions
    if (event.type !== "checkout.session.completed") {
      return new Response(
        JSON.stringify({ received: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const { payment_id, membership_type, tier } = session.metadata || {};

    if (!payment_id) {
      console.error("Missing payment_id in session metadata");
      return new Response(
        JSON.stringify({ error: "Missing payment ID" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update payment status
    const { data: payment, error: paymentError } = await supabase
      .from("prime_payments")
      .update({
        status: "completed",
        payment_reference: session.id,
        updated_at: new Date().toISOString()
      })
      .eq("id", payment_id)
      .select()
      .single();

    if (paymentError) {
      console.error("Failed to update payment:", paymentError);
      throw paymentError;
    }

    // Calculate subscription dates
    const subscriptionTier = tier || 'basic';
    const subscriptionDays = TIER_DURATIONS[subscriptionTier] || 30;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + subscriptionDays);

    // Check for existing prime member
    const { data: existingMember } = await supabase
      .from("prime_members")
      .select("id")
      .eq("user_id", payment.user_id)
      .eq("membership_type", membership_type)
      .single();

    if (existingMember) {
      // Update existing member
      await supabase
        .from("prime_members")
        .update({
          payment_status: "active",
          payment_reference: session.id,
          payment_provider: "stripe",
          subscription_tier: subscriptionTier,
          subscription_start_date: startDate.toISOString(),
          subscription_end_date: endDate.toISOString(),
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq("id", existingMember.id);

      // Link payment to member
      await supabase
        .from("prime_payments")
        .update({ prime_member_id: existingMember.id })
        .eq("id", payment_id);
    }

    console.log("Stripe payment processed successfully for:", payment_id);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
