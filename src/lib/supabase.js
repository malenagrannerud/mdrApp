/**
 * Supabase-klient för MAUDE PMS-dashboard.
 * 
 * Skapar en anslutning till Supabase PostgreSQL-databasen.
 * 
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kgoxvplsaceqdvorqsle.supabase.co'

/**
 * Supabase anonym publik nyckel.
 * Säker att exponera i frontend (begränsad av RLS).
 * @constant {string}
 */
const supabaseAnonKey = 'sb_publishable_rdmGgZU7C_hFS5QtQUrQsg_zRoStrnN'

/**
 * Supabase-klientinstans.
 * Används för alla databasfrågor från frontend.
 * @constant {SupabaseClient}
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)