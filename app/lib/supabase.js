import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export const supabase = (supabaseUrl && isValidUrl(supabaseUrl) && supabaseAnonKey) 
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

if (!supabase && typeof window !== 'undefined') {
    console.warn('⚠️ Supabase URL atau Anon Key tidak valid/belum diset. Beberapa fitur backend mungkin tidak berfungsi.');
}
