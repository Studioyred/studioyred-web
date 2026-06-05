"use client";
import { useState, useRef } from "react";

export type CharEntry = { file: string; label: string };

const PAGE_BG = "#F5EDE0";
const ACCENT  = "#C97A3C";
const INK     = "#2A1A08";

const TAB_COLORS = [
  "#F5E6C8","#D4E8C2","#C8DDF0","#F0D4D4",
  "#D4C8EC","#F0E4B4","#C8E8E0","#F0CCB4",
  "#D4E0F0","#ECCCC8","#D0ECD4","#E8D4F0",
  "#F4E0B8","#C8E0EC","#ECDCC8","#D8F0D4",
  "#F0D8E8","#C8D8F4",
];

const TAB_ICONS = [
  "📖","⭐","♡","👿","✉","✏","🕵","👑",
  "👻","🌟","🌸","🎩","🧪","⚗️","🧔","💀",
  "🎵","🌙",
];

type AnimPhase = "idle" | "out" | "in";


export default function CharactersClient({ chars }: { chars: CharEntry[] }) {
  const [activeIdx,  setActiveIdx]  = useState(0);
  const [displayIdx, setDisplayIdx] = useState(0);
  const [phase, setPhase] = useState<AnimPhase>("idle");
  const nextIdx = useRef(0);

  const go = (idx: number) => {
    if (idx === displayIdx || phase !== "idle") return;
    setActiveIdx(idx);
    nextIdx.current = idx;
    setPhase("out");
  };

  const onAnimEnd = () => {
    if (phase === "out") {
      setDisplayIdx(nextIdx.current);
      setPhase("in");
    } else if (phase === "in") {
      setPhase("idle");
    }
  };

  if (!chars.length) return null;

  const cur = chars[displayIdx];

  const animStyle = {
    animationDuration: "0.5s",
    animationFillMode: "forwards" as const,
    animationTimingFunction: "cubic-bezier(0.4,0,0.2,1)",
    animationName:
      phase === "out" ? "flipPageOut" :
      phase === "in"  ? "flipPageIn"  : "none",
    transformOrigin: phase === "in" ? "right center" : "left center",
  };

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden" }}>
      {/* Video BG */}
      <video autoPlay loop muted playsInline style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover", zIndex: 0,
      }}>
        <source src="/assets/character.mp4" type="video/mp4" />
      </video>
      <audio autoPlay loop style={{ display: "none" }}>
        <source src="/assets/character.mp3" type="audio/mpeg" />
      </audio>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.28)", zIndex: 1 }} />

      {/* Header */}
      <header style={{
        position: "relative", zIndex: 10, height: "44px",
        background: "rgba(4,2,1,0.38)", backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(168,143,106,0.18)",
        display: "flex", alignItems: "center", padding: "0 20px", gap: "8px",
      }}>
        <a href="/" style={{ color: "rgba(255,245,220,0.90)", fontSize: "14px", fontWeight: 700, textDecoration: "none" }}>
          StudioY<span style={{ color: ACCENT }}>Red</span>
        </a>
        <span style={{ color: "rgba(255,245,220,0.25)" }}>/</span>
        <span style={{ color: "rgba(255,245,220,0.65)", fontSize: "13px" }}>등장인물</span>
      </header>

      {/* Body — 고정 너비 가운데 정렬, 배경 영상 양쪽 노출 */}
      <div style={{
        position: "relative", zIndex: 2,
        height: "calc(100vh - 44px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "stretch",
        padding: "20px 60px",
        boxSizing: "border-box",
      }}>
        {/* 고정폭 컨테이너 */}
        <div style={{ width: "min(1280px, 100%)", display: "flex", gap: 0, boxShadow: "0 10px 52px rgba(0,0,0,0.46)" }}>

        {/* ── 노트 페이지 ── */}
        <div style={{
          flex: 1, position: "relative",
          background: PAGE_BG,
          overflow: "hidden",
          display: "flex", flexDirection: "column",
        }}>

          {/* ── 페이지 컨텐츠 (애니메이션 대상) ── */}
          {/* ── 공통 레이아웃: 이미지 메인 + 오른쪽 정보 패널 ── */}
          <div
            key={displayIdx}
            onAnimationEnd={onAnimEnd}
            style={{
              ...animStyle,
              flex: 1, minHeight: 0,
              display: "flex",
              overflow: "hidden",
              position: "relative", zIndex: 1,
            }}
          >
            {/* 이미지 영역 — 항상 메인 */}
            <div style={{
              flex: 1, minWidth: 0,
              overflowX: "auto", overflowY: "hidden",
              display: "flex", alignItems: "center",
              justifyContent: "center",
            }}>
              <img
                src={`/assets/characters/${cur.file}`}
                alt={cur.label}
                style={{
                  height: "100%",
                  width: "auto",
                  display: "block",
                  flexShrink: 0,
                  maxWidth: "none",
                }}
              />
            </div>

            {/* 이름 레이블 */}
            <div style={{
              position: "absolute", bottom: "12px", left: "50%",
              transform: "translateX(-50%)",
              fontSize: "14px", fontWeight: 700, color: INK,
              background: "rgba(245,237,224,0.92)",
              padding: "5px 20px", borderRadius: "3px",
              border: "1px solid rgba(168,143,106,0.28)",
              whiteSpace: "nowrap", pointerEvents: "none",
              zIndex: 2,
            }}>
              {cur.label}
            </div>
          </div>
        </div>

        {/* ── OneNote 2010 견출지 탭 ── */}
        <div style={{
          width: "104px", flexShrink: 0,
          display: "flex", flexDirection: "column",
          borderRadius: "0 4px 4px 0",
          overflow: "hidden",
          boxShadow: "6px 0 20px rgba(0,0,0,0.24)",
        }}>
          {chars.map((c, i) => {
            const isActive = activeIdx === i;
            return (
              <button
                key={c.file}
                onClick={() => go(i)}
                title={c.label}
                style={{
                  flex: 1, minHeight: 0, width: "104px", border: "none",
                  borderBottom: i < chars.length - 1
                    ? "1px solid rgba(255,255,255,0.30)"
                    : "none",
                  background: isActive ? PAGE_BG : TAB_COLORS[i % TAB_COLORS.length],
                  cursor: "pointer",
                  transition: "background 0.15s",
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "0 10px",
                  boxShadow: isActive ? `inset 4px 0 0 ${ACCENT}` : "none",
                  filter: isActive ? "none" : "brightness(0.93)",
                }}
              >
                <span style={{ fontSize: "13px", flexShrink: 0, opacity: isActive ? 1 : 0.75 }}>
                  {TAB_ICONS[i] ?? "•"}
                </span>
                <span style={{
                  fontSize: "11.5px",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? INK : "rgba(40,28,14,0.72)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  lineHeight: 1.2,
                }}>
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>
        </div>{/* 고정폭 컨테이너 */}
      </div>{/* body */}

      <style>{`
        /* 오른쪽→왼쪽 책장 넘기기: 현재 페이지가 왼쪽으로 접혀나가고, 새 페이지가 오른쪽에서 펼쳐짐 */
        @keyframes flipPageOut {
          0%   { transform: perspective(1400px) rotateY(0deg);    opacity: 1; }
          40%  { opacity: 0.4; }
          100% { transform: perspective(1400px) rotateY(-90deg);  opacity: 0; }
        }
        @keyframes flipPageIn {
          0%   { transform: perspective(1400px) rotateY(90deg);   opacity: 0; }
          60%  { opacity: 0.4; }
          100% { transform: perspective(1400px) rotateY(0deg);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
