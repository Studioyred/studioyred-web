const MENU_ITEMS = [
  {
    label: "세계관",
    href: "/universe",
    sub: "세계관·연표·지도",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    label: "성적표",
    href: "/ranking",
    sub: "왓패드 랭킹·작품 평",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 12h8M8 8h5M8 16h6" />
      </svg>
    ),
  },
  {
    label: "OST",
    sub: "배경음악 감상",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
  },
  {
    label: "등장인물",
    href: "/characters",
    sub: "인물·관계도",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    label: "놀이터",
    href: "/playground",
    sub: "구술치기·장날·연탄불",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="5" />
        <path d="M6 12h4M8 10v4" />
        <circle cx="15" cy="10.5" r="1" fill="currentColor" />
        <circle cx="17.5" cy="13" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "왓패드",
    href: "https://www.wattpad.com/user/StudioYRed",
    external: true,
    sub: "원문 글 읽기",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        <path d="M18 8h.01M18 12h.01" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function HomeQuickMenu() {
  return (
    <section className="px-8 pb-6" style={{ background: "#fdf8f3" }}>
      <div className="max-w-[1440px] mx-auto">
        <div
          className="flex items-center gap-3 px-6 py-4 rounded-2xl"
          style={{ background: "#f5ede0" }}
        >
          <span
            className="text-sm font-bold text-[#2c1a0e] whitespace-nowrap pr-3"
            style={{ borderRight: "1.5px solid rgba(155,125,101,0.25)" }}
          >
            빠른 메뉴
          </span>
          <div className="flex-1 flex items-center justify-around flex-wrap gap-2">
            {MENU_ITEMS.map((item) =>
              item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-colors duration-150 text-[#6b4c35] hover:bg-[#e8c9a0]/40 no-underline"
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <div className="text-left">
                    <div className="text-[12px] font-semibold text-[#2c1a0e] leading-snug">{item.label}</div>
                    <div className="text-[10px] text-[#9b7d65] leading-snug">{item.sub}</div>
                  </div>
                </a>
              ) : (
                <button
                  key={item.label}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-colors duration-150 text-[#6b4c35] hover:bg-[#e8c9a0]/40"
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <div className="text-left">
                    <div className="text-[12px] font-semibold text-[#2c1a0e] leading-snug">{item.label}</div>
                    <div className="text-[10px] text-[#9b7d65] leading-snug">{item.sub}</div>
                  </div>
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
