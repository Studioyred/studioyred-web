import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { hashPassword } from "@/app/lib/supabase/hash";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from("comments")
    .select("id, content, nickname, created_at")
    .eq("post_id", id)
    .order("created_at", { ascending: true });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { content, nickname, password } = await request.json();

  if (!content?.trim()) {
    return Response.json({ error: "댓글 내용을 입력해주세요." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.from("comments").insert({
    post_id: id,
    content: content.trim(),
    nickname: nickname?.trim() || "익명",
    password_hash: password ? hashPassword(password) : null,
  }).select().single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data, { status: 201 });
}
