export function getSupabaseEnv() {
  return {
    enabled: process.env.NEXT_PUBLIC_ENABLE_SUPABASE === "true",
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  };
}

export function hasSupabaseEnv() {
  const env = getSupabaseEnv();
  return Boolean(env.enabled && env.url && env.anonKey);
}

export function getPersistenceStatus() {
  const env = getSupabaseEnv();
  const missing = [
    env.enabled ? "" : "NEXT_PUBLIC_ENABLE_SUPABASE=true",
    env.url ? "" : "NEXT_PUBLIC_SUPABASE_URL",
    env.anonKey ? "" : "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  ].filter(Boolean);

  return {
    configured: missing.length === 0,
    missing,
    mode: missing.length === 0 ? "supabase_pending" : "local",
    supabaseEnabled: env.enabled
  };
}
