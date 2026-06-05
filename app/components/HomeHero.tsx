"use client";

import { useMusicContext } from "../context/MusicContext";

function BookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b4c35" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b4c35" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b4c35" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}


export default function HomeHero() {
  const { currentTrackTitle } = useMusicContext();


  return (
    <>
    <section
      className="relative overflow-hidden"
      style={{
        paddingTop: "68px",
        minHeight: "560px",
        backgroundImage: "url('/hero-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* 텍스트 가독성을 위한 미세 오버레이 */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(255,252,245,0.12)" }}
      />
      {/* Bottom fade to page background */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "90px",
          background: "linear-gradient(to top, rgba(253,248,243,1) 0%, rgba(253,248,243,0.5) 50%, transparent 100%)",
        }}
      />

      {/* ── Eunpunggol village sign ── */}
      <div className="absolute left-10 top-1/2 -translate-y-6 hidden xl:flex flex-col items-center z-10">
        <div
          className="w-[88px] h-[88px] rounded-full flex flex-col items-center justify-center shadow-md"
          style={{
            background: "rgba(198,170,118,0.88)",
            border: "3px solid rgba(90,58,26,0.55)",
          }}
        >
          <span className="text-[11px] font-bold text-[#2c1a0e]">은풍골</span>
          <div className="w-12 h-px my-1" style={{ background: "rgba(90,58,26,0.35)" }} />
          <span className="text-[8px] text-[#5a3a1a]">Eunpunggol</span>
        </div>
        <div className="w-2.5 h-16" style={{ background: "rgba(90,58,26,0.55)", marginTop: "-2px", borderRadius: "0 0 2px 2px" }} />
      </div>

      {/* ── Main layout ── */}
      <div
        className="relative z-10 max-w-[1440px] mx-auto px-8 flex gap-6 items-center"
        style={{ minHeight: "490px", paddingTop: "28px", paddingBottom: "48px" }}
      >
        {/* Hero center content */}
        <div className="flex-1 flex flex-col items-center text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center px-4 py-1.5 rounded-full mb-5 shadow-sm"
            style={{
              background: "rgba(188,148,72,0.82)",
              backdropFilter: "blur(6px)",
            }}
          >
            <span className="text-[11px] font-semibold tracking-wide" style={{ color: "rgba(255,248,228,0.95)" }}>
              Little Groom Season 5
            </span>
          </div>

          {/* Main title */}
          <h1
            className="font-bold mb-3"
            style={{
              fontSize: "clamp(54px, 7.5vw, 80px)",
              color: "#18100a",
              textShadow: "0 2px 20px rgba(255,255,255,0.55)",
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
            }}
          >
            꼬마신랑
          </h1>

          {/* Subtitle */}
          <p
            className="mb-9 font-medium"
            style={{
              fontSize: "15px",
              color: "#2c1a0e",
              textShadow: "0 1px 12px rgba(255,255,255,0.75)",
            }}
          >
            삶과 죽음이 함께 살던 마을, 은풍골
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* 작가노트 */}
            <a
              href="/author-note"
              className="flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-200 hover:shadow-lg"
              style={{
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.75)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              }}
            >
              <BookIcon />
              <div className="text-left">
                <div className="text-[10px] text-[#9b7d65] font-medium leading-none mb-0.5">작가의 이야기</div>
                <div className="text-sm font-bold text-[#2c1a0e] leading-none">작가노트 →</div>
              </div>
            </a>

            {/* 최신작 */}
            <a
              href="/viewer/friends"
              className="relative flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-200 hover:shadow-lg"
              style={{
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.75)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              }}
            >
              <span
                className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold px-2 py-0.5 rounded-full text-white whitespace-nowrap"
                style={{ background: "#e03030" }}
              >
                NEW
              </span>
              <StarIcon />
              <div className="text-left">
                <div className="text-[10px] text-[#9b7d65] font-medium leading-none mb-0.5">최신작</div>
                <div className="text-sm font-bold text-[#2c1a0e] leading-none">Friends →</div>
              </div>
            </a>

            {/* 세계로 들어가기 */}
            <a
              href="/universe"
              className="flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-200 hover:shadow-lg"
              style={{
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.75)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              }}
            >
              <MapIcon />
              <div className="text-left">
                <div className="text-[10px] text-[#9b7d65] font-medium leading-none mb-0.5">세계로 들어가기</div>
                <div className="text-sm font-bold text-[#2c1a0e] leading-none">세계관 →</div>
              </div>
            </a>
          </div>
        </div>

      </div>
    </section>

    </>
  );
}
