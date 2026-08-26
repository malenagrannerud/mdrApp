/**
 * 
 * lib/supabase.js
 * Supabase-klient för MAUDE PMS-dashboard.
 * Hårdkodade nycklar för direktkoppling till MDRDASH.
 * 
 */

import { createClient } from '@supabase/supabase-js'

// Vi hårdkodar ditt NYA fungerande MDRDASH-projekt direkt i koden precis som du hade förut!
const supabaseUrl = 'https://supabase.co'
const supabaseAnonKey = 'sb_publishable_HxNePEnNXJhkA0jl9lkgJQ_vaBRsHgd'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
