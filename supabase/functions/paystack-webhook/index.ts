// Supabase Edge Function: Paystack Webhook
// Validates signature and marks orders as paid/failed.
// Env required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, PAYSTACK_SECRET_KEY
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { getServiceClient } from "../_shared/supabaseClient.ts";

async function verifyPaystackSignature(rawBody: string, signature: string, secret: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: { name: "SHA-512" } },
    false,
    ["sign", "verify"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(rawBody));
  // convert ArrayBuffer to hex string
  const hex = Array.from(new Uint8Array(mac)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex === signature;
}

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const secret = Deno.env.get("PAYSTACK_SECRET_KEY");
  if (!secret) {
    return new Response("Missing PAYSTACK_SECRET_KEY", { status: 500 });
  }

  const signature = req.headers.get("x-paystack-signature") ?? "";
  const rawBody = await req.text();

  const valid = await verifyPaystackSignature(rawBody, signature, secret);
  if (!valid) {
    return new Response("Invalid signature", { status: 400 });
  }

  const payload = JSON.parse(rawBody);
  // Typical structure: event, data.reference, data.status, data.amount, data.metadata
  const event = payload?.event as string | undefined;
  const data = payload?.data ?? {};
  const reference: string | undefined = data.reference;
  const status: string | undefined = data.status; // 'success', 'failed'
  const order_id: string | undefined = data?.metadata?.order_id;

  if (!order_id || !reference) {
    return new Response("Missing order_id or reference in metadata", { status: 400 });
  }

  const supabase = getServiceClient();

  // Idempotency: if already paid/failed, do nothing
  const { data: existing, error: fetchErr } = await supabase
    .from("orders")
    .select("id, status, provider_ref")
    .eq("id", order_id)
    .single();
  if (fetchErr) return new Response(`Fetch error: ${fetchErr.message}`, { status: 500 });
  if (!existing) return new Response("Order not found", { status: 404 });

  if (existing.status === "paid" || existing.status === "failed") {
    return new Response("Already processed", { status: 200 });
  }

  let newStatus = existing.status;
  if (event === "charge.success" || status === "success") {
    newStatus = "paid";
  } else if (status === "failed") {
    newStatus = "failed";
  } else {
    // ignore other events
    return new Response("Event ignored", { status: 200 });
  }

  const { error: updErr } = await supabase
    .from("orders")
    .update({
      status: newStatus,
      provider: "paystack",
      provider_ref: reference,
      paid_at: newStatus === "paid" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", order_id);

  if (updErr) return new Response(`Update error: ${updErr.message}`, { status: 500 });

  // Triggers in DB may create ticket issues on paid orders
  return new Response("ok", { status: 200 });
});
