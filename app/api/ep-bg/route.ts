import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const fd = await req.formData();
  const file = fd.get("file") as File;
  const workId = fd.get("workId") as string;
  const epIdx = fd.get("epIdx") as string;

  if (!file || !workId) return NextResponse.json({ error: "missing" }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `ep-${epIdx}.${ext}`;
  const dir = join(process.cwd(), "public", "ep-bgs", workId);

  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, filename), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: `/ep-bgs/${workId}/${filename}` });
}
