"use client";

import { useEffect, useRef, useState } from "react";

const values = [
  {
    icon: "✦",
    title: "Sincerity",
    description:
      "Every work begins with sincerity. We put the human heart before commercial calculation.",
  },
  {
    icon: "◎",
    title: "Warmth",
    description:
      "In a cold and fast-moving world, we create moments where you can feel a brief sense of warmth.",
  },
  {
    icon: "◇",
    title: "Attention",
    description:
      "We pour care into every small detail. Even what goes unnoticed can still be felt.",
  },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="py-32 px-6 bg-[#f5ede0]/50">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <div
          className={`transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="text-xs tracking-[0.4em] text-[#c0392b] mb-4 uppercase">
            About
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div
            className={`transition-all duration-700 delay-150 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2c1a0e] leading-tight mb-8">
              Stories
              <br />
              Connect the World
            </h2>
            <div className="space-y-5 text-[#6b4c35] leading-relaxed">
              <p>
                Studio Y Red believes in the power of stories. We believe that a story
                made with sincerity — however small, however quiet — will always reach
                someone&apos;s heart.
              </p>
              <p>
                We do not rush. We take time with every frame, every line of dialogue,
                every emotion — looking closely before we commit.
              </p>
              <p>
                In an era overflowing with content consumed and forgotten, stories that
                stay with you are what the world needs most. That is the kind of story
                Studio Y Red will make.
              </p>
            </div>
          </div>

          <div
            className={`space-y-5 transition-all duration-700 delay-300 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className="bg-[#2c1a0e] text-[#fdf8f3] p-10 rounded-sm relative overflow-hidden">
              <div className="absolute top-4 left-6 text-6xl text-[#c0392b]/30 font-serif leading-none select-none">
                &ldquo;
              </div>
              <p className="relative z-10 text-lg md:text-xl leading-relaxed font-light mt-4">
                Small stories can change big worlds.
                <br />
                We are here to write those small stories.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-8 h-px bg-[#c0392b]" />
                <span className="text-xs tracking-widest text-[#9b7d65]">
                  Studio Y Red
                </span>
              </div>
            </div>

            {values.map((value, i) => (
              <div
                key={value.title}
                className="flex gap-5 p-5 bg-[#fdf8f3] rounded-sm border border-[#e8c9a0]/50 transition-all duration-500"
                style={{ transitionDelay: `${(i + 3) * 0.1}s` }}
              >
                <span className="text-[#c0392b] text-lg mt-0.5 flex-shrink-0">
                  {value.icon}
                </span>
                <div>
                  <h4 className="font-semibold text-[#2c1a0e] mb-1.5">
                    {value.title}
                  </h4>
                  <p className="text-sm text-[#9b7d65] leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
