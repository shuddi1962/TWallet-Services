#!/usr/bin/env node
/** Uptime monitoring — real production checks (zero deps, Node 18+ ESM).
 *
 * Runs against https://twalletservices.com (overridable via SITE_URL).
 * Exits non-zero if any monitor fails so CI can alert.
 *
 * Local run: node tests/monitoring/uptime-checks.ts
 */
export {};

interface MonitorConfig {
  url: string;
  name: string;
  checkInterval: number;
  timeout: number;
  expectedStatus: number;
  expectedJsonKey?: string;
  alertIntegrations: string[];
}

const BASE = process.env.SITE_URL ?? "https://twalletservices.com";

const monitors: MonitorConfig[] = [
  {
    url: `${BASE}/api/health`,
    name: "Production Liveness",
    checkInterval: 300,
    timeout: 10,
    expectedStatus: 200,
    expectedJsonKey: "status",
    alertIntegrations: ["slack", "email"],
  },
  {
    url: `${BASE}/api/ready`,
    name: "Production Readiness",
    checkInterval: 60,
    timeout: 15,
    expectedStatus: 200,
    expectedJsonKey: "status",
    alertIntegrations: ["slack", "email"],
  },
  {
    url: `${BASE}/api/version`,
    name: "Production Version",
    checkInterval: 3600,
    timeout: 10,
    expectedStatus: 200,
    expectedJsonKey: "version",
    alertIntegrations: ["slack"],
  },
  {
    url: `${BASE}/`,
    name: "Production Homepage",
    checkInterval: 300,
    timeout: 10,
    expectedStatus: 200,
    alertIntegrations: ["slack"],
  },
  {
    url: `${BASE}/auth/login`,
    name: "Login Page",
    checkInterval: 300,
    timeout: 10,
    expectedStatus: 200,
    alertIntegrations: ["slack"],
  },
];

interface CheckResult {
  name: string;
  url: string;
  ok: boolean;
  status?: number;
  error?: string;
  latencyMs?: number;
}

async function check(m: MonitorConfig): Promise<CheckResult> {
  const started = Date.now();
  try {
    const res = await fetch(m.url, {
      redirect: "follow",
      signal: AbortSignal.timeout(m.timeout * 1000),
      headers: { "user-agent": "twallet-uptime-check/1.0" },
    });
    const latencyMs = Date.now() - started;
    if (res.status !== m.expectedStatus) {
      return {
        name: m.name,
        url: m.url,
        ok: false,
        status: res.status,
        latencyMs,
        error: `expected ${m.expectedStatus}, got ${res.status}`,
      };
    }
    if (m.expectedJsonKey) {
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        if (!(m.expectedJsonKey in json)) {
          return {
            name: m.name,
            url: m.url,
            ok: false,
            status: res.status,
            latencyMs,
            error: `JSON missing key "${m.expectedJsonKey}"`,
          };
        }
      } catch {
        return {
          name: m.name,
          url: m.url,
          ok: false,
          status: res.status,
          latencyMs,
          error: "response is not valid JSON",
        };
      }
    }
    return { name: m.name, url: m.url, ok: true, status: res.status, latencyMs };
  } catch (err) {
    return {
      name: m.name,
      url: m.url,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      latencyMs: Date.now() - started,
    };
  }
}

async function main() {
  const results = await Promise.all(monitors.map(check));
  for (const r of results) {
    const mark = r.ok ? "PASS" : "FAIL";
    console.log(
      `[${mark}] ${r.name} (${r.url}) — status=${r.status ?? "n/a"} latency=${r.latencyMs ?? "n/a"}ms${r.error ? ` error=${r.error}` : ""}`
    );
  }
  const failed = results.filter((r) => !r.ok);
  if (failed.length > 0) {
    console.error(`\n${failed.length}/${results.length} monitors FAILED`);
    for (const f of failed) {
      console.error(`  - ${f.name}: ${f.error}`);
    }
    process.exit(1);
  }
  console.log(`\nAll ${results.length} monitors OK`);
}

main().catch((err) => {
  console.error("monitor runner crashed:", err);
  process.exit(1);
});
