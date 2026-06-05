"use client";

import Image from "next/image";
import Link from "next/link";

// 각 작품의 클릭 영역 (뷰포트 기준 %, 모니터/해상도에 따라 조정 가능)
const HOTSPOTS = [
  { id: "little-groom", label: "리틀그룸", left: 33, top: 28, width: 22, height: 30 },
  { id: "flower",       label: "Flower",   left: 14, top: 42, width: 18, height: 28 },
  { id: "friends",      label: "Friends",  left: 62, top: 25, width: 22, height: 30 },
  { id: "gca",          label: "GCA",      left:  4, top: 62, width: 18, height: 24 },
  { id: "miss-catherine", label: "미스캐터린", left: 65, top: 56, width: 18, height: 26 },
] as const;

export default function WorldMap() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Image
        src="/홈페이지%20시안1.png"
        alt="Studio Y Red 세계관 지도"
        fill
        className="object-cover object-center"
        priority
        unoptimized
      />

      {HOTSPOTS.map((spot) => (
        <Link
          key={spot.id}
          href={`/viewer/${spot.id}`}
          aria-label={`${spot.label} 보기`}
          className="absolute group rounded border border-transparent hover:border-white/30 hover:bg-white/[0.07] transition-all duration-300"
          style={{
            left:   `${spot.left}%`,
            top:    `${spot.top}%`,
            width:  `${spot.width}%`,
            height: `${spot.height}%`,
          }}
        >
          <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-white bg-black/60 backdrop-blur-sm px-3 py-0.5 rounded-full whitespace-nowrap shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            {spot.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
