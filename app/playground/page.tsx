"use client";

import { useState } from "react";
import HomeHeader from "@/app/components/HomeHeader";

// 각 게임 카드의 클릭 영역 (이미지 기준 %)
const HOTSPOTS = [
  { title: "장애물 달리기", href: "/games/obstacle/obstacle.html", left: 28.0, top: 36, width: 15, height: 35 },
  { title: "곤충 채집",     href: "/games/bugs/bug_catch_game.html", left: 44.5, top: 36, width: 15, height: 35 },
  { title: "구슬치기",      href: "/games/bubble/bubble.html",      left: 61.0, top: 36, width: 15, height: 35 },
  { title: "연날리기",      href: "/games/kite/kite.html",          left: 77.5, top: 36, width: 15, height: 35 },
];

export default function PlaygroundPage() {
  const [toast, setToast] = useState(false);

  function handleClick(href: string | null) {
    if (href) { window.location.href = href; return; }
    setToast(true);
    setTimeout(() => setToast(false), 2200);
  }

  return (
    <div style={{ background: "#0a0604", minHeight: "100vh" }}>
      <HomeHeader />

      <a
        href="/"
        style={{
          position: "fixed", bottom: "24px", left: "20px", zIndex: 9999,
          display: "flex", alignItems: "center", gap: "6px",
          padding: "8px 18px",
          background: "rgba(10,6,4,0.75)", color: "#e8c9a0",
          fontSize: "13px", fontWeight: 600,
          textDecoration: "none", borderRadius: "99px",
          border: "1px solid rgba(232,201,160,0.35)",
          backdropFilter: "blur(8px)",
        }}
      >
        ← 메인
      </a>

      <div style={{ paddingTop: "68px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 68px)" }}>
        {/* 1536:1024 비율 고정 컨테이너 */}
        <div
          style={{
            position: "relative",
            width: "min(100vw, calc((100vh - 68px) * 1.5))",
            aspectRatio: "1536 / 1024",
          }}
        >
          {/* 배경 이미지 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/playground.png"
            alt="놀이터"
            style={{ width: "100%", height: "100%", display: "block" }}
          />

          {/* 투명 클릭 영역 */}
          {HOTSPOTS.map((spot) => (
            <div
              key={spot.title}
              onClick={() => handleClick(spot.href)}
              title={spot.href ? spot.title : `${spot.title} (준비 중)`}
              style={{
                position: "absolute",
                left: `${spot.left}%`,
                top: `${spot.top}%`,
                width: `${spot.width}%`,
                height: `${spot.height}%`,
                cursor: spot.href ? "pointer" : "not-allowed",
                borderRadius: "8px",
                border: "2px solid red", // 위치 확인용 — 맞으면 지울게요
              }}
            />
          ))}
        </div>
      </div>

      {/* 준비 중 토스트 */}
      {toast && (
        <div style={{
          position: "fixed", bottom: "40px", left: "50%", transform: "translateX(-50%)",
          background: "rgba(44,26,14,0.92)", color: "#e8c9a0",
          padding: "12px 28px", borderRadius: "99px",
          fontSize: "14px", fontWeight: 600,
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          zIndex: 100, backdropFilter: "blur(8px)",
          border: "1px solid rgba(232,201,160,0.3)",
        }}>
          🚧 곧 오픈 예정입니다!
        </div>
      )}
    </div>
  );
}
