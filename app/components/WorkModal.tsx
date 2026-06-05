"use client";

import { useEffect, useRef, useState } from "react";

type Work = {
  id: string;
  title: string;
  wattpadUrl: string;
  accentColor: string;
  color: string;
};

export default function WorkModal({ work, onClose }: { work: Work; onClose: () => void }) {
  const [iframeState, setIframeState] = useState<"loading" | "loaded" | "blocked">("loading");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    // Wattpad는 X-Frame-Options: SAMEORIGIN — 로드 이벤트 없이 타임아웃으로 차단 감지
    timerRef.current = setTimeout(() => setIframeState("blocked"), 4000);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onClose]);

  const handleIframeLoad = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    try {
      // cross-origin 접근 시도 → 예외 = 차단됨
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      (document.querySelector("iframe") as HTMLIFrameElement)?.contentDocument?.title;
      setIframeState("loaded");
    } catch {
      setIframeState("blocked");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* 백드롭 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 모달 */}
      <div className="relative z-10 w-full max-w-4xl h-[85vh] flex flex-col rounded-sm overflow-hidden shadow-2xl bg-[#fdf8f3]">
        {/* 헤더 */}
        <div
          className="flex items-center justify-between px-5 py-3 flex-shrink-0"
          style={{ backgroundColor: work.accentColor }}
        >
          <div className="flex items-center gap-3">
            <WattpadIcon color={work.color} />
            <span className="text-sm tracking-widest font-medium" style={{ color: work.color }}>
              {work.title} — Wattpad
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={work.wattpadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs tracking-wider px-3 py-1.5 rounded-sm transition-opacity hover:opacity-75"
              style={{ backgroundColor: `${work.color}25`, color: work.color }}
              title="새 탭에서 열기"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
              </svg>
              Open
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-sm transition-opacity hover:opacity-75"
              style={{ backgroundColor: `${work.color}25`, color: work.color }}
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* iframe 영역 */}
        <div className="relative flex-1 overflow-hidden">
          {/* 로딩 스피너 */}
          {iframeState === "loading" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#fdf8f3] z-10">
              <div
                className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: `${work.accentColor}40`, borderTopColor: work.accentColor }}
              />
              <p className="text-xs tracking-widest text-[#9b7d65]">Loading Wattpad…</p>
            </div>
          )}

          {/* 차단 fallback */}
          {iframeState === "blocked" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[#fdf8f3] z-10 px-8">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${work.accentColor}12` }}
              >
                <WattpadIcon color={work.accentColor} size={28} />
              </div>
              <div className="text-center space-y-2">
                <p className="font-semibold text-[#2c1a0e]">Wattpad can&apos;t be embedded</p>
                <p className="text-sm text-[#9b7d65] leading-relaxed max-w-xs">
                  Wattpad blocks embedding in external pages for security.
                  <br />
                  Read the story directly on Wattpad.
                </p>
              </div>
              <a
                href={work.wattpadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-3.5 text-sm tracking-widest font-medium rounded-sm transition-opacity hover:opacity-85"
                style={{ backgroundColor: work.accentColor, color: work.color }}
              >
                <WattpadIcon color={work.color} />
                Read on Wattpad
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                </svg>
              </a>
            </div>
          )}

          <iframe
            src={work.wattpadUrl}
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            title={`${work.title} on Wattpad`}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </div>
    </div>
  );
}

function WattpadIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M4 4l3.5 12L10 8l2.5 8L16 4h4l-5.5 16L12 12l-2.5 8L4 4z" />
    </svg>
  );
}
