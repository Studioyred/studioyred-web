"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase/client";

type Post = {
  id: string;
  title: string;
  nickname: string;
  is_notice: boolean;
  created_at: string;
  comments: { count: number }[];
};

const C = {
  bg: "#fdf8f3",
  border: "rgba(232,201,160,0.4)",
  text: "#2c1a0e",
  sub: "#6b4c35",
  muted: "#9b7d65",
  accent: "#c9a068",
  noticeBg: "#fff8ee",
  noticeBadge: "#b85c00",
} as const;

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export default function CommunityList() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        setIsAdmin(true);
        setToken(session.access_token);
      }
      await loadPosts();
    })();
  }, []);

  async function loadPosts() {
    setLoading(true);
    try {
      const res = await fetch("/api/community/posts");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch {
      setPosts([]);
    }
    setLoading(false);
  }

  async function deletePost(id: string) {
    if (!confirm("이 게시글을 삭제하시겠습니까?")) return;
    await fetch(`/api/community/posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    await loadPosts();
  }

  async function toggleNotice(post: Post) {
    await fetch(`/api/community/posts/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ is_notice: !post.is_notice }),
    });
    await loadPosts();
  }

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "32px 24px 64px" }}>
      {/* 상단 바 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <span style={{ fontSize: "13px", color: C.muted }}>총 {posts.length}개의 글</span>
        <div style={{ display: "flex", gap: "8px" }}>
          {isAdmin && (
            <span style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "99px", background: "#2c1a0e", color: "#fff", fontWeight: 600 }}>
              관리자
            </span>
          )}
          <button
            onClick={() => router.push("/community/write")}
            style={{
              padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer",
              background: "#2c1a0e", color: "#fff", fontSize: "13px", fontWeight: 600,
            }}
          >
            글쓰기
          </button>
        </div>
      </div>

      {/* 게시글 목록 */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "64px 0", color: C.muted }}>불러오는 중...</div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 0", color: C.muted }}>첫 글을 남겨보세요!</div>
      ) : (
        <div style={{ border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden", background: "#fff" }}>
          {posts.map((post, i) => (
            <div
              key={post.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "14px 20px",
                borderBottom: i < posts.length - 1 ? `1px solid ${C.border}` : "none",
                background: post.is_notice ? C.noticeBg : "#fff",
                gap: "12px",
              }}
            >
              {/* 공지 배지 */}
              {post.is_notice && (
                <span style={{
                  flexShrink: 0, fontSize: "10px", fontWeight: 700,
                  padding: "2px 8px", borderRadius: "99px",
                  background: C.noticeBadge, color: "#fff", letterSpacing: "0.05em",
                }}>
                  공지
                </span>
              )}

              {/* 제목 */}
              <a
                href={`/community/${post.id}`}
                style={{ flex: 1, fontSize: "14px", fontWeight: post.is_notice ? 700 : 400, color: C.text, textDecoration: "none", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              >
                {post.title}
              </a>

              {/* 메타 */}
              <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", color: C.muted }}>
                <span>{post.nickname}</span>
                <span>{fmt(post.created_at)}</span>
                {post.comments?.[0]?.count > 0 && (
                  <span style={{ color: C.accent }}>💬 {post.comments[0].count}</span>
                )}
              </div>

              {/* 관리자 버튼 */}
              {isAdmin && (
                <div style={{ flexShrink: 0, display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => toggleNotice(post)}
                    style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "6px", border: `1px solid ${C.border}`, background: post.is_notice ? C.noticeBadge : "#fff", color: post.is_notice ? "#fff" : C.sub, cursor: "pointer" }}
                  >
                    {post.is_notice ? "공지해제" : "공지"}
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "6px", border: "1px solid #fca5a5", background: "#fff", color: "#dc2626", cursor: "pointer" }}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
