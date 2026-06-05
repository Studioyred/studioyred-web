"use client";

import { useEffect, useRef, useState } from "react";

export default function Contact() {
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
    <section id="contact" className="py-32 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <div
          className={`transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="text-xs tracking-[0.4em] text-[#c0392b] mb-4 uppercase">
            Contact
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#2c1a0e] leading-tight mb-4">
            Let&apos;s Share
            <br />
            a Story
          </h2>
          <div className="h-px bg-gradient-to-r from-[#c0392b]/30 via-[#e8c9a0] to-transparent mb-16" />
        </div>

        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 transition-all duration-700 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="space-y-10">
            <p className="text-[#6b4c35] leading-relaxed text-lg">
              A collaboration proposal, a project inquiry, or simply
              a hello — all are welcome.
              <br />
              The door to Studio Y Red is always open.
            </p>

            <div className="space-y-6">
              {[
                {
                  label: "Email",
                  value: "hello@studioyred.com",
                  href: "mailto:hello@studioyred.com",
                },
                {
                  label: "Instagram",
                  value: "@studioyred",
                  href: "#",
                },
                {
                  label: "YouTube",
                  value: "Studio Y Red",
                  href: "#",
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-5 group"
                >
                  <span className="text-xs tracking-widest text-[#9b7d65] w-20 flex-shrink-0">
                    {item.label}
                  </span>
                  <div className="flex-1 h-px bg-[#e8c9a0]/60" />
                  <span className="text-sm text-[#2c1a0e] group-hover:text-[#c0392b] transition-colors duration-300">
                    {item.value}
                  </span>
                </a>
              ))}
            </div>

            <div className="pt-4">
              <p className="text-xs tracking-widest text-[#9b7d65] mb-2">
                Location
              </p>
              <p className="text-[#2c1a0e]">Seoul, South Korea</p>
            </div>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs tracking-widest text-[#9b7d65] mb-2">
                Name
              </label>
              <input
                type="text"
                className="w-full bg-transparent border border-[#e8c9a0] px-4 py-3.5 text-sm text-[#2c1a0e] placeholder-[#c9a97a] focus:outline-none focus:border-[#c0392b] transition-colors duration-300 rounded-sm"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-xs tracking-widest text-[#9b7d65] mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full bg-transparent border border-[#e8c9a0] px-4 py-3.5 text-sm text-[#2c1a0e] placeholder-[#c9a97a] focus:outline-none focus:border-[#c0392b] transition-colors duration-300 rounded-sm"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-xs tracking-widest text-[#9b7d65] mb-2">
                Message
              </label>
              <textarea
                rows={5}
                className="w-full bg-transparent border border-[#e8c9a0] px-4 py-3.5 text-sm text-[#2c1a0e] placeholder-[#c9a97a] focus:outline-none focus:border-[#c0392b] transition-colors duration-300 rounded-sm resize-none"
                placeholder="Write your message here."
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-[#c0392b] text-white text-sm tracking-widest hover:bg-[#a93226] transition-colors duration-300 rounded-sm"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
