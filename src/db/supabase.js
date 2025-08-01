// src/db/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pnbwjevfknauawlcxetj.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY // ✅ use vite env

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
