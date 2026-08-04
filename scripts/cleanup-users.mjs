import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv(key) {
  if (process.env[key]) return process.env[key];
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    const line = raw.split(/\r?\n/).find((l) => l.trim().startsWith(`${key}=`));
    if (!line) throw new Error(`Missing ${key}`);
    return line.slice(key.length + 1).trim().replace(/^["']|["']$/g, "");
  } catch (err) {
    throw new Error(`Missing ${key}: ${err.message}`);
  }
}

const url = loadEnv("NEXT_PUBLIC_SUPABASE_URL");
const serviceKey = loadEnv("SUPABASE_SERVICE_ROLE_KEY");
const keepEmails = loadEnv("ADMIN_EMAILS").split(",").map((e) => e.trim().toLowerCase());
const keepId = "5469ce66-304b-4eac-b04b-abba31b9221c";

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const all = [];
let page = 0;
for (;;) {
  const { data, error } = await supabase.auth.admin.listUsers({ page: page + 1, perPage: 1000 });
  if (error) throw error;
  all.push(...(data?.users ?? []));
  if ((data?.users ?? []).length < 1000) break;
  page += 1;
}

console.log(`Total auth users: ${all.length}`);
const keep = all.filter((u) => u.id === keepId || keepEmails.includes(u.email?.toLowerCase()));
const drop = all.filter((u) => !keep.some((k) => k.id === u.id));
console.log(`Keep (${keep.length}):`);
for (const u of keep) console.log(`  KEEP  ${u.id}  ${u.email}`);
console.log(`Deleting ${drop.length} users:`);
let failed = 0;
for (const u of drop) {
  const { error } = await supabase.auth.admin.deleteUser(u.id);
  if (error) {
    failed += 1;
    console.log(`  FAIL  ${u.email}: ${error.message}`);
  } else {
    console.log(`  DELETED  ${u.email}`);
  }
}
console.log(failed ? `Done with ${failed} failures` : "Done — all non-admin users removed");
