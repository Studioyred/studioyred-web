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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (await isAdmin(request)) {
    const { error } = await supabaseAdmin.from("comments").delete().eq("id", id);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ ok: true });
  }

  const { password } = await request.json().catch(() => ({ password: null }));
  if (!password) return Response.json({ error: "권한이 없습니다." }, { status: 403 });

  const { data: comment } = await supabaseAdmin.from("comments").select("password_hash").eq("id", id).single();
  if (!comment?.password_hash || comment.password_hash !== hashPassword(password)) {
    return Response.json({ error: "비밀번호가 틀렸습니다." }, { status: 403 });
  }

  const { error } = await supabaseAdmin.from("comments").delete().eq("id", id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
