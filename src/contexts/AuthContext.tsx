import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

interface Profile {
  id: string;
  onboarding_completed: boolean | null;
  plan_id: string | null;
  plan_started_at: string | null;
  plan_expires_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface Plan {
  id: string;
  slug: string;
  name: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, nome?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      logger.error("Error fetching profile:", error);
      return null;
    }

    return data;
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        // Defer Supabase calls with setTimeout to avoid deadlocks
        if (session?.user) {
          setTimeout(() => {
            if (mounted) {
              fetchProfile(session.user.id).then(profile => {
                if (mounted) setProfile(profile);
              });
            }
          }, 0);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchProfile(session.user.id).then(profile => {
          if (mounted) setProfile(profile);
        });
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    // Validate plan is active
    if (data.user) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("plan_id, plan_expires_at")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileData?.plan_id) {
        const { data: planData } = await supabase
          .from("plans")
          .select("is_active, name")
          .eq("id", profileData.plan_id)
          .maybeSingle();

        // Check if plan is inactive
        if (planData && !planData.is_active) {
          await supabase.auth.signOut();
          return { 
            error: { 
              message: `Seu plano "${planData.name}" está inativo. Entre em contato com o suporte.` 
            } 
          };
        }

        // Check if plan has expired
        if (profileData.plan_expires_at) {
          const expiresAt = new Date(profileData.plan_expires_at);
          if (expiresAt < new Date()) {
            await supabase.auth.signOut();
            return { 
              error: { 
                message: "Seu plano expirou. Entre em contato para renovar." 
              } 
            };
          }
        }
      }
    }

    return { error: null };
  };

  const signUp = async (email: string, password: string, nome?: string) => {
    const redirectUrl = `${window.location.origin}/confirm-error`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: nome ? { nome } : undefined,
      },
    });

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Gera o token de recuperação via Supabase Auth
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        logger.error("Erro ao gerar token de recuperação:", error);
        return { error };
      }

      // O Supabase não retorna o link diretamente, então precisamos construí-lo manualmente
      // Por segurança, vamos apenas retornar sucesso sem enviar email customizado por enquanto
      // O Supabase já envia o email padrão
      return { error: null };
    } catch (error: any) {
      logger.error("Erro no processo de recuperação:", error);
      return { error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
