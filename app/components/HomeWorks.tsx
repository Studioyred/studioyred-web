type Work = {
  id: string;
  prefix: string;
  title: string;
  subtitle: string;
  coverUrl: string | null;
  fallbackGradient?: string;
  href: string;
};

const WORKS: Work[] = [
  {
    id: "little-groom",
    prefix: "✿",
    title: "꼬마신랑",
    subtitle: "1980년대 은풍골 이야기",
    coverUrl: "/little-groom.png",
    href: "/viewer/little-groom",
  },
  {
    id: "flower",
    prefix: "🌸",
    title: "Flower",
    subtitle: "도시 로맨스 스핀오프",
    coverUrl: "/flower.png",
    href: "/viewer/flower",
  },
  {
    id: "friends",
    prefix: "☆",
    title: "Friends",
    subtitle: "우주정거장 SF 시트콤",
    coverUrl: "/friends.png",
    href: "/viewer/friends",
  },
  {
    id: "gca",
    prefix: "🔥",
    title: "GCA",
    subtitle: "Ghost Consultanta Agency\n저승 행정청",
    coverUrl: "/gca.png",
    href: "/viewer/gca",
  },
  {
    id: "miss-catherine",
    prefix: "🍂",
    title: "미스케더린",
    subtitle: "무화와 전설 사이의 이야기",
    coverUrl: "/miss-catherine.png",
    href: "/viewer/miss-catherine",
  },
];

export default function HomeWorks() {
  return (
    <section className="pt-8 pb-6 px-8" style={{ background: "#fdf8f3" }}>
      <div className="max-w-[1440px] mx-auto">
        {/* Section heading */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-6 h-px" style={{ background: "#c0392b" }} />
          <h2 className="text-base font-bold text-[#2c1a0e]">세계로 떠나기</h2>
        </div>

        {/* Horizontal scroll track */}
        <div
          className="flex gap-4 pb-3"
          style={{
            overflowX: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {WORKS.map((work) => (
            <a
              key={work.id}
              href={work.href}
              className="flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200 block"
              style={{ width: "215px", background: "#ffffff", textDecoration: "none" }}
            >
              {/* Cover image */}
              <div
                className="relative w-full overflow-hidden"
                style={{ height: "160px" }}
              >
                {work.coverUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={work.coverUrl}
                    alt={work.title}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    style={{ display: "block" }}
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{ background: work.fallbackGradient ?? "#c0d4a0" }}
                  />
                )}
                {/* Bottom scrim for readability */}
                <div
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    height: "48px",
                    background: "linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 100%)",
                  }}
                />
              </div>

              {/* Info */}
              <div className="p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-[#2c1a0e] mb-1 leading-snug">
                      {work.prefix} {work.title}
                    </h3>
                    <p className="text-[11px] text-[#9b7d65] leading-snug whitespace-pre-line">
                      {work.subtitle}
                    </p>
                  </div>
                  {/* Arrow button */}
                  <button className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 border border-[#e8c9a0] text-[#9b7d65] hover:bg-[#2c1a0e] hover:border-[#2c1a0e] hover:text-white">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
