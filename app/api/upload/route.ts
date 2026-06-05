import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const storyId = formData.get("storyId") as string | null;

    if (!file || !storyId) {
      return NextResponse.json({ error: "Missing file or storyId" }, { status: 400 });
    }

    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    if (!["jpg", "jpeg", "png", "webp"].includes(ext)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const filename = `${storyId}.${ext}`;
    const coversDir = path.join(process.cwd(), "public", "covers");
    await fs.mkdir(coversDir, { recursive: true });

    // 기존 커버 삭제 (확장자가 다를 수 있으므로)
    for (const oldExt of ["jpg", "jpeg", "png", "webp"]) {
      try {
        await fs.unlink(path.join(coversDir, `${storyId}.${oldExt}`));
      } catch {}
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(coversDir, filename), buffer);

    return NextResponse.json({ url: `/covers/${filename}` });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
