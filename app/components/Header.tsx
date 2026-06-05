"use client";

import { useState, useEffect } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#fdf8f3]/90 backdrop-blur-md border-b border-[#e8c9a0]/40"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <span className="text-[#c0392b] font-bold text-xl tracking-widest select-none">
            Y
          </span>
          <span
            className={`font-semibold text-sm tracking-[0.2em] transition-colors duration-300 ${
              scrolled ? "text-[#2c1a0e]" : "text-[#2c1a0e]"
            }`}
          >
            STUDIO Y RED
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: "Works", href: "#works" },
            { label: "Studio", href: "#about" },
            { label: "Contact", href: "#contact" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm tracking-wider text-[#6b4c35] hover:text-[#c0392b] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#c0392b] after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
