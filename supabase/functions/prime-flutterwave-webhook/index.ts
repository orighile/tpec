import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, verif-hash",
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
    const secretHash = Deno.env.get("FLUTTERWAVE_SECRET_HASH");
    const signature = req.headers.get("verif-hash");

    // Verify webhook signature
    if (secretHash && signature !== secretHash) {
      console.error("Invalid webhook signature");
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payload = await req.json();
    console.log("Flutterwave webhook payload:", JSON.stringify(payload));

    // Only process successful charges
    if (payload.event !== "charge.completed" || payload.data?.status !== "successful") {
      console.log("Ignoring non-successful event:", payload.event, payload.data?.status);
      return new Response(
        JSON.stringify({ received: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { tx_ref, meta } = payload.data;
    const paymentId = meta?.payment_id || tx_ref?.replace('prime_flw_', '');
    const membershipType = meta?.membership_type;
    const tier = meta?.tier || 'basic';

    if (!paymentId) {
      console.error("Missing payment ID in webhook");
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
        payment_reference: tx_ref,
        updated_at: new Date().toISOString()
      })
      .eq("id", paymentId)
      .select()
      .single();

    if (paymentError) {
      console.error("Failed to update payment:", paymentError);
      throw paymentError;
    }

    // Calculate subscription dates
    const subscriptionDays = TIER_DURATIONS[tier] || 30;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + subscriptionDays);

    // Check for existing prime member
    const { data: existingMember } = await supabase
      .from("prime_members")
      .select("id")
      .eq("user_id", payment.user_id)
      .eq("membership_type", membershipType)
      .single();

    if (existingMember) {
      // Update existing member
      await supabase
        .from("prime_members")
        .update({
          payment_status: "active",
          payment_reference: tx_ref,
          payment_provider: "flutterwave",
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

    console.log("Payment processed successfully for:", paymentId);

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
