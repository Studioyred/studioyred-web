"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

const RichEditor = dynamic(() => import("./RichEditor"), { ssr: false });

type Chapter = { id: string; title: string; content: string };
type Work = { id: string; title: string; subtitle: string; accentColor: string; color: string; wattpadUrl: string };

// ── YouTube embed processor ───────────────────────────────────────────────────
function embedYouTube(html: string): string {
  const aRe = /<a[^>]*href="([^"]*(?:youtube\.com\/watch\?[^"]*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})[^"]*)"[^>]*>[\s\S]*?<\/a>/gi;
  let out = html.replace(aRe, (_m, _href, vid) => ytDiv(vid));
  const bareRe = /(?<!['"=])https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?(?:[^&\s<>"']+&)*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[^\s<>"']*)?/gi;
  return out.replace(bareRe, (_m, vid) => ytDiv(vid));
}
function ytDiv(id: string) {
  return `<div class="yt-wrap"><iframe src="https://www.youtube.com/embed/${id}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
}

// ── Chapter sidebar ───────────────────────────────────────────────────────────
function ChapterList({
  chapters,
  activeIdx,
  accentColor,
  editMode,
  onSelect,
  onRename,
}: {
  chapters: Chapter[];
  activeIdx: number;
  accentColor: string;
  editMode: boolean;
  onSelect: (i: number) => void;
  onRename?: (i: number, title: string) => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <p className="text-[10px] tracking-[0.3em] text-[#9b7d65] uppercase px-4 pt-4 pb-2 flex-shrink-0">
        Chapters
      </p>
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
        {chapters.map((ch, i) => (
          <div
            key={ch.id}
            className="group/item flex items-start gap-1 rounded-sm px-2 py-2 cursor-pointer transition-colors duration-150"
            style={i === activeIdx ? { backgroundColor: `${accentColor}15` } : {}}
            onClick={() => onSelect(i)}
            onMouseEnter={(e) => { if (i !== activeIdx) (e.currentTarget as HTMLDivElement).style.backgroundColor = "#e8c9a040"; }}
            onMouseLeave={(e) => { if (i !== activeIdx) (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent"; }}
          >
            <span className="text-[10px] opacity-40 mt-0.5 flex-shrink-0 w-5" style={i === activeIdx ? { color: accentColor } : { color: "#9b7d65" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            {editMode && onRename ? (
              <input
                value={ch.title}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => onRename(i, e.target.value)}
                className="flex-1 text-xs bg-transparent focus:outline-none border-b border-dashed leading-snug"
                style={{ color: i === activeIdx ? accentColor : "#9b7d65", borderColor: `${accentColor}40` }}
              />
            ) : (
              <span
                className="flex-1 text-xs leading-snug"
                style={{ color: i === activeIdx ? accentColor : "#9b7d65", fontWeight: i === activeIdx ? 600 : 400 }}
              >
                {ch.title}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────
export default function StoryModal({ work, onClose }: { work: Work; onClose: () => void }) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Load story
  useEffect(() => {
    setLoading(true);
    setChapters([]);
    setActiveIdx(0);
    setEditMode(false);
    fetch(`/api/story/${work.id}`)
      .then((r) => r.json())
      .then((d) => {
        setFound(!!d.found);
        setChapters(d.chapters ?? []);
      })
      .catch(() => setFound(false))
      .finally(() => setLoading(false));
  }, [work.id]);

  // Keyboard: Escape closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Scroll to top on chapter change (view mode)
  useEffect(() => {
    if (!editMode) contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeIdx, editMode]);

  // ── Actions ──────────────────────────────────────────────────────────────────
  const updateChapterContent = useCallback((idx: number, html: string) => {
    setChapters((prev) => prev.map((c, i) => (i === idx ? { ...c, content: html } : c)));
  }, []);

  const renameChapter = useCallback((idx: number, title: string) => {
    setChapters((prev) => prev.map((c, i) => (i === idx ? { ...c, title } : c)));
  }, []);

  const addChapter = useCallback(() => {
    const newChapter: Chapter = {
      id: `new-${Date.now()}`,
      title: `Chapter ${chapters.length + 1}`,
      content: "<p>Start writing here…</p>",
    };
    setChapters((prev) => [...prev, newChapter]);
    setActiveIdx(chapters.length);
    setFound(true);
  }, [chapters.length]);

  const deleteChapter = useCallback((idx: number) => {
    if (!confirm(`Delete chapter "${chapters[idx].title}"?`)) return;
    setChapters((prev) => prev.filter((_, i) => i !== idx));
    setActiveIdx((prev) => Math.min(prev, chapters.length - 2));
  }, [chapters]);

  const saveAll = useCallback(async () => {
    setSaving(true);
    try {
      await fetch(`/api/story/${work.id}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapters }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [work.id, chapters]);

  const chapter = chapters[activeIdx];

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div className="absolute inset-0 bg-[#2c1a0e]/75 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <div
        className="relative z-10 w-full max-w-5xl flex flex-col rounded-sm shadow-2xl overflow-hidden"
        style={{ height: "92vh", backgroundColor: "#fdf8f3" }}
      >
        {/* ── Header ── */}
        <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ backgroundColor: work.accentColor }}>
          {/* Sidebar toggle (mobile) */}
          {chapters.length > 0 && (
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-sm flex-shrink-0 transition-opacity hover:opacity-70"
              style={{ backgroundColor: `${work.color}22`, color: work.color }}
              aria-label="Toggle chapter list"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
          )}

          {/* Title */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] tracking-[0.25em] opacity-60 uppercase" style={{ color: work.color }}>{work.subtitle}</p>
            <h2 className="text-sm font-semibold tracking-wide truncate" style={{ color: work.color }}>{work.title}</h2>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Edit / View toggle */}
            <button
              onClick={() => setEditMode((v) => !v)}
              className="flex items-center gap-1.5 text-xs tracking-wider px-3 py-1.5 rounded-sm transition-all duration-200"
              style={
                editMode
                  ? { backgroundColor: work.color, color: work.accentColor, fontWeight: 600 }
                  : { backgroundColor: `${work.color}22`, color: work.color }
              }
            >
              {editMode ? (
                <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>View</>
              ) : (
                <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit</>
              )}
            </button>

            {/* Save (edit mode only) */}
            {editMode && (
              <>
                <button
                  onClick={addChapter}
                  className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-sm transition-opacity hover:opacity-75"
                  style={{ backgroundColor: `${work.color}22`, color: work.color }}
                  title="Add new chapter"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                  Episode
                </button>
                <button
                  onClick={saveAll}
                  disabled={saving}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-sm font-semibold transition-opacity hover:opacity-85 disabled:opacity-60"
                  style={{ backgroundColor: work.color, color: work.accentColor }}
                >
                  {saving ? (
                    <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : saved ? (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                  ) : (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                  )}
                  {saved ? "Saved!" : saving ? "Saving…" : "Save"}
                </button>
              </>
            )}

            {/* Wattpad link */}
            <a
              href={work.wattpadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-sm transition-opacity hover:opacity-70"
              style={{ backgroundColor: `${work.color}18`, color: work.color }}
            >
              Wattpad ↗
            </a>

            {/* Close */}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-sm transition-opacity hover:opacity-70"
              style={{ backgroundColor: `${work.color}22`, color: work.color }}
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 overflow-hidden relative">

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div className="absolute inset-0 z-20 md:hidden" onClick={() => setSidebarOpen(false)}>
              <div
                className="absolute left-0 top-0 bottom-0 w-60 bg-[#fdf8f3] border-r border-[#e8c9a0]/60 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <ChapterList
                  chapters={chapters}
                  activeIdx={activeIdx}
                  accentColor={work.accentColor}
                  editMode={editMode}
                  onSelect={(i) => { setActiveIdx(i); setSidebarOpen(false); }}
                  onRename={renameChapter}
                />
              </div>
            </div>
          )}

          {/* Desktop sidebar */}
          {!loading && chapters.length > 0 && (
            <div className="hidden md:flex flex-col w-52 flex-shrink-0 border-r border-[#e8c9a0]/50 overflow-hidden">
              <ChapterList
                chapters={chapters}
                activeIdx={activeIdx}
                accentColor={work.accentColor}
                editMode={editMode}
                onSelect={setActiveIdx}
                onRename={renameChapter}
              />
              {/* Delete chapter (edit mode) */}
              {editMode && chapter && (
                <div className="px-3 pb-3 flex-shrink-0">
                  <button
                    onClick={() => deleteChapter(activeIdx)}
                    className="w-full text-xs text-red-400 border border-red-200 rounded-sm py-1.5 hover:bg-red-50 transition-colors"
                  >
                    Delete Chapter
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Content / Editor ── */}
          <div ref={contentRef} className="flex-1 overflow-y-auto flex flex-col">

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center flex-1 gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                     style={{ borderColor: `${work.accentColor}30`, borderTopColor: work.accentColor }} />
                <span className="text-sm text-[#9b7d65]">Loading story…</span>
              </div>
            )}

            {/* No file */}
            {!loading && !found && !editMode && (
              <div className="flex flex-col items-center justify-center flex-1 gap-5 px-8 text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center"
                     style={{ backgroundColor: `${work.accentColor}12` }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={work.accentColor} strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/>
                  </svg>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-[#2c1a0e]">No story content yet</p>
                  <p className="text-sm text-[#9b7d65] leading-relaxed">
                    Place{" "}
                    <code className="bg-[#e8c9a0]/60 px-1.5 py-0.5 rounded text-xs">{work.id}.docx</code>
                    {" "}in{" "}
                    <code className="bg-[#e8c9a0]/60 px-1.5 py-0.5 rounded text-xs">public/docs/</code>
                    <br />or switch to{" "}
                    <button onClick={() => setEditMode(true)} className="underline" style={{ color: work.accentColor }}>
                      Edit mode
                    </button>{" "}
                    to write directly.
                  </p>
                </div>
                <a href={work.wattpadUrl} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 px-7 py-3 text-xs tracking-widest rounded-sm transition-opacity hover:opacity-85"
                   style={{ backgroundColor: work.accentColor, color: work.color }}>
                  Read on Wattpad ↗
                </a>
              </div>
            )}

            {/* ── VIEW MODE ── */}
            {!loading && (found || chapters.length > 0) && !editMode && chapter && (
              <div className="max-w-2xl mx-auto w-full px-5 sm:px-8 md:px-12 py-10">
                {/* Chapter header */}
                <div className="mb-8 pb-5 border-b" style={{ borderColor: `${work.accentColor}20` }}>
                  <p className="text-[10px] tracking-[0.3em] mb-1.5 uppercase" style={{ color: work.accentColor, opacity: 0.45 }}>
                    {String(activeIdx + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}
                  </p>
                  <h2 className="text-xl md:text-2xl font-bold leading-snug" style={{ color: work.accentColor }}>
                    {chapter.title}
                  </h2>
                </div>

                {/* Content */}
                <div className="story-content" dangerouslySetInnerHTML={{ __html: embedYouTube(chapter.content) }} />

                {/* Prev / Next */}
                <div className="flex justify-between mt-12 pt-6 border-t border-[#e8c9a0]/40 gap-4">
                  {activeIdx > 0 ? (
                    <button onClick={() => setActiveIdx((i) => i - 1)}
                            className="flex items-center gap-2 text-xs tracking-wider text-[#9b7d65] hover:text-[#2c1a0e] transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
                      {chapters[activeIdx - 1].title}
                    </button>
                  ) : <span />}

                  {activeIdx < chapters.length - 1 ? (
                    <button onClick={() => setActiveIdx((i) => i + 1)}
                            className="flex items-center gap-2 text-xs tracking-wider text-[#9b7d65] hover:text-[#2c1a0e] transition-colors">
                      {chapters[activeIdx + 1].title}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                  ) : (
                    <a href={work.wattpadUrl} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-2 text-xs tracking-wider transition-colors hover:opacity-75"
                       style={{ color: work.accentColor }}>
                      Continue on Wattpad ↗
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* ── EDIT MODE ── */}
            {!loading && editMode && (
              <div className="flex flex-col flex-1 overflow-hidden">
                {chapter ? (
                  <div className="flex flex-col flex-1 overflow-hidden px-4 py-4 gap-3">
                    {/* Chapter title input */}
                    <input
                      value={chapter.title}
                      onChange={(e) => renameChapter(activeIdx, e.target.value)}
                      placeholder="Chapter title…"
                      className="text-xl font-bold bg-transparent border-b-2 focus:outline-none pb-1"
                      style={{ color: work.accentColor, borderColor: `${work.accentColor}30` }}
                    />
                    {/* Tiptap editor */}
                    <RichEditor
                      key={chapter.id}
                      content={chapter.content}
                      accentColor={work.accentColor}
                      workId={work.id}
                      chapterId={chapter.id}
                      onChange={(html) => updateChapterContent(activeIdx, html)}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center flex-1 gap-4">
                    <p className="text-sm text-[#9b7d65]">No chapters yet.</p>
                    <button
                      onClick={addChapter}
                      className="flex items-center gap-2 px-6 py-3 text-xs tracking-widest rounded-sm"
                      style={{ backgroundColor: work.accentColor, color: work.color }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                      Add First Chapter
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
