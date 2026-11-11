import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabaseUrl = 'https://wymmevqtnozuvfdrievr.supabase.co';
const supabaseKey = 'sb_publishable_mKrMxPtjTK53TgraZ2rQ0w_7QKHydea';

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)
