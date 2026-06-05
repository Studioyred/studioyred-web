"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HomeHeader from "@/app/components/HomeHeader";
import HomeFooter from "@/app/components/HomeFooter";

const C = { border: "rgba(232,201,160,0.5)", text: "#2c1a0e", sub: "#6b4c35", muted: "#9b7d65" } as const;

export default function WritePage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "", nickname: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError("제목과 내용을 입력해주세요.");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/community/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) { setError(data.error); return; }
    router.push(`/community/${data.id}`);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: "8px",
    border: `1px solid ${C.border}`, background: "#fff",
    fontSize: "14px", color: C.text, outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ background: "#fdf8f3", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HomeHeader />
      <main style={{ flex: 1, paddingTop: "68px" }}>
        <section style={{
          padding: "40px 32px 32px", textAlign: "center",
          background: "linear-gradient(to bottom, #f5e8d4 0%, #fdf8f3 100%)",
          borderBottom: "1px solid rgba(232,201,160,0.35)",
        }}>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: C.text, margin: 0 }}>글쓰기</h1>
        </section>

        <div style={{ maxWidth: "720px", margin: "40px auto", padding: "0 24px 64px" }}>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: C.sub, marginBottom: "6px" }}>닉네임</label>
                <input style={inputStyle} placeholder="익명" value={form.nickname} onChange={(e) => set("nickname", e.target.value)} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: C.sub, marginBottom: "6px" }}>비밀번호 <span style={{ color: C.muted, fontWeight: 400 }}>(글 삭제 시 사용)</span></label>
                <input style={inputStyle} type="password" placeholder="비밀번호 입력" value={form.password} onChange={(e) => set("password", e.target.value)} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: C.sub, marginBottom: "6px" }}>제목 *</label>
              <input style={inputStyle} placeholder="제목을 입력하세요" value={form.title} onChange={(e) => set("title", e.target.value)} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: C.sub, marginBottom: "6px" }}>내용 *</label>
              <textarea
                style={{ ...inputStyle, height: "260px", resize: "vertical", fontFamily: "inherit", lineHeight: 1.7 }}
                placeholder="내용을 입력하세요"
                value={form.content}
                onChange={(e) => set("content", e.target.value)}
              />
            </div>

            {error && <p style={{ color: "#dc2626", fontSize: "13px", margin: 0 }}>{error}</p>}

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => router.back()}
                style={{ padding: "10px 22px", borderRadius: "8px", border: `1px solid ${C.border}`, background: "#fff", color: C.sub, fontSize: "14px", cursor: "pointer" }}
              >
                취소
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{ padding: "10px 28px", borderRadius: "8px", border: "none", background: "#2c1a0e", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer", opacity: submitting ? 0.6 : 1 }}
              >
                {submitting ? "등록 중..." : "등록하기"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}
