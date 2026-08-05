import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

process.env.RESEND_API_KEY = "re_test_key";
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";

// Never touch the network through system settings in unit tests.
vi.mock("@/lib/settings", () => ({
  getSystemSettings: vi.fn(async () => ({
    general: {},
    payment: {},
    security: {},
    notifications: {},
    kyc: {},
  })),
  getSetting: vi.fn(async () => true),
  refreshSystemSettingsCache: vi.fn(),
}));