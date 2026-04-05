import { createClient } from '@supabase/supabase-js';

// Use as chaves que você encontrou (a que começa com eyJ)
const supabaseUrl = 'https://pdpgxfomdwxuozyjefmd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkcGd4Zm9tZHd4dW96eWplZm1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMzAyOTcsImV4cCI6MjA5MDkwNjI5N30.LVa7l3QRuUX6tU_UOqU94i0oQY5vfythggBzwdSWv34';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
