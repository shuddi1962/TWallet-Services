"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  SETTING_DEFAULTS,
  mergeSettings,
  type SettingsCategory,
  type SystemSettings,
} from "@/lib/settings-defaults";

/**
 * Live system settings: fetches once, then stays in sync via the
 * `system_settings` realtime channel (public SELECT policy). Admin toggles
 * reflect across the app without a page reload.
 */
export function useSystemSettings(): SystemSettings {
  const [settings, setSettings] = useState<SystemSettings>(SETTING_DEFAULTS);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    void (async () => {
      const { data } = await supabase
        .from("system_settings")
        .select("category, settings")
        .in("category", Object.keys(SETTING_DEFAULTS));
      if (!mounted) return;
      if (data) {
        setSettings((prev) => mergeSettings(prev, data as Array<{ category: string; settings: unknown }>));
      }
    })();

    const channel = supabase
      .channel(`app-system-settings-live-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "system_settings" },
        (payload: unknown) => {
          const p = payload as { new?: Record<string, unknown> | null };
          const row = p.new;
          if (!row) return;
          setSettings((prev) =>
            mergeSettings(prev, [
              { category: String(row.category ?? ""), settings: row.settings as unknown },
            ]),
          );
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  return settings;
}

export function useSetting(category: SettingsCategory, key: string, fallback: unknown): unknown {
  const settings = useSystemSettings();
  const value = settings[category]?.[key];
  return value === undefined || value === null ? fallback : value;
}
