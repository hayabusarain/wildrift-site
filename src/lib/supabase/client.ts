import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (client) return client;

  // fallback to a valid URL format to prevent initialization error when using placeholders
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const finalUrl = url.startsWith('http') ? url : 'https://dummy.supabase.co';
  const finalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy';

  client = createBrowserClient<Database>(
    finalUrl,
    finalKey
  )
  return client;
}
