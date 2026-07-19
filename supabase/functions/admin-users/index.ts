import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Client para verificar o usuário autenticado
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Client com service role para acessar auth.users
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verificar se o usuário é admin
    const { data: isAdmin } = await supabaseAdmin.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });

    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const perPage = parseInt(url.searchParams.get("per_page") || "50");
    const search = url.searchParams.get("search") || "";

    // Buscar todos usuários (Supabase Auth não suporta filtro por email nativamente)
    const { data: authUsers, error: usersError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000, // Pegar todos para filtrar
    });

    if (usersError) {
      console.error("Error fetching auth users:", usersError);
      return new Response(JSON.stringify({ error: "Failed to fetch users" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Buscar profiles com novos campos
    const { data: allProfiles } = await supabaseAdmin
      .from("profiles")
      .select("id, onboarding_completed, nome, telefone, instagram, notas_admin");

    const allProfilesMap = new Map(allProfiles?.map((p) => [p.id, p]) || []);

    // Filtrar por email ou nome se houver busca
    let filteredUsers = authUsers.users;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = authUsers.users.filter((u) => {
        const emailMatch = u.email?.toLowerCase().includes(searchLower);
        const profile = allProfilesMap.get(u.id);
        const nameMatch = profile?.nome?.toLowerCase().includes(searchLower);
        return emailMatch || nameMatch;
      });
    }

    // Aplicar paginação após filtro
    const total = filteredUsers.length;
    const totalPages = Math.ceil(total / perPage);
    const offset = (page - 1) * perPage;
    const paginatedUsers = filteredUsers.slice(offset, offset + perPage);

    const userIds = paginatedUsers.map((u) => u.id);

    // Buscar roles de admin para os usuários da página
    const { data: adminRoles } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin")
      .in("user_id", userIds);

    const adminUserIds = new Set(adminRoles?.map((r) => r.user_id) || []);

    // Buscar contagem de mensagens por usuário (via conversations)
    const { data: conversationsData } = await supabaseAdmin
      .from("conversations")
      .select("id, user_id")
      .in("user_id", userIds);

    const conversationIds = conversationsData?.map((c) => c.id) || [];
    const conversationUserMap = new Map(conversationsData?.map((c) => [c.id, c.user_id]) || []);

    // Buscar contagem de mensagens (role = 'user')
    const { data: messagesData } = await supabaseAdmin
      .from("messages")
      .select("conversation_id")
      .eq("role", "user")
      .in("conversation_id", conversationIds);

    // Agregar contagem por user_id
    const messageCountByUser = new Map<string, number>();
    messagesData?.forEach((msg) => {
      const userId = conversationUserMap.get(msg.conversation_id);
      if (userId) {
        messageCountByUser.set(userId, (messageCountByUser.get(userId) || 0) + 1);
      }
    });

    // Montar resposta com novos campos
    const users = paginatedUsers.map((authUser) => {
      const profile = allProfilesMap.get(authUser.id);
      return {
        id: authUser.id,
        email: authUser.email,
        created_at: authUser.created_at,
        last_sign_in_at: authUser.last_sign_in_at,
        email_confirmed_at: authUser.email_confirmed_at || null,
        onboarding_completed: profile?.onboarding_completed ?? false,
        total_messages: messageCountByUser.get(authUser.id) || 0,
        nome: profile?.nome || null,
        telefone: profile?.telefone || null,
        instagram: profile?.instagram || null,
        notas_admin: profile?.notas_admin || null,
        banned_until: (authUser as any).banned_until || null,
        is_admin: adminUserIds.has(authUser.id),
      };
    });

    return new Response(
      JSON.stringify({
        users,
        pagination: {
          page,
          per_page: perPage,
          total,
          total_pages: totalPages,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Admin users error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
