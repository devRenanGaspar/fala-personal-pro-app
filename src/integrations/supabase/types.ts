export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      agents: {
        Row: {
          created_at: string | null
          description: string
          display_order: number
          icon: string
          id: string
          initial_message: string | null
          is_active: boolean | null
          route: string
          slug: string
          suggested_replies: string | null
          system_prompt: string | null
          title: string
          updated_at: string | null
          webhook_enabled: boolean | null
          webhook_timeout_seconds: number | null
          webhook_url: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          display_order?: number
          icon: string
          id?: string
          initial_message?: string | null
          is_active?: boolean | null
          route: string
          slug: string
          suggested_replies?: string | null
          system_prompt?: string | null
          title: string
          updated_at?: string | null
          webhook_enabled?: boolean | null
          webhook_timeout_seconds?: number | null
          webhook_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          display_order?: number
          icon?: string
          id?: string
          initial_message?: string | null
          is_active?: boolean | null
          route?: string
          slug?: string
          suggested_replies?: string | null
          system_prompt?: string | null
          title?: string
          updated_at?: string | null
          webhook_enabled?: boolean | null
          webhook_timeout_seconds?: number | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          agent_id: string
          auto_renamed_by_n8n: boolean | null
          created_at: string | null
          current_document: string | null
          id: string
          is_processing: boolean | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agent_id: string
          auto_renamed_by_n8n?: boolean | null
          created_at?: string | null
          current_document?: string | null
          id?: string
          is_processing?: boolean | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agent_id?: string
          auto_renamed_by_n8n?: boolean | null
          created_at?: string | null
          current_document?: string | null
          id?: string
          is_processing?: boolean | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      document_versions: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          version_number: number
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          version_number: number
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_versions_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          error_message: string | null
          id: string
          request_id: string | null
          role: string
          status: string | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          request_id?: string | null
          role: string
          status?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          request_id?: string | null
          role?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_answers: {
        Row: {
          answer_value: string
          created_at: string | null
          id: string
          question_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          answer_value: string
          created_at?: string | null
          id?: string
          question_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          answer_value?: string
          created_at?: string | null
          id?: string
          question_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "onboarding_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_questions: {
        Row: {
          created_at: string | null
          created_by: string | null
          display_order: number
          id: string
          is_required: boolean | null
          options: Json | null
          placeholder: string | null
          question_key: string
          question_label: string
          question_type: string
          status: string
          step: number
          step_subtitle: string | null
          step_title: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          display_order?: number
          id?: string
          is_required?: boolean | null
          options?: Json | null
          placeholder?: string | null
          question_key: string
          question_label: string
          question_type: string
          status?: string
          step: number
          step_subtitle?: string | null
          step_title?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          display_order?: number
          id?: string
          is_required?: boolean | null
          options?: Json | null
          placeholder?: string | null
          question_key?: string
          question_label?: string
          question_type?: string
          status?: string
          step?: number
          step_subtitle?: string | null
          step_title?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      plans: {
        Row: {
          created_at: string | null
          credits: number
          description: string | null
          display_order: number | null
          duration_days: number | null
          id: string
          is_active: boolean | null
          max_messages_per_day: number | null
          name: string
          price_cents: number | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credits?: number
          description?: string | null
          display_order?: number | null
          duration_days?: number | null
          id?: string
          is_active?: boolean | null
          max_messages_per_day?: number | null
          name: string
          price_cents?: number | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credits?: number
          description?: string | null
          display_order?: number | null
          duration_days?: number | null
          id?: string
          is_active?: boolean | null
          max_messages_per_day?: number | null
          name?: string
          price_cents?: number | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pro_bio_n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      pro_dores_n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      pro_n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      pro_nicho_n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      pro_stories_n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          instagram: string | null
          nome: string | null
          notas_admin: string | null
          onboarding_completed: boolean | null
          plan_expires_at: string | null
          plan_id: string | null
          plan_started_at: string | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          instagram?: string | null
          nome?: string | null
          notas_admin?: string | null
          onboarding_completed?: boolean | null
          plan_expires_at?: string | null
          plan_id?: string | null
          plan_started_at?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          instagram?: string | null
          nome?: string | null
          notas_admin?: string | null
          onboarding_completed?: boolean | null
          plan_expires_at?: string | null
          plan_id?: string | null
          plan_started_at?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_agent_progress: {
        Row: {
          agent_id: string
          created_at: string | null
          id: string
          last_accessed_at: string | null
          official_conversation_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          official_conversation_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          official_conversation_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_agent_progress_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_agent_progress_official_conversation_id_fkey"
            columns: ["official_conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_insights: {
        Row: {
          created_at: string
          id: number
          insight: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          insight?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          insight?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_insights_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_list_agents: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string | null
          description: string
          display_order: number
          icon: string
          id: string
          initial_message: string | null
          is_active: boolean | null
          route: string
          slug: string
          suggested_replies: string | null
          system_prompt: string | null
          title: string
          updated_at: string | null
          webhook_enabled: boolean | null
          webhook_timeout_seconds: number | null
          webhook_url: string | null
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
