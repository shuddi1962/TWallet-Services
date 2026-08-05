import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { revalidateTag } from "next/cache";
import {
  SETTING_DEFAULTS,
  mergeSettings,
  type SettingsCategory,
  type SystemSettings,
} from "./settings-defaults";

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

async function fetchSettings(): Promise<SystemSettings> {
  try {
    const { data } = await sb()
      .from("system_settings")
      .select("category, settings")
      .in("category", Object.keys(SETTING_DEFAULTS));
    return mergeSettings(SETTING_DEFAULTS, (data ?? []) as Array<{ category: string; settings: unknown }>);
  } catch {
    return mergeSettings(SETTING_DEFAULTS, []);
  }
}

// `unstable_cache` requires Next's request-scoped incremental cache. Outside a
// request (vitest, edge contexts, some CLI tooling) it either isn't exported
// or throws "Invariant: incrementalCache missing" — fall back to uncached reads.
let cachedGetSystemSettings: (() => Promise<SystemSettings>) | null = null;
try {
  if (typeof unstable_cache === "function") {
    cachedGetSystemSettings = unstable_cache(fetchSettings, ["system-settings"], {
      revalidate: 30,
      tags: ["system_settings"],
    });
  }
} catch {
  cachedGetSystemSettings = null;
}

export async function getSystemSettings(): Promise<SystemSettings> {
  if (cachedGetSystemSettings) {
    try {
      return await cachedGetSystemSettings();
    } catch {
      // no incremental cache available — fall through to the uncached read
    }
  }
  return fetchSettings();
}

export async function getSetting(
  category: SettingsCategory,
  key: string,
  fallback: unknown,
): Promise<unknown> {
  const settings = await getSystemSettings();
  const value = settings[category]?.[key];
  return value === undefined || value === null ? fallback : value;
}

export function refreshSystemSettingsCache(): void {
  if (typeof revalidateTag === "function") {
    revalidateTag("system_settings");
  }
}
