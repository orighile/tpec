// Supabase Edge Function: Flutterwave Webhook
// Validates 'verif-hash' header and marks orders as paid/failed.
// Env required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, WEBHOOK_SIGNING_SECRET_FLUTTERWAVE
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { getServiceClient } from "../_shared/supabaseClient.ts";

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const secret = Deno.env.get("WEBHOOK_SIGNING_SECRET_FLUTTERWAVE");
  if (!secret) return new Response("Missing WEBHOOK_SIGNING_SECRET_FLUTTERWAVE", { status: 500 });

  const signature = req.headers.get("verif-hash") ?? "";
  if (signature !== secret) return new Response("Invalid signature", { status: 400 });

  const payload = await req.json();
  // Flutterwave sample: event, data.status ('successful'), data.tx_ref, data.id, data.amount, data.meta
  const data = payload?.data ?? {};
  const txRef: string | undefined = data?.tx_ref;
  const status: string | undefined = data?.status; // 'successful', 'failed'
  const order_id: string | undefined = data?.meta?.order_id;

  if (!order_id || !txRef) {
    return new Response("Missing order_id or tx_ref", { status: 400 });
  }

  const supabase = getServiceClient();
  const { data: existing, error: fetchErr } = await supabase
    .from("orders")
    .select("id, status, provider_ref")
    .eq("id", order_id)
    .single();
  if (fetchErr) return new Response(`Fetch error: ${fetchErr.message}`, { status: 500 });
  if (!existing) return new Response("Order not found", { status: 404 });
  if (existing.status === "paid" || existing.status === "failed") return new Response("Already processed", { status: 200 });

  const newStatus = status === "successful" ? "paid" : status === "failed" ? "failed" : existing.status;
  if (newStatus === existing.status) return new Response("Event ignored", { status: 200 });

  const { error: updErr } = await supabase
    .from("orders")
    .update({
      status: newStatus,
      provider: "flutterwave",
      provider_ref: txRef,
      paid_at: newStatus === "paid" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", order_id);
  if (updErr) return new Response(`Update error: ${updErr.message}`, { status: 500 });

  return new Response("ok", { status: 200 });
});
