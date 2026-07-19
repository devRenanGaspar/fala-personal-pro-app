import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.84.0';

declare const EdgeRuntime: {
  waitUntil(promise: Promise<unknown>): void;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestPayload {
  conversation_id: string;
  agent_id: string;
  mensagem: string;
  initial_message?: string | null;
}

interface N8NPayload {
  conversation_id: string;
  user_id: string;
  agent_id: string;
  mensagem: string;
  initial_message?: string | null;
}

// Security: Validate webhook URLs to prevent SSRF attacks
function isValidWebhookUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    
    // Only allow HTTPS in production
    if (parsed.protocol !== 'https:') {
      console.warn('[send-to-n8n] Blocked non-HTTPS webhook URL');
      return false;
    }
    
    // Block private IP ranges and localhost
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.16.') ||
      hostname.startsWith('172.17.') ||
      hostname.startsWith('172.18.') ||
      hostname.startsWith('172.19.') ||
      hostname.startsWith('172.20.') ||
      hostname.startsWith('172.21.') ||
      hostname.startsWith('172.22.') ||
      hostname.startsWith('172.23.') ||
      hostname.startsWith('172.24.') ||
      hostname.startsWith('172.25.') ||
      hostname.startsWith('172.26.') ||
      hostname.startsWith('172.27.') ||
      hostname.startsWith('172.28.') ||
      hostname.startsWith('172.29.') ||
      hostname.startsWith('172.30.') ||
      hostname.startsWith('172.31.') ||
      hostname.startsWith('169.254.') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal')
    ) {
      console.warn('[send-to-n8n] Blocked private/internal webhook URL:', hostname);
      return false;
    }
    
    return true;
  } catch {
    console.error('[send-to-n8n] Invalid webhook URL format');
    return false;
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth header for user verification
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('[send-to-n8n] Missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create client with user's auth for verification
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      console.error('[send-to-n8n] Auth verification failed:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create service client for database operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body (user_id no longer trusted from client)
    const payload: RequestPayload = await req.json();
    const { conversation_id, agent_id, mensagem, initial_message } = payload;

    console.log('[send-to-n8n] Received request:', {
      conversation_id,
      user_id: user.id,
      agent_id,
    });

    // CRITICAL: Verify user owns the conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('user_id')
      .eq('id', conversation_id)
      .single();

    if (convError || !conversation) {
      console.error('[send-to-n8n] Conversation not found:', convError);
      return new Response(
        JSON.stringify({ error: 'Conversation not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (conversation.user_id !== user.id) {
      console.error('[send-to-n8n] User does not own conversation:', {
        user_id: user.id,
        conversation_user_id: conversation.user_id,
      });
      return new Response(
        JSON.stringify({ error: 'Forbidden: Not your conversation' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch agent data (including initial_message as fallback)
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('slug, webhook_url, webhook_enabled, webhook_timeout_seconds, initial_message')
      .eq('id', agent_id)
      .single();

    if (agentError || !agent) {
      console.error('[send-to-n8n] Agent not found:', agentError);
      return new Response(
        JSON.stringify({ error: 'Agent not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!agent.webhook_enabled || !agent.webhook_url) {
      console.error('[send-to-n8n] Webhook not configured for agent:', agent.slug);
      return new Response(
        JSON.stringify({ error: 'Agent webhook not configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Security: Validate webhook URL before use
    if (!isValidWebhookUrl(agent.webhook_url)) {
      console.error('[send-to-n8n] Invalid webhook URL for agent:', agent.slug);
      return new Response(
        JSON.stringify({ error: 'Invalid webhook URL configuration' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark conversation as processing
    await supabase
      .from('conversations')
      .update({ is_processing: true })
      .eq('id', conversation_id);

    // Resolve initial_message: prefer client value, fallback to agent config
    const resolvedInitialMessage = initial_message?.trim() 
      ? initial_message 
      : (agent.initial_message || null);

    // Prepare payload for N8N (use verified user.id)
    const n8nPayload: N8NPayload = {
      conversation_id,
      user_id: user.id,
      agent_id,
      mensagem,
      initial_message: resolvedInitialMessage,
    };

    console.log('[send-to-n8n] Sending to N8N:', {
      webhook_url: agent.webhook_url,
      conversation_id,
      agent_id,
    });

    // Fire-and-forget: Send to N8N in background
    const sendToN8N = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          (agent.webhook_timeout_seconds || 300) * 1000
        );

        const response = await fetch(agent.webhook_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(n8nPayload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`N8N returned status ${response.status}`);
        }

        console.log('[send-to-n8n] N8N request successful:', conversation_id);
      } catch (error) {
        console.error('[send-to-n8n] N8N request failed:', error);

        // Insert error message
        await supabase.from('messages').insert({
          conversation_id,
          role: 'assistant',
          content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
          status: 'error',
          error_message: error instanceof Error ? error.message : 'Unknown error',
        });

        // Unmark conversation as processing
        await supabase
          .from('conversations')
          .update({ is_processing: false })
          .eq('id', conversation_id);
      }
    };

    // Execute in background
    EdgeRuntime.waitUntil(sendToN8N());

    // Return immediately
    return new Response(
      JSON.stringify({ queued: true }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[send-to-n8n] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
