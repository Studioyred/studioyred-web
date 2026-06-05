import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const workId = formData.get("workId") as string | null;
    const chapterId = formData.get("chapterId") as string | null;

    if (!file || !workId || !chapterId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    if (!["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const dir = path.join(process.cwd(), "public", "webtoon", workId, chapterId);
    await fs.mkdir(dir, { recursive: true });

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(dir, filename), buffer);

    return NextResponse.json({ url: `/webtoon/${workId}/${chapterId}/${filename}` });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
