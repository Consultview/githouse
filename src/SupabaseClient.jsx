import { createClient } from '@supabase/supabase-js';

// Agora o Vite busca os valores do seu arquivo .env automaticamente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
