/**
 * 
 * lib/supabase.js
 * Supabase-klient för MAUDE PMS-dashboard.
 * Hämtar product_stats och manufacturer_stats från Supabase PostgreSQL-databasen.
 * 
 */

import { createClient } from '@supabase/supabase-js'

//  Hämtar URL och Anon Key dynamiskt från din .env via Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Säkerhetskoll så att appen varnar om du glömt starta om din lokala server efter .env-ändring
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Fel: Supabase miljövariabler saknas! Kontrollera din .env-fil och starta om npm run dev.')
}

/**
 * Supabase-klientinstans.
 * Används för alla databasfrågor från frontend.
 * @constant {SupabaseClient}
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
