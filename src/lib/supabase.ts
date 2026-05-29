import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Fallback for when the environment variables are not set yet
const safeUrl = supabaseUrl.startsWith('http') ? supabaseUrl : 'https://dummy.supabase.co';

export const supabase = createClient(safeUrl, supabaseAnonKey);
