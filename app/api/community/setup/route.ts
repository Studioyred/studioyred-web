import { supabaseAdmin } from "@/app/lib/supabase/admin";

export const runtime = "nodejs";

// 관리자 계정 최초 1회 생성용 — 생성 후 이 라우트는 비활성화해도 됩니다.
export async function POST() {
  const email = process.env.ADMIN_EMAIL!;
  const password = "Shenping1@@";

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
  return Response.json({ ok: true, user: data.user?.email });
}
