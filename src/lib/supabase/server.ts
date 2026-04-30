import { createServerClient } from '@supabase/ssr';

// No-op cookies adapter — this app has no auth, so cookies are unused.
// Uses the v0.5+ getAll/setAll API to avoid deprecation warnings.
export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  );
}
