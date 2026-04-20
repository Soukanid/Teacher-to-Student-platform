import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.DAD_SUPABASE_URL!,
  process.env.DAD_SUPABASE_ANON_KEY!
);
