"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { TOC } from "../../lib/toc";
import { WORK_DATA, type OstTrack } from "../../lib/work-data";

type Chapter = { id: string; title: string; content: string; content_ko?: string; images?: string[]; };
type Mode = "en" | "ko" | "webtoon";
const FONT_SIZES = ["text-sm", "text-base", "text-lg"] as const;
type FontSize = (typeof FONT_SIZES)[number];

// warm-white text (for center / dark bg)
const tw = (a: number) => `rgba(255,245,220,${a})`;
// panel colors (light ivory / beige)
const PANEL        = "rgba(240,228,208,0.88)";
const PANEL_BORDER = "rgba(168,143,106,0.22)";
const PANEL_TEXT   = "#2F3A4A";
const PANEL_SUB    = "#7A8A96";
const PANEL_FAINT  = "#A8B4BC";
const BORDER       = PANEL_BORDER;

// ── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ value, onChange, accent }: { value: boolean; onChange: (v: boolean) => void; accent: string }) {
  return (
    <button onClick={() => onChange(!value)} style={{
      width: "38px", height: "20px", borderRadius: "10px", border: "none", cursor: "pointer",
      background: value ? accent : "rgba(255,255,255,0.18)", position: "relative", flexShrink: 0,
      transition: "background 0.2s",
    }}>
      <span style={{
        position: "absolute", top: "3px", left: value ? "20px" : "3px",
        width: "14px", height: "14px", borderRadius: "50%", background: "white",
        transition: "left 0.18s", display: "block",
      }} />
    </button>
  );
}

// ── Slider ────────────────────────────────────────────────────────────────────
function Slider({ label, min, max, step, value, onChange, leftIcon, rightIcon }: {
  label: string; min: number; max: number; step: number; value: number;
  onChange: (v: number) => void; leftIcon?: React.ReactNode; rightIcon?: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ fontSize: "10px", color: tw(0.45), marginBottom: "4px", letterSpacing: "0.06em" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {leftIcon && <span style={{ color: tw(0.35), fontSize: "12px" }}>{leftIcon}</span>}
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(+e.target.value)}
          style={{ flex: 1, accentColor: tw(0.6), cursor: "pointer" }} />
        {rightIcon && <span style={{ color: tw(0.55), fontSize: "12px" }}>{rightIcon}</span>}
      </div>
    </div>
  );
}

// ── Settings Drawer ───────────────────────────────────────────────────────────
function SettingsDrawer({
  accent, brightness, blur, darkness, fontSize, textLight,
  showTime, autoOst, bgTransition,
  setBrightness, setBlur, setDarkness, setFontSize,
  setTextLight, setShowTime, setAutoOst, setBgTransition,
  epBgs, onUploadBg, chapterCount, workId, onClose,
}: {
  accent: string; brightness: number; blur: number; darkness: number;
  fontSize: FontSize; textLight: boolean;
  showTime: boolean; autoOst: boolean; bgTransition: boolean;
  setBrightness: (v: number) => void; setBlur: (v: number) => void;
  setDarkness: (v: number) => void; setFontSize: (v: FontSize) => void;
  setTextLight: (v: boolean) => void; setShowTime: (v: boolean) => void;
  setAutoOst: (v: boolean) => void; setBgTransition: (v: boolean) => void;
  epBgs: Record<number, string>; onUploadBg: (epIdx: number, file: File) => void;
  chapterCount: number; workId: string; onClose: () => void;
}) {
  const bgInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const fontSizes: FontSize[] = ["text-sm", "text-base", "text-lg"];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", justifyContent: "flex-end",
    }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />

      {/* Panel */}
      <div style={{
        position: "relative", width: "320px", height: "100%",
        background: "rgba(18,12,6,0.96)", backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderLeft: `1px solid ${BORDER}`,
        overflowY: "auto", display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: tw(0.85), letterSpacing: "0.06em" }}>설정</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: tw(0.45), padding: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div style={{ padding: "16px 18px", flex: 1 }}>

          {/* 배경 설정 */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: tw(0.40), marginBottom: "12px" }}>배경 설정</div>
            <Slider label="밝기" min={0.3} max={1.6} step={0.05} value={brightness} onChange={setBrightness} leftIcon="☾" rightIcon="☀" />
            <Slider label="블러" min={0} max={12} step={0.5} value={blur} onChange={setBlur} leftIcon="◎" rightIcon="◉" />
            <Slider label="어둡게 (가독성)" min={0} max={0.82} step={0.02} value={darkness} onChange={setDarkness} leftIcon="○" rightIcon="●" />
          </div>

          {/* 글자 설정 */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: tw(0.40), marginBottom: "12px" }}>글자 설정</div>
            <div style={{ marginBottom: "10px" }}>
              <div style={{ fontSize: "10px", color: tw(0.45), marginBottom: "6px" }}>글자 크기</div>
              <div style={{ display: "flex", gap: "6px" }}>
                {fontSizes.map((fs, i) => (
                  <button key={fs} onClick={() => setFontSize(fs)} style={{
                    flex: 1, padding: "5px 0", borderRadius: "6px", border: `1px solid ${fontSize === fs ? accent : BORDER}`,
                    background: fontSize === fs ? `${accent}20` : "transparent",
                    color: fontSize === fs ? accent : tw(0.45),
                    fontSize: i === 0 ? "11px" : i === 1 ? "13px" : "15px", cursor: "pointer",
                  }}>A{i === 0 ? "−" : i === 1 ? "" : "+"}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "10px", color: tw(0.45) }}>글자 색상 (밝게)</span>
              <Toggle value={textLight} onChange={setTextLight} accent={accent} />
            </div>
          </div>

          {/* 기타 설정 */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: tw(0.40), marginBottom: "12px" }}>기타 설정</div>
            {[
              { label: "자동 재생 (OST)", sub: "페이지 진입 시 OST 자동 재생", value: autoOst, set: setAutoOst },
              { label: "배경 전환 효과", sub: "부드러운 전환", value: bgTransition, set: setBgTransition },
              { label: "시간 표시", sub: "현재 시간 표시 (좌측 하단)", value: showTime, set: setShowTime },
            ].map(({ label, sub, value, set }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <div>
                  <div style={{ fontSize: "12px", color: tw(0.70) }}>{label}</div>
                  <div style={{ fontSize: "10px", color: tw(0.35), marginTop: "1px" }}>{sub}</div>
                </div>
                <Toggle value={value} onChange={set} accent={accent} />
              </div>
            ))}
          </div>

          {/* EP별 배경 */}
          {chapterCount > 0 && (
            <div>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: tw(0.40), marginBottom: "12px" }}>EP별 배경</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {Array.from({ length: chapterCount }).map((_, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <input
                      type="file" accept="image/*"
                      ref={el => { bgInputRefs.current[i] = el; }}
                      style={{ display: "none" }}
                      onChange={e => { if (e.target.files?.[0]) onUploadBg(i, e.target.files[0]); e.target.value = ""; }}
                    />
                    <button onClick={() => bgInputRefs.current[i]?.click()} style={{
                      width: "100%", aspectRatio: "16/9", borderRadius: "6px", border: `1px solid ${BORDER}`,
                      background: epBgs[i] ? "none" : "rgba(255,255,255,0.05)",
                      cursor: "pointer", overflow: "hidden", display: "block", padding: 0,
                    }}>
                      {epBgs[i]
                        ? <img src={epBgs[i]} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={`EP${i+1} bg`} />
                        : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "4px" }}>
                            <span style={{ fontSize: "16px", color: tw(0.20) }}>+</span>
                            <span style={{ fontSize: "9px", color: tw(0.25) }}>EP {i + 1}</span>
                          </div>
                      }
                    </button>
                    {epBgs[i] && (
                      <span style={{
                        position: "absolute", bottom: "4px", left: "4px",
                        fontSize: "9px", background: "rgba(0,0,0,0.6)", color: "white",
                        padding: "1px 5px", borderRadius: "3px",
                      }}>EP {i + 1}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Episode List ──────────────────────────────────────────────────────────────
function EpisodeList({ id, accent, chapters, activeIdx, onSelect }: {
  id: string; accent: string; chapters: Chapter[]; activeIdx: number;
  onSelect: (idx: number, url: string) => void;
}) {
  const toc = TOC[id];
  const [openSeasons, setOpenSeasons] = useState<Set<number>>(() => {
    if (!toc || toc.kind !== "seasons") return new Set();
    return new Set(toc.seasons.map(s => s.num));
  });

  if (!toc) return <p style={{ padding: "12px 14px", fontSize: "11px", color: PANEL_FAINT }}>목차 없음</p>;
  const idToIdx = new Map(chapters.map((ch, i) => [ch.id, i]));

  const EpRow = ({ epId, epUrl, title, num, indent = false }: {
    epId: number; epUrl: string; title: string; num: string; indent?: boolean;
  }) => {
    const localIdx = idToIdx.get(String(epId));
    const hasLocal = localIdx !== undefined;
    const isActive = hasLocal && localIdx === activeIdx;
    return (
      <button onClick={() => onSelect(localIdx ?? -1, epUrl)} style={{
        width: "100%", display: "flex", alignItems: "flex-start", gap: "7px",
        padding: `5px 14px 5px ${indent ? "22px" : "14px"}`,
        background: isActive ? `${accent}18` : "none",
        border: "none", cursor: "pointer", textAlign: "left",
        borderLeft: isActive ? `2px solid ${accent}` : "2px solid transparent",
      }}>
        <span style={{ fontSize: "8px", color: isActive ? accent : PANEL_FAINT, marginTop: "3px", flexShrink: 0 }}>
          {isActive ? "●" : "•"}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "9px", color: PANEL_FAINT, marginBottom: "1px" }}>EP {num}</div>
          <div style={{
            fontSize: "11px", lineHeight: 1.35, fontWeight: isActive ? 600 : 400,
            color: isActive ? accent : hasLocal ? PANEL_TEXT : PANEL_FAINT,
          }}>{title}</div>
          {!hasLocal && <div style={{ fontSize: "9px", color: PANEL_FAINT, marginTop: "1px" }}>Coming Soon</div>}
        </div>
      </button>
    );
  };

  if (toc.kind === "flat") {
    return (
      <div style={{ paddingTop: "4px" }}>
        {toc.episodes.map((ep, i) => (
          <EpRow key={ep.id} epId={ep.id} epUrl={ep.url} title={ep.title} num={String(i+1).padStart(2,"0")} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "4px" }}>
      {toc.seasons.map(season => {
        const isOpen = openSeasons.has(season.num);
        const toggle = () => setOpenSeasons(prev => {
          const next = new Set(prev);
          if (next.has(season.num)) next.delete(season.num); else next.add(season.num);
          return next;
        });
        return (
          <div key={season.num}>
            <button onClick={toggle} style={{
              width: "100%", display: "flex", alignItems: "center", gap: "5px",
              padding: "5px 14px", background: "none", border: "none", cursor: "pointer",
            }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={PANEL_SUB} strokeWidth="2.5"
                style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>
                <path d="m9 18 6-6-6-6"/>
              </svg>
              <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: PANEL_SUB }}>
                Season {season.num}
              </span>
              <span style={{ marginLeft: "auto", fontSize: "9px", color: PANEL_FAINT }}>{season.episodes.length}화</span>
            </button>
            {isOpen && season.episodes.map((ep, i) => (
              <EpRow key={ep.id} epId={ep.id} epUrl={ep.url} title={ep.title}
                num={String(i+1).padStart(2,"0")} indent />
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ── Music Player ──────────────────────────────────────────────────────────────
function MusicPlayer({ tracks, accent, autoPlay }: { tracks: OstTrack[]; accent: string; autoPlay: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [vol, setVol] = useState(0.45);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [trackIdx, setTrackIdx] = useState(0);

  const allTracks = tracks.length > 0 ? tracks : [{ title: "Pressure Points", artist: "Camel" }];
  const track = allTracks[trackIdx % allTracks.length];

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = "/assets/study_room.mp3";
    audioRef.current.volume = vol;
    if (autoPlay) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {
        const start = () => { audioRef.current?.play().then(() => setPlaying(true)).catch(() => {}); };
        document.addEventListener("click", start, { once: true });
        document.addEventListener("keydown", start, { once: true });
      });
    }
  }, []);

  useEffect(() => {
    const a = audioRef.current; if (!a) return;
    const onTime = () => setCur(a.currentTime);
    const onDur = () => setDur(a.duration || 0);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onDur);
    return () => { a.removeEventListener("timeupdate", onTime); a.removeEventListener("loadedmetadata", onDur); };
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play().catch(() => {}); setPlaying(true); }
  };
  const prev = () => setTrackIdx(i => (i - 1 + allTracks.length) % allTracks.length);
  const next = () => setTrackIdx(i => (i + 1) % allTracks.length);
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div style={{ padding: "10px 14px 12px", borderTop: `1px solid ${BORDER}` }}>
      <audio ref={audioRef} loop />
      <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "8px" }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2">
          <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
        </svg>
        <span style={{ fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: PANEL_SUB }}>Now Playing</span>
      </div>

      {/* Track info */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <div style={{
          width: "34px", height: "34px", borderRadius: "5px", flexShrink: 0,
          background: `${accent}22`, border: `1px solid ${accent}35`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill={accent} opacity={0.7}>
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "11px", fontWeight: 600, color: PANEL_TEXT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{track.title}</div>
          <div style={{ fontSize: "10px", color: PANEL_SUB }}>{track.artist}</div>
        </div>
      </div>

      {/* Progress */}
      <input type="range" min={0} max={dur || 100} step={0.1} value={cur}
        onChange={e => { if (audioRef.current) audioRef.current.currentTime = +e.target.value; }}
        style={{ width: "100%", accentColor: accent, cursor: "pointer" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: PANEL_FAINT, margin: "1px 0 6px" }}>
        <span>{fmt(cur)}</span><span>{fmt(dur)}</span>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "18px" }}>
        <button onClick={prev} style={{ background: "none", border: "none", cursor: "pointer", color: PANEL_SUB, padding: 0 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
        </button>
        <button onClick={toggle} style={{
          width: "28px", height: "28px", borderRadius: "50%", border: `1.5px solid ${accent}`,
          background: playing ? accent : "transparent", color: playing ? "white" : accent,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {playing
            ? <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6zm8-14v14h4V5z"/></svg>
            : <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          }
        </button>
        <button onClick={next} style={{ background: "none", border: "none", cursor: "pointer", color: PANEL_SUB, padding: 0 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zm2-8.14 4.96 2.14L8 14.14V9.86zM16 6h2v12h-2z"/></svg>
        </button>
      </div>

      {/* Volume */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px" }}>
        <span style={{ fontSize: "11px", color: PANEL_FAINT }}>◁</span>
        <input type="range" min={0} max={1} step={0.01} value={vol}
          onChange={e => { const v = +e.target.value; setVol(v); if (audioRef.current) audioRef.current.volume = v; }}
          style={{ flex: 1, accentColor: PANEL_SUB, cursor: "pointer" }}
        />
        <span style={{ fontSize: "11px", color: PANEL_SUB }}>▷</span>
      </div>
    </div>
  );
}

// ── OST Panel ─────────────────────────────────────────────────────────────────
function OstPanel({ tracks, accent }: { tracks: OstTrack[]; accent: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  if (tracks.length === 0) return null;
  return (
    <div>
      {tracks.map((t, i) => (
        <button key={i} onClick={() => setActiveIdx(i)} style={{
          width: "100%", display: "flex", alignItems: "center", gap: "8px",
          padding: "6px 0", background: "none", border: "none", cursor: "pointer",
          borderBottom: i < tracks.length - 1 ? `1px solid ${BORDER}` : "none", textAlign: "left",
        }}>
          <span style={{ fontSize: "10px", color: i === activeIdx ? accent : PANEL_FAINT, flexShrink: 0 }}>
            {i === activeIdx ? "▶" : "▷"}
          </span>
          <span style={{ fontSize: "11px", fontWeight: i === activeIdx ? 600 : 400, color: i === activeIdx ? accent : PANEL_TEXT }}>
            {t.title}
          </span>
          <span style={{ fontSize: "10px", color: PANEL_SUB, marginLeft: "2px" }}>— {t.artist}</span>
        </button>
      ))}
    </div>
  );
}

// ── Webtoon View ──────────────────────────────────────────────────────────────
function WebtoonView({ chapter, workId, accent, onSaveImages }: {
  chapter: Chapter; workId: string; accent: string; onSaveImages: (images: string[]) => Promise<void>;
}) {
  const [images, setImages] = useState<string[]>(chapter.images ?? []);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setImages(chapter.images ?? []); setEditing(false); }, [chapter.id]);

  const uploadFiles = useCallback(async (files: File[]) => {
    setUploading(true);
    const newUrls: string[] = [];
    for (const file of files) {
      try {
        const fd = new FormData();
        fd.append("file", file); fd.append("workId", workId); fd.append("chapterId", chapter.id);
        const res = await fetch("/api/webtoon/upload", { method: "POST", body: fd });
        const { url } = await res.json();
        if (url) newUrls.push(url);
      } catch { alert(`업로드 실패: ${file.name}`); }
    }
    setImages(prev => [...prev, ...newUrls]);
    setUploading(false);
  }, [workId, chapter.id]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) { uploadFiles(Array.from(e.target.files)); e.target.value = ""; }
  };
  const save = async () => { setSaving(true); await onSaveImages(images); setSaving(false); setEditing(false); };
  const cancel = () => { setImages(chapter.images ?? []); setEditing(false); };

  if (!editing && images.length === 0) {
    return (
      <div onClick={() => { setEditing(true); setTimeout(() => inputRef.current?.click(), 50); }}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: "10px", padding: "60px 20px", borderRadius: "10px",
          border: `2px dashed ${tw(0.20)}`, cursor: "pointer",
        }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={tw(0.25)} strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
        </svg>
        <p style={{ fontSize: "13px", color: tw(0.40) }}>웹툰 이미지 추가</p>
        <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleFileInput} />
      </div>
    );
  }

  if (!editing) {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
          <button onClick={() => setEditing(true)} style={{
            fontSize: "11px", padding: "3px 10px", borderRadius: "5px",
            border: `1px solid ${tw(0.20)}`, background: "transparent", color: tw(0.40), cursor: "pointer",
          }}>편집</button>
        </div>
        {images.map((url, i) => <img key={i} src={url} alt={`${i+1}p`} style={{ width: "100%", display: "block" }} loading="lazy" />)}
      </div>
    );
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleFileInput} />
      <div style={{ display: "flex", gap: "8px", marginBottom: "10px", position: "sticky", top: 0, background: "rgba(8,5,2,0.90)", padding: "6px 0", zIndex: 10 }}>
        <button onClick={() => inputRef.current?.click()} disabled={uploading}
          style={{ fontSize: "11px", padding: "3px 10px", border: `1px solid ${tw(0.20)}`, background: "transparent", color: tw(0.40), cursor: "pointer", borderRadius: "5px" }}>
          {uploading ? "업로드 중…" : "추가"}
        </button>
        <button onClick={save} disabled={saving || uploading}
          style={{ fontSize: "11px", padding: "3px 10px", border: "none", background: accent, color: "white", cursor: "pointer", borderRadius: "5px" }}>
          {saving ? "저장 중…" : "저장"}
        </button>
        <button onClick={cancel}
          style={{ fontSize: "11px", padding: "3px 10px", border: `1px solid ${tw(0.15)}`, background: "transparent", color: tw(0.30), cursor: "pointer", borderRadius: "5px" }}>
          취소
        </button>
      </div>
      {images.map((url, i) => (
        <div key={url + i} style={{ position: "relative", marginBottom: "2px" }}>
          <img src={url} alt={`${i+1}p`} style={{ width: "100%", display: "block" }} />
          <button onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} style={{
            position: "absolute", top: "6px", right: "6px", width: "20px", height: "20px",
            borderRadius: "4px", border: "none", background: "rgba(0,0,0,0.55)", color: "white", cursor: "pointer", fontSize: "10px",
          }}>✕</button>
        </div>
      ))}
      {images.length > 0 && (
        <div onClick={() => inputRef.current?.click()}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", cursor: "pointer", border: `2px dashed ${tw(0.15)}`, borderRadius: "6px", marginTop: "4px" }}>
          <span style={{ fontSize: "11px", color: tw(0.30) }}>+ 이미지 더 추가</span>
        </div>
      )}
    </div>
  );
}

// ── Clock ─────────────────────────────────────────────────────────────────────
function ClockWidget() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const h12 = now.getHours() % 12 || 12;
  const m = String(now.getMinutes()).padStart(2, "0");
  const ampm = now.getHours() >= 12 ? "PM" : "AM";
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return (
    <div style={{ padding: "6px 14px 10px", fontSize: "10px", color: PANEL_FAINT }}>
      {months[now.getMonth()]} {now.getDate()}, {days[now.getDay()]} · {h12}:{m} {ampm}
    </div>
  );
}

// ── Main Viewer ───────────────────────────────────────────────────────────────
export default function ViewerClient({ id }: { id: string }) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState<FontSize>("text-base");
  const [mode, setMode] = useState<Mode>("en");
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Background controls
  const [brightness, setBrightness] = useState(1.0);
  const [blur, setBlur] = useState(0);
  const [darkness, setDarkness] = useState(0.22);
  const [bgTransition, setBgTransition] = useState(true);

  // Text / display
  const [textLight, setTextLight] = useState(true);
  const [showTime, setShowTime] = useState(false);
  const [autoOst, setAutoOst] = useState(true);

  // EP backgrounds (stored in localStorage)
  const [epBgs, setEpBgs] = useState<Record<number, string>>({});

  const contentRef = useRef<HTMLDivElement>(null);
  const work = WORK_DATA[id] ?? { title: id, titleEn: id.toUpperCase(), accentColor: "#C97A3C", characters: [], ost: [] };
  const chapter = chapters[activeIdx];
  const accent = work.accentColor;
  const textColor = textLight ? tw(0.90) : "rgba(20,10,5,0.92)";

  // Load epBgs from localStorage
  useEffect(() => {
    try { setEpBgs(JSON.parse(localStorage.getItem(`epbg-${id}`) || '{}')); } catch { /* noop */ }
  }, [id]);

  // Sync like/bookmark per chapter
  const storageKey = `${id}-${activeIdx}`;
  useEffect(() => {
    setLiked(localStorage.getItem(`liked-${storageKey}`) === "1");
    setBookmarked(localStorage.getItem(`bm-${storageKey}`) === "1");
  }, [storageKey]);
  const toggleLike = () => { const n = !liked; setLiked(n); localStorage.setItem(`liked-${storageKey}`, n ? "1" : "0"); };
  const toggleBookmark = () => { const n = !bookmarked; setBookmarked(n); localStorage.setItem(`bm-${storageKey}`, n ? "1" : "0"); };

  useEffect(() => {
    document.documentElement.style.backgroundColor = "#08050200";
    document.body.style.backgroundColor = "#080502";
    return () => {
      document.documentElement.style.backgroundColor = "";
      document.body.style.backgroundColor = "";
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/story/${id}`)
      .then(r => r.json())
      .then(d => setChapters(d.chapters ?? []))
      .catch(() => setChapters([]))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { contentRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }, [activeIdx]);

  const saveChapters = useCallback(async (updated: Chapter[]) => {
    setChapters(updated);
    await fetch(`/api/story/${id}/save`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapters: updated }),
    });
  }, [id]);

  const handleSaveImages = useCallback(async (images: string[]) => {
    await saveChapters(chapters.map((ch, i) => i === activeIdx ? { ...ch, images } : ch));
  }, [chapters, activeIdx, saveChapters]);

  const handleUploadBg = useCallback(async (epIdx: number, file: File) => {
    const fd = new FormData();
    fd.append("file", file); fd.append("workId", id); fd.append("epIdx", String(epIdx));
    const res = await fetch("/api/ep-bg", { method: "POST", body: fd });
    const { url } = await res.json();
    if (url) {
      const next = { ...epBgs, [epIdx]: url };
      setEpBgs(next);
      localStorage.setItem(`epbg-${id}`, JSON.stringify(next));
    }
  }, [id, epBgs]);

  const TABS = [
    { key: "en" as Mode, label: "English" },
    { key: "ko" as Mode, label: "한국어" },
    { key: "webtoon" as Mode, label: "Webtoon" },
  ];

  const currentBg = epBgs[activeIdx] || null;
  const isFriendsWebtoon = id === "friends" && mode === "webtoon" && activeIdx <= 1;

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", background: "#080502" }}>

      {/* ── Background layer ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        transform: blur > 0 ? "scale(1.08)" : "scale(1)",
        transition: bgTransition ? "transform 0.3s" : "none",
        overflow: "hidden",
      }}>
        {currentBg
          ? <img src={currentBg} alt="" style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
              filter: `brightness(${brightness})${blur > 0 ? ` blur(${blur}px)` : ""}`,
              transition: bgTransition ? "opacity 0.6s" : "none",
            }} />
          : <video autoPlay loop muted playsInline style={{
              width: "100%", height: "100%", objectFit: "cover",
              filter: `brightness(${brightness})${blur > 0 ? ` blur(${blur}px)` : ""}`,
            }}>
              <source src="/assets/study_room.mp4" type="video/mp4" />
            </video>
        }
      </div>

      {/* ── Dark overlay for readability ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: `rgba(0,0,0,${darkness})`,
        pointerEvents: "none",
      }} />

      {/* ── Header ── */}
      <header style={{
        position: "relative", zIndex: 20, height: "44px", flexShrink: 0,
        display: "flex", alignItems: "center",
        background: "rgba(4,2,1,0.38)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${BORDER}`,
      }}>
        {/* Logo */}
        <div style={{ width: "190px", flexShrink: 0, padding: "0 14px", display: "flex", alignItems: "center" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontSize: "15px", fontWeight: 800, color: tw(0.88), letterSpacing: "0.02em" }}>
              StudioY<span style={{ color: accent }}>Red</span>
            </span>
          </Link>
        </div>

        {/* Breadcrumb */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: tw(0.38) }}>
          <Link href="/" style={{ color: tw(0.35), textDecoration: "none" }}>세계관 지도</Link>
          <span style={{ color: tw(0.20) }}>/</span>
          <span style={{ color: tw(0.50) }}>{work.title}</span>
          {chapter && <>
            <span style={{ color: tw(0.20) }}>/</span>
            <span style={{ color: tw(0.60), maxWidth: "240px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              EP {String(activeIdx+1).padStart(2,"0")} – {chapter.title}
            </span>
          </>}
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "0 16px", color: tw(0.50) }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
            {(["text-sm","text-base","text-lg"] as FontSize[]).map((fs, i) => (
              <button key={fs} onClick={() => setFontSize(fs)} style={{
                background: "none", border: "none", cursor: "pointer", padding: 0,
                fontSize: i === 0 ? "11px" : i === 1 ? "13px" : "15px",
                color: fontSize === fs ? accent : tw(0.42),
                fontWeight: fontSize === fs ? 700 : 400,
              }}>A</button>
            ))}
          </div>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ cursor: "pointer" }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <button onClick={() => setShowSettings(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", color: showSettings ? accent : tw(0.50), padding: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
            </svg>
          </button>
        </div>
      </header>

      {/* ── Three-column body ── */}
      <div style={{
        position: "relative", zIndex: 10,
        display: "grid", gridTemplateColumns: "190px 1fr 220px",
        height: "calc(100vh - 44px)", overflow: "hidden",
      }}>

        {/* ── LEFT PANEL ── */}
        <aside style={{
          display: "flex", flexDirection: "column",
          background: PANEL, borderRight: `1px solid ${BORDER}`,
          backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
          overflow: "hidden",
        }}>
          {/* Work label */}
          <div style={{ padding: "10px 14px 4px", flexShrink: 0, display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ color: accent, fontSize: "10px" }}>+</span>
            <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: PANEL_SUB }}>
              {work.titleEn}
            </span>
          </div>

          {/* Episode list */}
          <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
            <EpisodeList
              id={id} accent={accent} chapters={chapters} activeIdx={activeIdx}
              onSelect={(idx, url) => {
                if (idx >= 0) setActiveIdx(idx);
                else window.open(url, "_blank", "noopener,noreferrer");
              }}
            />
          </div>

          {/* Music player */}
          <MusicPlayer tracks={work.ost} accent={accent} autoPlay={autoOst} />

          {/* Clock */}
          {showTime && <ClockWidget />}
        </aside>

        {/* ── CENTER ── */}
        <main style={{ display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

          {/* Language tabs */}
          <div style={{
            flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
            padding: "8px 16px",
            background: "rgba(0,0,0,0.12)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
            borderBottom: `1px solid ${BORDER}`,
          }}>
            <div style={{
              display: "inline-flex", gap: "0",
              background: "rgba(255,255,255,0.06)",
              borderRadius: "20px", padding: "3px",
              border: `1px solid ${tw(0.10)}`,
            }}>
              {TABS.map(({ key, label }) => {
                const active = mode === key;
                const disabled = key === "ko" && !chapter?.content_ko;
                return (
                  <button key={key} onClick={() => !disabled && setMode(key)} disabled={disabled} style={{
                    padding: "5px 18px", borderRadius: "16px", border: "none",
                    cursor: disabled ? "default" : "pointer", fontSize: "12px",
                    fontWeight: active ? 600 : 400,
                    background: active ? tw(0.90) : "transparent",
                    color: disabled ? tw(0.18) : active ? "#1a0f06" : tw(0.55),
                    transition: "all 0.12s",
                  }}>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content - text floats over background */}
          <div ref={contentRef} style={{ flex: 1, overflowY: "auto", padding: isFriendsWebtoon ? "0" : "24px 20px" }}>
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", gap: "12px" }}>
                <div style={{
                  width: "16px", height: "16px", borderRadius: "50%",
                  border: `2px solid ${tw(0.18)}`, borderTopColor: accent,
                  animation: "spin 0.8s linear infinite",
                }} />
                <span style={{ fontSize: "13px", color: tw(0.40) }}>불러오는 중…</span>
              </div>
            ) : chapter ? (
              isFriendsWebtoon ? (
                <iframe
                  src={activeIdx === 0 ? "/FRIENDS_EP1_video.html" : "/FRIENDS_EP2_video.html"}
                  title={activeIdx === 0 ? "Friends EP.1" : "Friends EP.2"}
                  style={{ width: "100%", height: "calc(100vh - 90px)", border: "none", display: "block", background: "transparent" }}
                />
              ) : (
                <div style={{ maxWidth: "640px", margin: "0 auto" }}>
                  {/* EP title floating */}
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ fontSize: "10px", letterSpacing: "0.28em", textTransform: "uppercase", color: tw(0.38), marginBottom: "5px" }}>
                      EP {String(activeIdx+1).padStart(2,"0")}
                    </div>
                    <h1 style={{ fontSize: "18px", fontWeight: 700, color: textColor, margin: 0, lineHeight: 1.35, textShadow: textLight ? "0 1px 12px rgba(0,0,0,0.7)" : "none" }}>
                      {chapter.title}
                    </h1>
                    <div style={{ marginTop: "12px", height: "1px", background: `linear-gradient(to right, ${tw(0.20)}, transparent)` }} />
                  </div>

                  {/* Story content */}
                  {mode === "en" && (
                    <div className={`story-content ${fontSize}`} style={{ color: textColor }}
                      dangerouslySetInnerHTML={{ __html: chapter.content }} />
                  )}
                  {mode === "ko" && (
                    chapter.content_ko
                      ? <div className={`story-content ${fontSize}`} style={{ color: textColor }}
                          dangerouslySetInnerHTML={{ __html: chapter.content_ko }} />
                      : <p style={{ textAlign: "center", padding: "60px 0", fontSize: "13px", color: tw(0.38) }}>
                          한글 번역 준비 중입니다.
                        </p>
                  )}
                  {mode === "webtoon" && (
                    <WebtoonView key={chapter.id} chapter={chapter} workId={id} accent={accent} onSaveImages={handleSaveImages} />
                  )}
                </div>
              )
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "14px" }}>
                <p style={{ fontSize: "13px", color: tw(0.38) }}>아직 작성된 내용이 없습니다</p>
                <Link href="/" style={{ fontSize: "12px", color: accent }}>세계관 지도로 돌아가기</Link>
              </div>
            )}
          </div>

          {/* Bottom bar */}
          <div style={{
            flexShrink: 0, height: "42px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 20px",
            background: "rgba(0,0,0,0.25)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
            borderTop: `1px solid ${BORDER}`,
          }}>
            <button onClick={() => setActiveIdx(i => Math.max(0, i-1))} disabled={activeIdx === 0} style={{
              display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none",
              cursor: "pointer", color: tw(0.40), fontSize: "11px", opacity: activeIdx === 0 ? 0.3 : 1,
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
              Previous EP
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
              <button onClick={toggleBookmark} style={{
                display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none",
                cursor: "pointer", color: bookmarked ? accent : tw(0.40), fontSize: "11px",
              }}>
                <svg width="11" height="12" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
                Bookmark
              </button>
              <button onClick={toggleLike} style={{
                display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none",
                cursor: "pointer", color: liked ? "#e05a5a" : tw(0.40), fontSize: "11px",
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                Like
              </button>
              <button style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", color: tw(0.30), fontSize: "11px" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
                Note
              </button>
            </div>

            <button onClick={() => setActiveIdx(i => Math.min(chapters.length-1, i+1))}
              disabled={chapters.length === 0 || activeIdx >= chapters.length-1}
              style={{
                display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none",
                cursor: "pointer", color: tw(0.40), fontSize: "11px",
                opacity: (chapters.length === 0 || activeIdx >= chapters.length-1) ? 0.3 : 1,
              }}>
              Next EP
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </main>

        {/* ── RIGHT PANEL ── */}
        <aside style={{
          display: "flex", flexDirection: "column",
          background: PANEL, borderLeft: `1px solid ${BORDER}`,
          backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
          overflow: "hidden",
        }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px" }}>

            {/* Characters */}
            {work.characters.length > 0 && (
              <div style={{ marginBottom: "18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "10px" }}>
                  <span style={{ color: accent, fontSize: "10px" }}>★</span>
                  <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: PANEL_SUB }}>Characters</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {work.characters.map((ch, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: "8px",
                      padding: "7px 9px", borderRadius: "7px",
                      background: "rgba(255,252,245,0.55)",
                      border: `1px solid ${PANEL_BORDER}`,
                    }}>
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
                        background: `${accent}18`, border: `1.5px solid ${accent}30`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "12px", fontWeight: 700, color: accent,
                      }}>{ch.name[0]}</div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: PANEL_TEXT }}>{ch.name}</div>
                        <div style={{ fontSize: "9px", color: accent, opacity: 0.80, marginBottom: "2px" }}>{ch.nameEn}</div>
                        <div style={{ fontSize: "10px", color: PANEL_SUB, lineHeight: 1.4 }}>{ch.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* OST */}
            {work.ost.length > 0 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "10px" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={PANEL_SUB} strokeWidth="2">
                    <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                  </svg>
                  <span style={{ fontSize: "10px", fontWeight: 600, color: PANEL_SUB, letterSpacing: "0.08em" }}>이 장의 OST</span>
                </div>
                <OstPanel tracks={work.ost} accent={accent} />
              </div>
            )}

            {work.characters.length === 0 && work.ost.length === 0 && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "120px" }}>
                <p style={{ fontSize: "11px", color: PANEL_FAINT, textAlign: "center" }}>캐릭터·OST 정보 없음</p>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ── Settings Drawer ── */}
      {showSettings && (
        <SettingsDrawer
          accent={accent}
          brightness={brightness} blur={blur} darkness={darkness}
          fontSize={fontSize} textLight={textLight}
          showTime={showTime} autoOst={autoOst} bgTransition={bgTransition}
          setBrightness={setBrightness} setBlur={setBlur} setDarkness={setDarkness}
          setFontSize={setFontSize} setTextLight={setTextLight}
          setShowTime={setShowTime} setAutoOst={setAutoOst} setBgTransition={setBgTransition}
          epBgs={epBgs} onUploadBg={handleUploadBg}
          chapterCount={chapters.length} workId={id}
          onClose={() => setShowSettings(false)}
        />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .story-content { line-height: 1.95; }
        .story-content p { margin-bottom: 1.15em; }
        .story-content h1,.story-content h2,.story-content h3 { font-weight: 700; margin: 1.4em 0 0.5em; }
        .story-content img { max-width: 60%; border-radius: 8px; margin: 12px 0 12px 16px; float: right; }
        .story-content.text-sm { font-size: 13px; }
        .story-content.text-base { font-size: 15px; }
        .story-content.text-lg { font-size: 17px; }
        .story-content { text-shadow: 0 1px 10px rgba(0,0,0,0.65); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,245,220,0.12); border-radius: 4px; }
      `}</style>
    </div>
  );
}
