import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export const runtime = "nodejs";

const EDITS_DIR = path.join(process.cwd(), "public", "docs", "edits");

type Chapter = { id: string; title: string; content: string; content_ko?: string; images?: string[] };

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { chapters } = (await req.json()) as { chapters: Chapter[] };

  await fs.mkdir(EDITS_DIR, { recursive: true });
  await fs.writeFile(
    path.join(EDITS_DIR, `${id}.json`),
    JSON.stringify({ chapters }, null, 2),
    "utf-8"
  );
  return NextResponse.json({ ok: true });
}
