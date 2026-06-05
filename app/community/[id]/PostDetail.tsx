"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase/client";

type Post = {
  id: string; title: string; content: string;
  nickname: string; is_notice: boolean; created_at: string;
};
type Comment = {
  id: string; content: string; nickname: string; created_at: string;
};

const C = {
  border: "rgba(232,201,160,0.4)", text: "#2c1a0e",
  sub: "#6b4c35", muted: "#9b7d65", accent: "#c9a068",
} as const;

function fmt(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

const inputStyle: React.CSSProperties = {
  padding: "9px 13px", borderRadius: "8px", border: `1px solid ${C.border}`,
  background: "#fff", fontSize: "13px", color: C.text, outline: "none",
};

export default function PostDetail({ id }: { id: string }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const [commentForm, setCommentForm] = useState({ content: "", nickname: "", password: "" });
  const [commentError, setCommentError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        setIsAdmin(true);
        setToken(session.access_token);
      }
      await loadPost();
      await loadComments();
    })();
  }, [id]);

  async function loadPost() {
    setLoading(true);
    const res = await fetch(`/api/community/posts/${id}`);
    if (!res.ok) { router.push("/community"); return; }
    setPost(await res.json());
    setLoading(false);
  }

  async function loadComments() {
    const res = await fetch(`/api/community/posts/${id}/comments`);
    setComments(await res.json());
  }

  async function deletePost() {
    if (isAdmin) {
      if (!confirm("이 게시글을 삭제하시겠습니까?")) return;
      await fetch(`/api/community/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push("/community");
      return;
    }
    const pwd = prompt("비밀번호를 입력하세요.");
    if (!pwd) return;
    const res = await fetch(`/api/community/posts/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pwd }),
    });
    if (res.ok) router.push("/community");
    else alert("비밀번호가 틀렸습니다.");
  }

  async function deleteComment(commentId: string) {
    if (isAdmin) {
      if (!confirm("댓글을 삭제하시겠습니까?")) return;
      await fetch(`/api/community/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadComments();
      return;
    }
    const pwd = prompt("댓글 비밀번호를 입력하세요.");
    if (!pwd) return;
    const res = await fetch(`/api/community/comments/${commentId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pwd }),
    });
    if (res.ok) await loadComments();
    else alert("비밀번호가 틀렸습니다.");
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentForm.content.trim()) { setCommentError("댓글을 입력해주세요."); return; }
    setSubmitting(true);
    const res = await fetch(`/api/community/posts/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(commentForm),
    });
    setSubmitting(false);
    if (res.ok) {
      setCommentForm({ content: "", nickname: "", password: "" });
      setCommentError("");
      await loadComments();
    } else {
      const data = await res.json();
      setCommentError(data.error);
    }
  }

  if (loading) {
    return <div style={{ textAlign: "center", padding: "80px 0", color: C.muted }}>불러오는 중...</div>;
  }
  if (!post) return null;

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* 뒤로가기 */}
      <button
        onClick={() => router.push("/community")}
        style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", color: C.sub, fontSize: "13px", marginBottom: "24px", padding: 0 }}
      >
        ← 목록으로
      </button>

      {/* 게시글 */}
      <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden", marginBottom: "24px" }}>
        <div style={{ padding: "28px 28px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            {post.is_notice && (
              <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "99px", background: "#b85c00", color: "#fff" }}>공지</span>
            )}
            <h1 style={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 800, color: C.text, margin: 0 }}>{post.title}</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "13px", color: C.muted }}>{post.nickname} · {fmt(post.created_at)}</span>
            <button
              onClick={deletePost}
              style={{ fontSize: "12px", padding: "4px 12px", borderRadius: "6px", border: "1px solid #fca5a5", background: "#fff", color: "#dc2626", cursor: "pointer" }}
            >
              삭제
            </button>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, padding: "24px 28px", fontSize: "15px", color: C.text, lineHeight: 1.8, whiteSpace: "pre-wrap", minHeight: "160px" }}>
          {post.content}
        </div>
      </div>

      {/* 댓글 목록 */}
      <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden", marginBottom: "16px" }}>
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.border}`, fontSize: "13px", fontWeight: 700, color: C.text }}>
          댓글 {comments.length}개
        </div>
        {comments.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: C.muted, fontSize: "13px" }}>첫 댓글을 남겨보세요.</div>
        ) : (
          comments.map((c, i) => (
            <div key={c.id} style={{ padding: "16px 24px", borderBottom: i < comments.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: C.sub }}>{c.nickname}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "11px", color: C.muted }}>{fmt(c.created_at)}</span>
                  <button
                    onClick={() => deleteComment(c.id)}
                    style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "6px", border: "1px solid #fca5a5", background: "#fff", color: "#dc2626", cursor: "pointer" }}
                  >
                    삭제
                  </button>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: "14px", color: C.text, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{c.content}</p>
            </div>
          ))
        )}
      </div>

      {/* 댓글 작성 */}
      <form onSubmit={submitComment} style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: "12px", padding: "20px 24px" }}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            style={{ ...inputStyle, flex: 1 }}
            placeholder="닉네임 (기본: 익명)"
            value={commentForm.nickname}
            onChange={(e) => setCommentForm((f) => ({ ...f, nickname: e.target.value }))}
          />
          <input
            style={{ ...inputStyle, flex: 1 }}
            type="password"
            placeholder="비밀번호 (삭제 시 사용)"
            value={commentForm.password}
            onChange={(e) => setCommentForm((f) => ({ ...f, password: e.target.value }))}
          />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <textarea
            style={{ ...inputStyle, flex: 1, height: "72px", resize: "none", fontFamily: "inherit" }}
            placeholder="댓글을 입력하세요"
            value={commentForm.content}
            onChange={(e) => setCommentForm((f) => ({ ...f, content: e.target.value }))}
          />
          <button
            type="submit"
            disabled={submitting}
            style={{ padding: "0 20px", borderRadius: "8px", border: "none", background: "#2c1a0e", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer", opacity: submitting ? 0.6 : 1, flexShrink: 0 }}
          >
            등록
          </button>
        </div>
        {commentError && <p style={{ color: "#dc2626", fontSize: "12px", margin: "8px 0 0" }}>{commentError}</p>}
      </form>
    </div>
  );
}
