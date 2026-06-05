"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function extractYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function getEmbedUrl(url: string): string | null {
  const ytId = extractYouTubeId(url);
  if (ytId) return `https://www.youtube.com/embed/${ytId}?autoplay=0&rel=0`;
  // Generic iframe-embeddable URL
  if (url.startsWith("http")) return url;
  return null;
}

export default function Hero() {
  const [visible, setVisible] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [videoInput, setVideoInput] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [savingVideo, setSavingVideo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Load config on mount
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    fetch("/api/config")
      .then((r) => r.json())
      .then((cfg) => {
        if (cfg.heroLogoUrl) setLogoUrl(cfg.heroLogoUrl);
        if (cfg.heroVideoUrl) { setVideoUrl(cfg.heroVideoUrl); setVideoInput(cfg.heroVideoUrl); }
      })
      .catch(() => {});
    return () => clearTimeout(timer);
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("storyId", "hero-logo");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const { url } = await res.json();
      if (url) {
        const full = `${url}?t=${Date.now()}`;
        setLogoUrl(full);
        await fetch("/api/config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ heroLogoUrl: full }),
        });
      }
    } catch { alert("Logo upload failed."); }
    finally { setUploadingLogo(false); if (logoInputRef.current) logoInputRef.current.value = ""; }
  };

  const handleVideoSave = async () => {
    setSavingVideo(true);
    try {
      const url = videoInput.trim() || null;
      setVideoUrl(url);
      await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroVideoUrl: url }),
      });
      setAdminOpen(false);
    } catch { alert("Save failed."); }
    finally { setSavingVideo(false); }
  };

  const embedSrc = videoUrl ? getEmbedUrl(videoUrl) : null;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Background blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
           style={{ background: "radial-gradient(circle, #c0392b 0%, #e8c9a0 50%, transparent 75%)" }} aria-hidden />
      <div className="absolute top-20 right-20 w-48 h-48 rounded-full opacity-[0.06] pointer-events-none"
           style={{ background: "radial-gradient(circle, #c0392b, transparent)" }} aria-hidden />

      <div className="relative z-10 text-center max-w-3xl mx-auto w-full">

        {/* ── Logo area ── */}
        <div className={`flex justify-center mb-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
             style={{ transitionDelay: "0.05s" }}>
          {logoUrl ? (
            <div className="relative w-24 h-24 md:w-32 md:h-32 group">
              <Image src={logoUrl} alt="Studio Y Red logo" fill className="object-contain" unoptimized />
              <button
                onClick={() => setAdminOpen(true)}
                className="absolute -bottom-2 -right-2 w-7 h-7 flex items-center justify-center rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity bg-[#c0392b] text-white"
                title="Change logo"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAdminOpen(true)}
              className="w-16 h-16 rounded-full border-2 border-dashed border-[#c0392b]/30 flex items-center justify-center text-[#c0392b]/50 hover:border-[#c0392b]/60 hover:text-[#c0392b]/70 transition-colors group"
              title="Upload logo"
            >
              <span className="text-2xl font-bold group-hover:scale-110 transition-transform">Y</span>
            </button>
          )}
        </div>

        {/* Label */}
        <p className={`text-xs tracking-[0.4em] text-[#c0392b] mb-8 uppercase transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
           style={{ transitionDelay: "0.1s" }}>
          Studio Y Red
        </p>

        {/* Main title */}
        <h1
          className={`text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-[#2c1a0e] mb-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "0.25s", letterSpacing: "-0.02em" }}
        >
          Where Warm
          <br />
          <span className="text-[#c0392b]">Stories Are Made</span>
        </h1>

        <p className={`text-base md:text-lg text-[#9b7d65] leading-relaxed mb-12 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
           style={{ transitionDelay: "0.4s" }}>
          Small emotions gather to build entire worlds.
          <br className="hidden md:block" />
          Studio Y Red connects hearts through sincere storytelling.
        </p>

        {/* CTA buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
             style={{ transitionDelay: "0.55s" }}>
          <a href="#works" className="inline-block px-8 py-3.5 bg-[#c0392b] text-white text-sm tracking-widest hover:bg-[#a93226] transition-colors duration-300 rounded-sm">
            View Works
          </a>
          <a href="#about" className="inline-block px-8 py-3.5 border border-[#c0392b]/40 text-[#c0392b] text-sm tracking-widest hover:bg-[#c0392b]/5 transition-colors duration-300 rounded-sm">
            About Studio
          </a>
        </div>

        {/* ── Embedded video ── */}
        {embedSrc && (
          <div className={`mt-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
               style={{ transitionDelay: "0.7s" }}>
            <div className="relative w-full max-w-2xl mx-auto rounded-sm overflow-hidden shadow-xl" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={embedSrc}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Featured video"
              />
            </div>
            {/* Edit video button */}
            <button
              onClick={() => setAdminOpen(true)}
              className="mt-3 text-xs text-[#9b7d65] hover:text-[#c0392b] transition-colors underline underline-offset-2"
            >
              Change video
            </button>
          </div>
        )}

        {/* Admin panel: logo + video */}
        {adminOpen && (
          <div className={`mt-12 p-6 rounded-sm border text-left transition-all duration-300`}
               style={{ borderColor: "#e8c9a0", backgroundColor: "#fdf8f3" }}>
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs tracking-[0.3em] text-[#9b7d65] uppercase">Hero Settings</p>
              <button onClick={() => setAdminOpen(false)} className="text-[#9b7d65] hover:text-[#2c1a0e]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="space-y-5">
              {/* Logo upload */}
              <div>
                <label className="block text-xs tracking-widest text-[#9b7d65] mb-2">Logo Image</label>
                <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                <button
                  onClick={() => logoInputRef.current?.click()}
                  disabled={uploadingLogo}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs tracking-wider border rounded-sm transition-colors disabled:opacity-50"
                  style={{ borderColor: "#c0392b40", color: "#c0392b" }}
                >
                  {uploadingLogo ? (
                    <span className="w-3.5 h-3.5 border-2 border-[#c0392b] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                  )}
                  {logoUrl ? "Replace Logo" : "Upload Logo"}
                </button>
                {logoUrl && (
                  <button
                    onClick={async () => {
                      setLogoUrl(null);
                      await fetch("/api/config", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ heroLogoUrl: null }) });
                    }}
                    className="ml-2 text-xs text-red-400 hover:text-red-600 underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-xs tracking-widest text-[#9b7d65] mb-2">
                  Featured Video URL <span className="opacity-50">(YouTube or direct link)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    value={videoInput}
                    onChange={(e) => setVideoInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleVideoSave()}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="flex-1 bg-transparent border border-[#e8c9a0] px-3 py-2.5 text-sm text-[#2c1a0e] placeholder-[#c9a97a] focus:outline-none focus:border-[#c0392b] transition-colors rounded-sm"
                  />
                  <button
                    onClick={handleVideoSave}
                    disabled={savingVideo}
                    className="px-4 py-2 text-xs tracking-wider rounded-sm disabled:opacity-60 transition-opacity hover:opacity-85"
                    style={{ backgroundColor: "#c0392b", color: "white" }}
                  >
                    {savingVideo ? "…" : "Save"}
                  </button>
                </div>
                {videoUrl && (
                  <button
                    onClick={async () => {
                      setVideoUrl(null); setVideoInput("");
                      await fetch("/api/config", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ heroVideoUrl: null }) });
                      setAdminOpen(false);
                    }}
                    className="mt-1.5 text-xs text-red-400 hover:text-red-600 underline"
                  >
                    Remove video
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Open admin (no logo, no video) */}
        {!adminOpen && !videoUrl && (
          <button
            onClick={() => setAdminOpen(true)}
            className={`mt-8 text-xs text-[#c9a97a] hover:text-[#9b7d65] transition-all duration-700 underline underline-offset-2 ${visible ? "opacity-100" : "opacity-0"}`}
            style={{ transitionDelay: "0.8s" }}
          >
            + Add featured video
          </button>
        )}
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
           style={{ transitionDelay: "0.9s" }}>
        <span className="text-[10px] tracking-[0.3em] text-[#9b7d65] uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-[#9b7d65]/60 to-transparent" />
      </div>
    </section>
  );
}
