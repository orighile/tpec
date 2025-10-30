
// Supabase Edge Function: Create Profile Trigger
// This function is called via a database trigger when a new user signs up
// It creates a profile record in the public.profiles table

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { getServiceClient } from "../_shared/supabaseClient.ts";

serve(async (req: Request) => {
  try {
    const { record } = await req.json();
    const supabase = getServiceClient();

    // Create profile record
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: record.id,
        full_name: record.raw_user_meta_data?.full_name || null,
        username: record.email?.split('@')[0] || null,
        avatar_url: record.raw_user_meta_data?.avatar_url || null,
        provider: record.app_metadata?.provider || 'email',
        provider_id: record.app_metadata?.provider_id || null,
      });

    if (error) {
      console.error('Error creating profile:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
