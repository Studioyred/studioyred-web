"use client";

const items = [
  "Little Groom",
  "✦",
  "GCA",
  "✦",
  "Miss Catherine",
  "✦",
  "Studio Y Red",
  "✦",
  "Warm Stories",
  "✦",
  "Little Groom",
  "✦",
  "GCA",
  "✦",
  "Miss Catherine",
  "✦",
  "Studio Y Red",
  "✦",
  "Warm Stories",
  "✦",
];

export default function Marquee() {
  return (
    <div className="overflow-hidden py-5 bg-[#2c1a0e] relative">
      <div
        className="flex gap-10 whitespace-nowrap"
        style={{
          animation: "marquee 28s linear infinite",
          width: "max-content",
        }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className={`text-sm tracking-widest flex-shrink-0 ${
              item === "✦" ? "text-[#c0392b]" : "text-[#e8c9a0]/70"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
