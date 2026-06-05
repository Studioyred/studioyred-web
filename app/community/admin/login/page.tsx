"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase/client";
import HomeHeader from "@/app/components/HomeHeader";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (error) { setError("이메일 또는 비밀번호가 올바르지 않습니다."); return; }
    router.push("/community");
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: "8px",
    border: "1px solid rgba(232,201,160,0.5)", background: "#fff",
    fontSize: "14px", color: "#2c1a0e", outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ background: "#fdf8f3", minHeight: "100vh" }}>
      <HomeHeader />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", paddingTop: "68px" }}>
        <div style={{ width: "100%", maxWidth: "400px", padding: "40px 32px", background: "#fff", borderRadius: "16px", border: "1px solid rgba(232,201,160,0.4)", boxShadow: "0 8px 32px rgba(80,40,10,0.08)" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#2c1a0e", marginBottom: "6px", textAlign: "center" }}>관리자 로그인</h1>
          <p style={{ fontSize: "13px", color: "#9b7d65", textAlign: "center", marginBottom: "28px" }}>Studio Y Red 관리자 전용</p>

          <form onSubmit={login} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#6b4c35", marginBottom: "6px" }}>이메일</label>
              <input style={inputStyle} type="email" placeholder="admin@example.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#6b4c35", marginBottom: "6px" }}>비밀번호</label>
              <input style={inputStyle} type="password" placeholder="비밀번호" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required />
            </div>
            {error && <p style={{ color: "#dc2626", fontSize: "13px", margin: 0 }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              style={{ padding: "12px", borderRadius: "8px", border: "none", background: "#2c1a0e", color: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer", opacity: loading ? 0.6 : 1, marginTop: "4px" }}
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
