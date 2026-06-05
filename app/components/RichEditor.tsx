"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExt from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { TextStyle, FontSize, FontFamily } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { useCallback, useRef, useState } from "react";

// ── Toolbar button ────────────────────────────────────────────────────────────
function TBtn({
  active,
  onClick,
  title,
  children,
  accentColor,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  accentColor: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="w-7 h-7 flex items-center justify-center rounded text-xs transition-all duration-150"
      style={
        active
          ? { backgroundColor: accentColor, color: "#fdf8f3" }
          : { color: "#6b4c35" }
      }
      onMouseEnter={(e) => {
        if (!active) (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${accentColor}18`;
      }}
      onMouseLeave={(e) => {
        if (!active) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="w-px h-5 bg-[#e8c9a0] mx-0.5 flex-shrink-0" />;
}

// ── Toolbar ───────────────────────────────────────────────────────────────────
function Toolbar({
  editor,
  accentColor,
  workId,
  chapterId,
}: {
  editor: Editor;
  accentColor: string;
  workId: string;
  chapterId: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [ytInput, setYtInput] = useState(false);
  const [ytUrl, setYtUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadImage = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("storyId", `${workId}-${chapterId}-inline-${Date.now()}`);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const { url } = await res.json();
        if (url) editor.chain().focus().setImage({ src: url }).run();
      } catch {
        alert("Image upload failed.");
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = "";
      }
    },
    [editor, workId, chapterId]
  );

  const insertYoutube = useCallback(() => {
    if (!ytUrl.trim()) return;
    editor.chain().focus().setYoutubeVideo({ src: ytUrl.trim() }).run();
    setYtUrl("");
    setYtInput(false);
  }, [editor, ytUrl]);

  const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px"];
  const FONTS = [
    { label: "Default", value: "" },
    { label: "Serif", value: "Georgia, serif" },
    { label: "Mono", value: "monospace" },
    { label: "Sans", value: "Arial, sans-serif" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-[#e8c9a0]/60 bg-[#fdf8f3] flex-shrink-0">
      {/* Heading */}
      {(["1", "2", "3"] as const).map((level) => (
        <TBtn
          key={level}
          active={editor.isActive("heading", { level: Number(level) })}
          onClick={() => editor.chain().focus().toggleHeading({ level: Number(level) as 1 | 2 | 3 }).run()}
          title={`Heading ${level}`}
          accentColor={accentColor}
        >
          H{level}
        </TBtn>
      ))}
      <Divider />

      {/* Inline styles */}
      <TBtn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold" accentColor={accentColor}>
        <strong>B</strong>
      </TBtn>
      <TBtn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic" accentColor={accentColor}>
        <em>I</em>
      </TBtn>
      <TBtn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline" accentColor={accentColor}>
        <span style={{ textDecoration: "underline" }}>U</span>
      </TBtn>
      <Divider />

      {/* Font family */}
      <select
        className="text-[11px] text-[#6b4c35] bg-transparent border border-[#e8c9a0] rounded px-1.5 py-0.5 h-7 focus:outline-none cursor-pointer"
        onChange={(e) => {
          const val = e.target.value;
          if (val) editor.chain().focus().setFontFamily(val).run();
          else editor.chain().focus().unsetFontFamily().run();
        }}
        title="Font family"
      >
        {FONTS.map((f) => (
          <option key={f.label} value={f.value}>{f.label}</option>
        ))}
      </select>

      {/* Font size */}
      <select
        className="text-[11px] text-[#6b4c35] bg-transparent border border-[#e8c9a0] rounded px-1.5 py-0.5 h-7 focus:outline-none cursor-pointer"
        onChange={(e) => {
          const val = e.target.value;
          if (val) (editor.chain().focus() as unknown as { setFontSize: (s: string) => { run: () => void } }).setFontSize(val).run();
          else (editor.chain().focus() as unknown as { unsetFontSize: () => { run: () => void } }).unsetFontSize().run();
        }}
        title="Font size"
      >
        <option value="">Size</option>
        {FONT_SIZES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <Divider />

      {/* Lists */}
      <TBtn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list" accentColor={accentColor}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/>
          <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/>
        </svg>
      </TBtn>
      <TBtn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list" accentColor={accentColor}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/>
          <text x="1" y="9" fontSize="8" fill="currentColor" stroke="none">1</text>
          <text x="1" y="15" fontSize="8" fill="currentColor" stroke="none">2</text>
          <text x="1" y="21" fontSize="8" fill="currentColor" stroke="none">3</text>
        </svg>
      </TBtn>
      <TBtn active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote" accentColor={accentColor}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
      </TBtn>
      <Divider />

      {/* Image */}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadImage} />
      <TBtn
        onClick={() => fileRef.current?.click()}
        title={uploading ? "Uploading…" : "Insert image"}
        accentColor={accentColor}
      >
        {uploading ? (
          <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
          </svg>
        )}
      </TBtn>

      {/* YouTube */}
      {ytInput ? (
        <div className="flex items-center gap-1">
          <input
            autoFocus
            value={ytUrl}
            onChange={(e) => setYtUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") insertYoutube(); if (e.key === "Escape") { setYtInput(false); setYtUrl(""); } }}
            placeholder="YouTube URL…"
            className="text-[11px] border border-[#e8c9a0] rounded px-2 py-1 h-7 w-40 focus:outline-none bg-white"
          />
          <button onClick={insertYoutube} className="text-[11px] px-2 h-7 rounded text-white" style={{ backgroundColor: accentColor }}>OK</button>
          <button onClick={() => { setYtInput(false); setYtUrl(""); }} className="text-[11px] px-2 h-7 rounded text-[#9b7d65] border border-[#e8c9a0]">✕</button>
        </div>
      ) : (
        <TBtn onClick={() => setYtInput(true)} title="Embed YouTube" accentColor={accentColor}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.4 2.7 12 2.7 12 2.7s-4.4 0-6.8.2c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.3v2c0 2.1.3 4.2.3 4.2s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.2 21.7 12 21.7 12 21.7s4.4 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.1.3-4.2v-2C23.3 9.1 23 7 23 7zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z"/></svg>
        </TBtn>
      )}
    </div>
  );
}

// ── Main RichEditor export ────────────────────────────────────────────────────
export default function RichEditor({
  content,
  accentColor,
  workId,
  chapterId,
  onChange,
}: {
  content: string;
  accentColor: string;
  workId: string;
  chapterId: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      TextStyle,
      FontSize,
      FontFamily,
      Underline,
      ImageExt.configure({ inline: false, allowBase64: true }),
      Youtube.configure({ width: 640, height: 360, nocookie: true }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "story-content tiptap-editor focus:outline-none min-h-[400px]",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="flex flex-col flex-1 overflow-hidden border border-[#e8c9a0]/60 rounded-sm">
      <Toolbar editor={editor} accentColor={accentColor} workId={workId} chapterId={chapterId} />
      <div className="flex-1 overflow-y-auto px-5 sm:px-8 md:px-12 py-8">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
