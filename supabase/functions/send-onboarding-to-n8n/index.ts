import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.84.0';

declare const EdgeRuntime: {
  waitUntil: (promise: Promise<unknown>) => void;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OnboardingPayload {
  user_id: string;
  answers: Record<string, string>;
  timestamp: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth header for user verification
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('[send-onboarding-to-n8n] Missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Create client with user's auth for verification
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('[send-onboarding-to-n8n] Auth verification failed:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body (user_id no longer trusted from client)
    const { answers } = await req.json();

    // Validate required fields
    if (!answers) {
      console.error('[send-onboarding-to-n8n] Missing required field: answers');
      return new Response(
        JSON.stringify({ error: 'Missing required field: answers' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get webhook URL from environment
    const webhookUrl = Deno.env.get('ONBOARDING_WEBHOOK_URL');

    if (!webhookUrl) {
      console.error('[send-onboarding-to-n8n] ONBOARDING_WEBHOOK_URL not configured');
      return new Response(
        JSON.stringify({ error: 'Webhook URL not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare payload (use verified user.id from auth, not client)
    const payload: OnboardingPayload = {
      user_id: user.id,
      answers,
      timestamp: new Date().toISOString(),
    };

    console.log('[send-onboarding-to-n8n] Sending to N8N:', {
      webhook_url: webhookUrl,
      user_id: user.id,
      answers_count: Object.keys(answers).length,
    });

    // Fire-and-forget: Send to N8N in background
    const sendToN8N = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`N8N returned status ${response.status}`);
        }

        console.log('[send-onboarding-to-n8n] N8N request successful for user:', user.id);
      } catch (error) {
        console.error('[send-onboarding-to-n8n] N8N request failed:', error);
      }
    };

    // Execute in background (don't await)
    EdgeRuntime.waitUntil(sendToN8N());

    // Return immediately to frontend
    return new Response(
      JSON.stringify({ queued: true }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[send-onboarding-to-n8n] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
