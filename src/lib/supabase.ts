import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Make sure to set up your .env file correctly.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);