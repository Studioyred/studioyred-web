import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { hashPassword } from "@/app/lib/supabase/hash";

export const runtime = "nodejs";

async function isAdmin(request: NextRequest): Promise<boolean> {
  const token = request.headers.get("authorization")?.split(" ")[1];
  if (!token) return false;
  const { data: { user } } = await supabaseAdmin.auth.getUser(token);
  return user?.email === process.env.ADMIN_EMAIL;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return Response.json({ error: "게시글을 찾을 수 없습니다." }, { status: 404 });
  return Response.json(data);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (await isAdmin(request)) {
    const { error } = await supabaseAdmin.from("posts").delete().eq("id", id);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ ok: true });
  }

  const { password } = await request.json().catch(() => ({ password: null }));
  if (!password) return Response.json({ error: "권한이 없습니다." }, { status: 403 });

  const { data: post } = await supabaseAdmin.from("posts").select("password_hash").eq("id", id).single();
  if (!post?.password_hash || post.password_hash !== hashPassword(password)) {
    return Response.json({ error: "비밀번호가 틀렸습니다." }, { status: 403 });
  }

  const { error } = await supabaseAdmin.from("posts").delete().eq("id", id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!(await isAdmin(request))) {
    return Response.json({ error: "관리자만 가능합니다." }, { status: 403 });
  }

  const { is_notice } = await request.json();
  const { data, error } = await supabaseAdmin
    .from("posts")
    .update({ is_notice })
    .eq("id", id)
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}
