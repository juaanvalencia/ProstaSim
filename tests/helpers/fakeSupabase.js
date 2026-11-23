import { vi } from "vitest";

// In-memory stand-in for the Supabase client, so tests never reach the network.
// `query` is the chainable table query returned by `from()`.
export function createFakeSupabase() {
  const query = {
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    maybeSingle: vi.fn(async () => ({ data: null, error: null })),
    order: vi.fn(async () => ({ data: [], error: null })),
    insert: vi.fn(async () => ({ data: null, error: null })),
  };

  return {
    query,
    from: vi.fn(() => query),
    auth: {
      getSession: vi.fn(async () => ({ data: { session: null }, error: null })),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
      signInWithPassword: vi.fn(async () => ({ data: {}, error: null })),
      signUp: vi.fn(async () => ({ data: { session: null }, error: null })),
      signOut: vi.fn(async () => ({ error: null })),
    },
  };
}
