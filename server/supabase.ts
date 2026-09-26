import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabaseServer: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

/**
 * Attempt to sign up or register user with Supabase Auth
 */
export async function supabaseSignUp(email: string, password: string, userData?: Record<string, any>) {
  if (!supabaseServer) return null;
  try {
    const { data, error } = await supabaseServer.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    if (error) {
      console.warn('Supabase Auth signUp note:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase signUp error:', err);
    return null;
  }
}

/**
 * Attempt to sign in user with Supabase Auth
 */
export async function supabaseSignIn(email: string, password: string) {
  if (!supabaseServer) return null;
  try {
    const { data, error } = await supabaseServer.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.warn('Supabase Auth signIn note:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase signIn error:', err);
    return null;
  }
}
