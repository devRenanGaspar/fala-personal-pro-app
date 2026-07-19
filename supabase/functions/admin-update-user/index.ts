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
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify admin role using user's token
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin role
    const { data: isAdmin } = await userClient.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });

    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse request body
    const body = await req.json();
    const { user_id, onboarding_completed, nome, telefone, instagram, notas_admin, is_admin, confirm_email, ban_user, delete_user } = body;


    // Use service role to update profile
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Handle delete user
    if (delete_user === true) {
      if (user_id === user.id) {
        return new Response(JSON.stringify({ error: "Você não pode excluir a si mesmo" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: deleteError } = await adminClient.auth.admin.deleteUser(user_id);
      if (deleteError) {
        console.error("Error deleting user:", deleteError);
        return new Response(JSON.stringify({ error: "Erro ao excluir usuário" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true, deleted: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle ban/unban user
    if (typeof ban_user === "boolean") {
      if (user_id === user.id) {
        return new Response(JSON.stringify({ error: "Você não pode desativar a si mesmo" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: banError } = await adminClient.auth.admin.updateUserById(
        user_id,
        { ban_duration: ban_user ? "876600h" : "none" }
      );

      if (banError) {
        console.error("Error banning user:", banError);
        return new Response(JSON.stringify({ error: ban_user ? "Erro ao desativar usuário" : "Erro ao reativar usuário" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Handle email confirmation
    if (confirm_email === true) {
      const { error: confirmError } = await adminClient.auth.admin.updateUserById(
        user_id,
        { email_confirm: true }
      );

      if (confirmError) {
        console.error("Error confirming email:", confirmError);
        return new Response(JSON.stringify({ error: "Erro ao confirmar email" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Handle admin role toggle
    if (typeof is_admin === "boolean") {
      // Prevent admin from removing their own admin role
      if (user_id === user.id && is_admin === false) {
        return new Response(JSON.stringify({ error: "Você não pode remover seu próprio privilégio de admin" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (is_admin) {
        // Insert admin role (ignore if already exists)
        const { error: roleError } = await adminClient
          .from("user_roles")
          .upsert({ user_id, role: "admin" }, { onConflict: "user_id,role" });

        if (roleError) {
          console.error("Error adding admin role:", roleError);
          return new Response(JSON.stringify({ error: "Erro ao adicionar role de admin" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } else {
        // Remove admin role
        const { error: roleError } = await adminClient
          .from("user_roles")
          .delete()
          .eq("user_id", user_id)
          .eq("role", "admin");

        if (roleError) {
          console.error("Error removing admin role:", roleError);
          return new Response(JSON.stringify({ error: "Erro ao remover role de admin" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
    }

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {};
    if (typeof onboarding_completed === "boolean") updateData.onboarding_completed = onboarding_completed;
    if (nome !== undefined) updateData.nome = nome;
    if (telefone !== undefined) updateData.telefone = telefone;
    if (instagram !== undefined) updateData.instagram = instagram;
    if (notas_admin !== undefined) updateData.notas_admin = notas_admin;

    // Only update profile if there are fields to update
    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await adminClient
        .from("profiles")
        .update(updateData)
        .eq("id", user_id);

      if (updateError) {
        return new Response(JSON.stringify({ error: updateError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
