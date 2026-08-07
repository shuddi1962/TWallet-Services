#!/usr/bin/env node
/** Security header checks against production (zero deps, Node 18+ ESM).
 *
 * Validates the headers declared in next.config.ts are actually served.
 * Exits non-zero if any required header is missing or malformed.
 *
 * Local run: node tests/security/headers-check.ts
 */
export {};

const BASE = process.env.SITE_URL ?? "https://twalletservices.com";

interface HeaderRule {
  name: string;
  present: boolean;
  test?: (value: string) => boolean;
  expect?: string;
}

const rules: HeaderRule[] = [
  {
    name: "Strict-Transport-Security",
    present: true,
    test: (v) => /max-age=\d{5,}/.test(v) && v.includes("includeSubDomains"),
    expect: "max-age >= 10000 with includeSubDomains",
  },
  {
    name: "X-Frame-Options",
    present: true,
    test: (v) => v === "DENY" || v === "SAMEORIGIN",
    expect: "DENY or SAMEORIGIN",
  },
  {
    name: "X-Content-Type-Options",
    present: true,
    test: (v) => v === "nosniff",
    expect: "nosniff",
  },
  {
    name: "Referrer-Policy",
    present: true,
    test: (v) => /strict-origin-when-cross-origin|no-referrer|same-origin/.test(v),
    expect: "strict-origin-when-cross-origin",
  },
  {
    name: "Permissions-Policy",
    present: true,
  },
  {
    name: "X-XSS-Protection",
    present: true,
    test: (v) => v === "1; mode=block",
    expect: "1; mode=block",
  },
  {
    name: "Content-Security-Policy",
    present: true,
    test: (v) =>
      v.includes("frame-ancestors") &&
      v.includes("object-src 'none'") &&
      v.includes("default-src") &&
      v.includes("upgrade-insecure-requests"),
    expect: "frame-ancestors, object-src 'none', default-src, upgrade-insecure-requests",
  },
];

async function main() {
  const res = await fetch(`${BASE}/`, {
    redirect: "follow",
    signal: AbortSignal.timeout(15_000),
    headers: { "user-agent": "twallet-header-check/1.0" },
  });

  if (!res.url.startsWith("https://")) {
    console.error(`FAIL: ${BASE} did not serve over HTTPS (final URL: ${res.url})`);
    process.exit(1);
  }
  console.log(`OK: served over HTTPS (${res.url}) status=${res.status}`);

  const failures: string[] = [];
  for (const rule of rules) {
    const value = res.headers.get(rule.name);
    if (!value) {
      if (rule.present) {
        failures.push(`missing header ${rule.name}`);
        console.error(`FAIL: header "${rule.name}" is missing`);
      }
      continue;
    }
    if (rule.test && !rule.test(value)) {
      failures.push(`header ${rule.name} = "${value}" (expected ${rule.expect})`);
      console.error(`FAIL: header "${rule.name}" = "${value}" (expected ${rule.expect})`);
      continue;
    }
    console.log(`OK: header ${rule.name} = ${value.length > 80 ? `${value.slice(0, 80)}…` : value}`);
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} header checks FAILED`);
    process.exit(1);
  }
  console.log("\nAll header checks OK");
}

main().catch((err) => {
  console.error("header checker crashed:", err);
  process.exit(1);
});
