"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import StoryModal from "./StoryModal";

type Work = {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  description: string;
  color: string;
  accentColor: string;
  number: string;
  mood: string;
  wattpadUrl: string;
  coverUrl: string | null;
};

const WORKS: Work[] = [
  {
    id: "friends",
    title: "Friends",
    subtitle: "SF / Community",
    tags: ["Friendship", "Reunion", "Space"],
    description:
      "The village is gone. Everyone scattered. But in the afterlife — somewhere in space — they find each other again.",
    color: "#e3edf7",
    accentColor: "#2e5b8a",
    number: "01",
    mood: "Friendship · Reunion · Space",
    wattpadUrl: "#",
    coverUrl: null,
  },
  {
    id: "little-groom",
    title: "Little Groom",
    subtitle: "Animation",
    tags: ["Animation", "Heartwarming"],
    description:
      "A small being that holds an immense love. A story of quietly tending to the hearts of others, undisturbed by the pace of the world.",
    color: "#e8c9a0",
    accentColor: "#c0392b",
    number: "02",
    mood: "Warmth · Comfort · Growth",
    wattpadUrl: "https://www.wattpad.com/story/410185098-little-groom-season-1",
    coverUrl: "https://img.wattpad.com/cover/410185098-256-k188358.jpg",
  },
  {
    id: "gca",
    title: "GCA",
    subtitle: "Ghost Consultant Agency",
    tags: ["Drama", "Youth"],
    description:
      "Unexpected encounters at the crossroads of youth. Carrying their own wounds, they slowly learn to lean on each other.",
    color: "#f0e0cd",
    accentColor: "#9b5a3c",
    number: "03",
    mood: "Excitement · Solidarity · Youth",
    wattpadUrl: "https://www.wattpad.com/story/409998049-gca-ghost-consultant-agency",
    coverUrl: "https://img.wattpad.com/cover/409998049-256-k758999.jpg",
  },
  {
    id: "miss-catherine",
    title: "Miss Catherine",
    subtitle: "Romance",
    tags: ["Romance", "Lyrical"],
    description:
      "A small shop hidden at the end of an old alley. A love story that unfolds quietly and deeply, like the changing of seasons.",
    color: "#f5ede0",
    accentColor: "#7a3f2e",
    number: "04",
    mood: "Elegance · Poetry · Romance",
    wattpadUrl: "https://www.wattpad.com/story/409852837-miss-catherine",
    coverUrl: "https://img.wattpad.com/cover/409852837-256-k499074.jpg",
  },
  {
    id: "flower",
    title: "Flower",
    subtitle: "Short Story",
    tags: ["Short Story", "Fantasy"],
    description:
      "A girl who thought she was good at mathematics. Then she met Professor KOD.",
    color: "#ede8f0",
    accentColor: "#6b4c8a",
    number: "05",
    mood: "Wonder · Mystery · Discovery",
    wattpadUrl: "https://www.wattpad.com/story/411217686-flower",
    coverUrl: "https://img.wattpad.com/cover/411217686-256-k551652.jpg",
  },
];

function WattpadIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4 4l3.5 12L10 8l2.5 8L16 4h4l-5.5 16L12 12l-2.5 8L4 4z" />
    </svg>
  );
}

function UploadButton({
  workId,
  accentColor,
  onUploaded,
}: {
  workId: string;
  accentColor: string;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setBusy(true);
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("storyId", workId);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) onUploaded(`${data.url}?t=${Date.now()}`);
      } catch {
        alert("Upload failed. Please try again.");
      } finally {
        setBusy(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [workId, onUploaded]
  );

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.click();
        }}
        disabled={busy}
        className="absolute top-2.5 right-2.5 z-20 w-8 h-8 flex items-center justify-center rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 disabled:opacity-50"
        style={{ backgroundColor: accentColor, color: "white" }}
        title="Upload cover image"
        aria-label="Upload cover image"
      >
        {busy ? (
          <div className="w-3.5 h-3.5 border border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
        )}
      </button>
    </>
  );
}

function WorkCard({
  work,
  onOpen,
}: {
  work: Work;
  onOpen: (w: Work & { coverUrl: string | null }) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string | null>(work.coverUrl);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleOpen = () => onOpen({ ...work, coverUrl });

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${parseInt(work.number) * 0.08}s` }}
    >
      <article
        className="group relative overflow-hidden rounded-sm cursor-pointer flex"
        style={{ backgroundColor: work.color, minHeight: "260px" }}
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleOpen()}
        aria-label={`Open ${work.title}`}
      >
        {/* Left: Cover (fixed width) */}
        <div className="relative flex-shrink-0 overflow-hidden" style={{ width: "160px" }}>
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={`${work.title} cover`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="160px"
              unoptimized={coverUrl.startsWith("/covers/")}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: `radial-gradient(ellipse at center, ${work.accentColor}20 0%, ${work.color} 80%)`,
              }}
            >
              <span
                className="text-6xl font-bold select-none"
                style={{ color: work.accentColor, opacity: 0.1 }}
              >
                {work.number}
              </span>
            </div>
          )}

          {/* Right fade */}
          <div
            className="absolute inset-y-0 right-0 w-10 pointer-events-none"
            style={{ background: `linear-gradient(to right, transparent, ${work.color})` }}
            aria-hidden="true"
          />

          <UploadButton
            workId={work.id}
            accentColor={work.accentColor}
            onUploaded={(url) => setCoverUrl(url)}
          />
        </div>

        {/* Right: Info */}
        <div className="flex flex-col flex-1 p-6 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-auto">
            <span
              className="text-[10px] tracking-[0.3em] font-medium"
              style={{ color: work.accentColor, opacity: 0.4 }}
            >
              {work.number}
            </span>
            <div className="flex gap-1.5 flex-wrap justify-end">
              {work.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] tracking-widest px-2.5 py-0.5 rounded-full border"
                  style={{ color: work.accentColor, borderColor: `${work.accentColor}38` }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-3 mb-3">
            <p
              className="text-[10px] tracking-[0.2em] mb-1"
              style={{ color: work.accentColor, opacity: 0.55 }}
            >
              {work.subtitle}
            </p>
            <h3
              className="text-lg md:text-xl font-bold leading-snug"
              style={{ color: work.accentColor }}
            >
              {work.title}
            </h3>
          </div>

          <p
            className="text-sm leading-relaxed flex-1 mb-4 line-clamp-3"
            style={{ color: `${work.accentColor}99` }}
          >
            {work.description}
          </p>

          <div className="space-y-2.5">
            <span
              className="block text-[10px] tracking-widest"
              style={{ color: work.accentColor, opacity: 0.38 }}
            >
              {work.mood}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpen();
              }}
              className="flex items-center justify-center gap-1.5 w-full py-2.5 text-xs tracking-widest font-medium rounded-sm border transition-all duration-200"
              style={{
                color: work.accentColor,
                borderColor: `${work.accentColor}40`,
                backgroundColor: `${work.accentColor}08`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.backgroundColor = work.accentColor;
                el.style.color = work.color;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.backgroundColor = `${work.accentColor}08`;
                el.style.color = work.accentColor;
              }}
            >
              <WattpadIcon />
              Read on Wattpad
            </button>
          </div>
        </div>

        {/* Accent left bar on hover */}
        <div
          className="absolute left-0 top-0 w-0.5 h-0 group-hover:h-full transition-all duration-500"
          style={{ backgroundColor: work.accentColor }}
        />
      </article>
    </div>
  );
}

export default function Works() {
  const titleRef = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);
  const [activeWork, setActiveWork] = useState<(Work & { coverUrl: string | null }) | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTitleVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section id="works" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div
            ref={titleRef}
            className={`mb-20 transition-all duration-700 ${
              titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <p className="text-xs tracking-[0.4em] text-[#c0392b] mb-4 uppercase">Works</p>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <h2 className="text-4xl md:text-5xl font-bold text-[#2c1a0e] leading-tight">
                Stories<br />We&apos;ve Told
              </h2>
              <p className="text-sm text-[#9b7d65] leading-relaxed max-w-xs">
                Each work carries its own warmth within it.
                <br />We hope that warmth reaches you.
              </p>
            </div>
            <div className="mt-8 h-px bg-gradient-to-r from-[#c0392b]/30 via-[#e8c9a0] to-transparent" />
          </div>

          {/* 2-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WORKS.map((work) => (
              <WorkCard key={work.id} work={work} onOpen={setActiveWork} />
            ))}
          </div>

          {/* Footer link */}
          <div className="mt-12 flex items-center justify-center gap-3">
            <div className="h-px flex-1 max-w-32 bg-[#e8c9a0]/60" />
            <a
              href="https://www.wattpad.com/user/StudioYRed"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs tracking-widest text-[#9b7d65] hover:text-[#c0392b] transition-colors duration-300"
            >
              <WattpadIcon />
              View all on Wattpad
            </a>
            <div className="h-px flex-1 max-w-32 bg-[#e8c9a0]/60" />
          </div>
        </div>
      </section>

      {activeWork && (
        <StoryModal work={activeWork} onClose={() => setActiveWork(null)} />
      )}
    </>
  );
}
