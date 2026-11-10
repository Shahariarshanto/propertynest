// Supabase is currently paused — all services use mock data only.
// When Supabase is active again, set VITE_SUPABASE_ENABLED=true in .env
export const isSupabaseConfigured = false;
export const isSupabaseReachable = () => false;
export const markSupabaseDown = () => {};
export const supabase = null;
