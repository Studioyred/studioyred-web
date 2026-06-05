import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const editsPath = path.join(process.cwd(), "public", "docs", "edits", `${id}.json`);
  try {
    const raw = await fs.readFile(editsPath, "utf-8");
    const data = JSON.parse(raw);
    return NextResponse.json({ found: true, chapters: data.chapters ?? [], source: "json" });
  } catch {
    return NextResponse.json({ found: false, chapters: [] });
  }
}
