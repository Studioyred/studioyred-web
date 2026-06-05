import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import type { SiteConfig } from "../../lib/site-config-types";

export const runtime = "nodejs";

const CONFIG_PATH = path.join(process.cwd(), "public", "site-config.json");

async function readConfig(): Promise<SiteConfig> {
  try {
    const raw = await fs.readFile(CONFIG_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function GET() {
  return NextResponse.json(await readConfig());
}

export async function POST(req: NextRequest) {
  const patch = await req.json() as Partial<SiteConfig>;
  const config = { ...(await readConfig()), ...patch };
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
  return NextResponse.json(config);
}
