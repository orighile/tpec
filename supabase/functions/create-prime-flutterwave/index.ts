import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { paymentId, amount, email, membershipType, tier, callbackUrl, customerName, customerPhone } = await req.json();

    if (!paymentId || !amount || !email || !membershipType || !tier) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const flutterwaveSecretKey = Deno.env.get("FLUTTERWAVE_SECRET_KEY");
    
    if (!flutterwaveSecretKey) {
      console.error("FLUTTERWAVE_SECRET_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Payment service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tx_ref = `prime_flw_${paymentId}`;

    // Initialize Flutterwave payment
    const flutterwaveResponse = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${flutterwaveSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref,
        amount,
        currency: "NGN",
        redirect_url: callbackUrl,
        customer: {
          email,
          name: customerName || email.split('@')[0],
          phonenumber: customerPhone || ""
        },
        customizations: {
          title: "TPEC Prime Subscription",
          description: `Prime ${membershipType} - ${tier} tier subscription`,
          logo: "https://xnunwgrtiffwqhechnwf.supabase.co/storage/v1/object/public/prime-uploads/logo.png"
        },
        meta: {
          payment_id: paymentId,
          membership_type: membershipType,
          tier: tier
        }
      }),
    });

    const flutterwaveData = await flutterwaveResponse.json();

    if (flutterwaveData.status !== "success") {
      console.error("Flutterwave error:", flutterwaveData);
      return new Response(
        JSON.stringify({ error: flutterwaveData.message || "Failed to initialize payment" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update payment record with reference
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    await supabase
      .from("prime_payments")
      .update({
        payment_reference: tx_ref,
        updated_at: new Date().toISOString()
      })
      .eq("id", paymentId);

    return new Response(
      JSON.stringify({
        authorization_url: flutterwaveData.data.link,
        tx_ref
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
