import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kgoxvplsaceqdvorqsle.supabase.co'
const supabaseAnonKey = 'sb_publishable_rdmGgZU7C_hFS5QtQUrQsg_zRoStrnN'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)