import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import path from "path";
import fs from "fs/promises";

export const runtime = "nodejs";

type Chapter = { id: string; title: string; content: string };

function parseChapters(html: string): Chapter[] {
  const segments = html.split(/(?=<h[1-3][\s>])/i);
  const chapters: Chapter[] = [];

  for (const seg of segments) {
    const hMatch = seg.match(/^<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i);
    if (hMatch) {
      const title = hMatch[1].replace(/<[^>]+>/g, "").trim();
      const content = seg.slice(hMatch[0].length).trim();
      if (title) chapters.push({ id: `ch-${chapters.length + 1}`, title, content });
    } else if (seg.trim()) {
      if (chapters.length === 0) {
        chapters.push({ id: "intro", title: "Prologue", content: seg.trim() });
      } else {
        chapters[chapters.length - 1].content += seg;
      }
    }
  }

  if (chapters.length === 0 && html.trim()) {
    chapters.push({ id: "ch-1", title: "Full Story", content: html });
  }

  return chapters;
}

async function findDocx(storyId: string): Promise<string | null> {
  const dirs = [
    path.join(process.cwd(), "public", "docs"),
    path.join(process.cwd(), "public"),
  ];
  for (const dir of dirs) {
    try {
      const files = await fs.readdir(dir);
      const match = files.find(
        (f) => f.toLowerCase().startsWith(storyId.toLowerCase()) && f.endsWith(".docx")
      );
      if (match) return path.join(dir, match);
    } catch {}
  }
  return null;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 1. Check for saved JSON edits first
  const editsPath = path.join(process.cwd(), "public", "docs", "edits", `${id}.json`);
  try {
    const raw = await fs.readFile(editsPath, "utf-8");
    const data = JSON.parse(raw);
    return NextResponse.json({ found: true, chapters: data.chapters ?? [], source: "json" });
  } catch {}

  // 2. Fall back to docx
  const docxPath = await findDocx(id);
  if (!docxPath) {
    return NextResponse.json({ found: false, chapters: [] });
  }

  try {
    const result = await mammoth.convertToHtml(
      { path: docxPath },
      {
        convertImage: mammoth.images.imgElement(async (image) => {
          const base64 = await image.read("base64");
          return { src: `data:${image.contentType};base64,${base64}` };
        }),
      }
    );
    return NextResponse.json({ found: true, chapters: parseChapters(result.value), source: "docx" });
  } catch (err) {
    console.error("mammoth error:", err);
    return NextResponse.json({ found: false, chapters: [], error: "Parse failed" }, { status: 500 });
  }
}
