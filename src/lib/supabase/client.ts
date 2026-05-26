import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && key
    ? createClient(url, key, {
        realtime: { params: { eventsPerSecond: 10 } },
        auth: { persistSession: false }
      })
    : null;

export const isSupabaseReady = supabase !== null;
