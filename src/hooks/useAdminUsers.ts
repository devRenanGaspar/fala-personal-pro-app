import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  onboarding_completed: boolean;
  total_messages: number;
  nome: string | null;
  telefone: string | null;
  instagram: string | null;
  notas_admin: string | null;
  banned_until: string | null;
  is_admin: boolean;
}

interface AdminUsersResponse {
  users: AdminUser[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

async function getAccessToken() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("Not authenticated");
  return session.access_token;
}

async function callAdminUpdateUser(body: Record<string, unknown>) {
  const token = await getAccessToken();
  const response = await fetch(
    "https://mmygxbfhthrlgamxbcfr.supabase.co/functions/v1/admin-update-user",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Request failed");
  }
  return response.json();
}

export function useAdminUsers(page: number = 1, perPage: number = 50, search: string = "") {
  return useQuery<AdminUsersResponse>({
    queryKey: ["admin-users", page, perPage, search],
    queryFn: async () => {
      const token = await getAccessToken();
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });
      if (search) params.set("search", search);

      const response = await fetch(
        `https://mmygxbfhthrlgamxbcfr.supabase.co/functions/v1/admin-users?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch users");
      }

      return response.json();
    },
    staleTime: 30 * 1000,
  });
}

export function useUpdateUserOnboarding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, onboardingCompleted }: { userId: string; onboardingCompleted: boolean }) => {
      return callAdminUpdateUser({ user_id: userId, onboarding_completed: onboardingCompleted });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}

interface UpdateUserParams {
  userId: string;
  nome?: string;
  telefone?: string;
  instagram?: string;
  notas_admin?: string;
  onboarding_completed?: boolean;
  is_admin?: boolean;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: UpdateUserParams) => {
      return callAdminUpdateUser({
        user_id: params.userId,
        nome: params.nome,
        telefone: params.telefone,
        instagram: params.instagram,
        notas_admin: params.notas_admin,
        onboarding_completed: params.onboarding_completed,
        is_admin: params.is_admin,
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}

interface CreateUserParams {
  email: string;
  password: string;
  nome?: string;
  telefone?: string;
  instagram?: string;
  onboarding_completed?: boolean;
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: CreateUserParams) => {
      const token = await getAccessToken();
      const response = await fetch(
        "https://mmygxbfhthrlgamxbcfr.supabase.co/functions/v1/admin-create-user",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create user");
      }
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}

export function useConfirmUserEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      return callAdminUpdateUser({ user_id: userId, confirm_email: true });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}

export function useBanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, ban }: { userId: string; ban: boolean }) => {
      return callAdminUpdateUser({ user_id: userId, ban_user: ban });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      return callAdminUpdateUser({ user_id: userId, delete_user: true });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}
