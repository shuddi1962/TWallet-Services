import "@testing-library/jest-dom/vitest";

process.env.RESEND_API_KEY = "re_test_key";
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";

vi.mock("next/headers", () => ({
  headers: () => ({
    get: (key: string) => {
      const map: Record<string, string> = {
        "x-forwarded-for": "127.0.0.1",
        origin: "https://example.com",
      };
      return map[key] ?? null;
    },
  }),
  cookies: () => ({
    getAll: () => [],
    setAll: () => {},
  }),
}));