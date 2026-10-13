// medallion/supabase.js
// The anon key is public by design, but keys and URLs still belong in
// environment variables, not in source code. See .env.example.

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// null when not configured: callers show a clear error instead of crashing the whole app
export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null