import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { hashPassword } from "@/app/lib/supabase/hash";

export const runtime = "nodejs";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("id, title, nickname, is_notice, created_at, comments(count)")
    .order("is_notice", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function POST(request: NextRequest) {
  const { title, content, nickname, password } = await request.json();

  if (!title?.trim() || !content?.trim()) {
    return Response.json({ error: "제목과 내용을 입력해주세요." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.from("posts").insert({
    title: title.trim(),
    content: content.trim(),
    nickname: nickname?.trim() || "익명",
    password_hash: password ? hashPassword(password) : null,
  }).select().single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data, { status: 201 });
}
