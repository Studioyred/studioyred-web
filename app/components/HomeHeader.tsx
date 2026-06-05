import MusicPlayer from "./MusicPlayer";

const navItems = [
  { label: "홈", href: "/" },
  { label: "작가노트", href: "/author-note" },
  { label: "세계관", href: "/universe" },
  { label: "등장인물", href: "/characters" },
  { label: "영어일기", href: "https://www.wattpad.com/user/StudioYRed", external: true },
  { label: "놀이터", href: "/playground" },
];

export default function HomeHeader() {
  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "rgba(255,255,255,0.93)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(232,201,160,0.22)",
        }}
      >
        <div
          className="max-w-[1440px] mx-auto px-8 flex items-center justify-between gap-6"
          style={{ height: "68px" }}
        >
          {/* Logo */}
          <a href="/" className="flex-shrink-0 group">
            <div className="font-bold text-sm leading-tight text-[#2c1a0e]">Studio Y Red</div>
            <div className="text-[10px] text-[#9b7d65] mt-0.5 leading-none">Where Warm Stories Begin</div>
          </a>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="relative text-sm pb-1 transition-colors duration-200 text-[#6b4c35] hover:text-[#2c1a0e]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-1.5">
            <MusicPlayer />

            <button className="w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-200 text-[#6b4c35] hover:bg-[#f5ede0]">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            <button className="w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-200 text-[#6b4c35] hover:bg-[#f5ede0]">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>

            {/* User */}
            <div
              className="flex items-center gap-2 ml-1 pl-2"
              style={{ borderLeft: "1px solid rgba(232,201,160,0.4)" }}
            >
              <div
                className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden"
                style={{ background: "linear-gradient(135deg, #e8c9a0 0%, #c09070 100%)" }}
              >
                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="14" r="6" fill="rgba(255,255,255,0.65)" />
                  <ellipse cx="18" cy="30" rx="11" ry="7" fill="rgba(255,255,255,0.5)" />
                </svg>
              </div>
              <div className="leading-none">
                <div className="text-[11px] font-semibold text-[#2c1a0e]">은풍골 주민</div>
                <div className="text-[10px] text-[#9b7d65] mt-0.5">Lv.25</div>
              </div>
            </div>
          </div>
        </div>
      </header>

    </>
  );
}
