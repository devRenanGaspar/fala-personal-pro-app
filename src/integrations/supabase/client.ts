import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Configuração via variáveis de ambiente (Vite), com fallback para os valores
// públicos do projeto. A chave "publishable"/anon é pública por design: ela é
// enviada ao browser e protegida pelas políticas de RLS do Supabase.
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? "https://mmygxbfhthrlgamxbcfr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1teWd4YmZodGhybGdhbXhiY2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMDU4OTUsImV4cCI6MjA3OTY4MTg5NX0.zevyVyyK7JG-K9-w67bDXrMDewiu5-PeruuU0CV1YIE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});