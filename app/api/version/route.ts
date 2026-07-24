import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

export async function GET() {
  const pkg = JSON.parse(
    await readFile(path.resolve("package.json"), "utf-8"),
  );

  return NextResponse.json({
    version: pkg.version,
    name: pkg.name,
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? "unknown",
    environment: process.env.VERCEL_ENV ?? "development",
  });
}
