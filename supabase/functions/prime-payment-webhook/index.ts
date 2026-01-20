import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-paystack-signature",
};

// Duration mapping for subscription tiers
const TIER_DURATIONS: Record<string, number> = {
  basic: 30, // 1 month
  standard: 90, // 3 months
  premium: 365, // 12 months
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get("x-paystack-signature");
    const body = await req.text();
    
    // In production, verify the signature using HMAC
    const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecret) {
      console.error("PAYSTACK_SECRET_KEY not configured");
      return new Response("Configuration error", { status: 500 });
    }

    // Parse webhook payload
    const payload = JSON.parse(body);
    console.log("Webhook event:", payload.event);

    if (payload.event !== "charge.success") {
      return new Response("Event not handled", { status: 200 });
    }

    const { reference, metadata } = payload.data;
    const paymentId = metadata?.payment_id;
    const membershipType = metadata?.membership_type;
    const tier = metadata?.tier;

    if (!paymentId) {
      console.error("Missing payment_id in metadata");
      return new Response("Missing payment_id", { status: 400 });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update payment status
    const { data: payment, error: paymentError } = await supabase
      .from("prime_payments")
      .update({
        status: "completed",
        payment_reference: reference,
        updated_at: new Date().toISOString()
      })
      .eq("id", paymentId)
      .select()
      .single();

    if (paymentError) {
      console.error("Error updating payment:", paymentError);
      return new Response("Database error", { status: 500 });
    }

    // Calculate subscription dates
    const durationDays = TIER_DURATIONS[tier] || 30;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);

    // Update or create prime member with payment status
    const { data: existingMember } = await supabase
      .from("prime_members")
      .select("id")
      .eq("user_id", payment.user_id)
      .eq("membership_type", membershipType)
      .maybeSingle();

    if (existingMember) {
      // Update existing member
      await supabase
        .from("prime_members")
        .update({
          payment_status: "paid",
          payment_reference: reference,
          payment_provider: "paystack",
          subscription_tier: tier,
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
        .eq("id", paymentId);
    }

    console.log("Payment processed successfully:", paymentId);
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Internal error", { status: 500 });
  }
});
