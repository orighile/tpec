import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { getServiceClient } from "../_shared/supabaseClient.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const pathname = url.pathname;
  const pathParts = pathname.split('/').filter(p => p);
  
  try {
    const supabase = getServiceClient();
    
    // Get user from JWT token
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (req.method === 'POST' && pathParts[1] === 'process') {
      // POST /payments/process - Process payment
      const body = await req.json();
      const { order_id, provider, amount, currency = 'NGN', callback_url } = body;

      if (!order_id || !provider || !amount) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Order ID, provider, and amount are required' 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Verify order belongs to user
      const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('id', order_id)
        .eq('user_id', user.id)
        .single();

      if (!order) {
        return new Response(
          JSON.stringify({ success: false, error: 'Order not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (provider === 'flutterwave') {
        const flutterwavePublicKey = Deno.env.get('VITE_FLUTTERWAVE_PUBLIC_KEY');
        
        const paymentData = {
          public_key: flutterwavePublicKey,
          tx_ref: `TPEC-${order_id}-${Date.now()}`,
          amount: amount,
          currency: currency,
          payment_options: "card,mobilemoney,ussd",
          customer: {
            email: user.email,
            phonenumber: user.phone || '',
            name: user.user_metadata?.full_name || user.email
          },
          customizations: {
            title: "TPEC Events",
            description: `Payment for order ${order_id}`,
            logo: "https://your-domain.com/logo.png"
          },
          redirect_url: callback_url || `${Deno.env.get('VITE_SITE_URL')}/payment/callback`,
          meta: {
            order_id: order_id
          }
        };

        return new Response(
          JSON.stringify({
            success: true,
            data: {
              payment_url: 'https://checkout.flutterwave.com/v3/hosted/pay',
              payment_data: paymentData,
              reference: paymentData.tx_ref
            },
            message: 'Payment initialized'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } 
      
      if (provider === 'paystack') {
        const paystackPublicKey = Deno.env.get('VITE_PAYSTACK_PUBLIC_KEY');
        
        const paymentData = {
          key: paystackPublicKey,
          email: user.email,
          amount: amount * 100, // Paystack uses kobo
          currency: currency,
          ref: `TPEC-${order_id}-${Date.now()}`,
          callback_url: callback_url || `${Deno.env.get('VITE_SITE_URL')}/payment/callback`,
          metadata: {
            order_id: order_id,
            custom_fields: [
              {
                display_name: "Order ID",
                variable_name: "order_id",
                value: order_id
              }
            ]
          }
        };

        return new Response(
          JSON.stringify({
            success: true,
            data: {
              payment_url: 'https://checkout.paystack.com',
              payment_data: paymentData,
              reference: paymentData.ref
            },
            message: 'Payment initialized'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: false, error: 'Unsupported payment provider' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (req.method === 'GET' && pathParts[1] === 'history') {
      // GET /payments/history - Get payment history
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      
      const { data, error, count } = await supabase
        .from('orders')
        .select(`
          *,
          events(title, start_date),
          order_items(*, tickets(type, description)),
          vendor_bookings(*, vendors(name))
        `, { count: 'exact' })
        .eq('user_id', user.id)
        .in('status', ['paid', 'failed', 'refunded'])
        .range((page - 1) * limit, page * limit - 1)
        .order('created_at', { ascending: false });

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          data,
          meta: {
            total: count,
            page,
            limit,
            hasMore: (count || 0) > page * limit
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (req.method === 'POST' && pathParts[1] && pathParts[2] === 'refund') {
      // POST /payments/:id/refund - Process refund
      const orderId = pathParts[1];
      const body = await req.json();
      const { reason, amount } = body;

      // Verify order belongs to user and is refundable
      const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .eq('status', 'paid')
        .single();

      if (!order) {
        return new Response(
          JSON.stringify({ success: false, error: 'Order not found or not refundable' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update order status to refund_requested
      const { data, error } = await supabase
        .from('orders')
        .update({
          status: 'refund_requested',
          refund_reason: reason,
          refund_amount: amount || order.total_amount,
          refund_requested_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          data, 
          message: 'Refund request submitted successfully' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
