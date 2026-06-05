"use client";

import { useState } from "react";

function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.8 8s-.195-1.377-.795-1.984c-.76-.797-1.613-.8-2.003-.847C16.203 5 12 5 12 5s-4.203 0-7.002.169c-.39.047-1.243.05-2.003.847C2.395 6.623 2.2 8 2.2 8S2 9.62 2 11.24v1.517C2 14.375 2.2 16 2.2 16s.195 1.377.795 1.984c.76.797 1.769.773 2.215.856C6.68 18.994 12 19 12 19s4.203-.006 7.002-.175c.39-.047 1.243-.059 2.003-.856.6-.607.795-1.984.795-1.984S22 14.375 22 12.757V11.24C22 9.62 21.8 8 21.8 8zM9.75 14.852V9.148L15.5 12l-5.75 2.852z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.015.043.031.057a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export default function HomeFooter() {
  const [isDark, setIsDark] = useState(true);

  return (
    <footer
      className="px-8 py-4"
      style={{
        background: "#fdf8f3",
        borderTop: "1px solid rgba(232,201,160,0.3)",
      }}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between flex-wrap gap-3">
        {/* Social icons */}
        <div className="flex items-center gap-3">
          {[
            { icon: <YouTubeIcon />, href: "#", label: "YouTube" },
            { icon: <InstagramIcon />, href: "#", label: "Instagram" },
            { icon: <XIcon />, href: "#", label: "X (Twitter)" },
            { icon: <DiscordIcon />, href: "#", label: "Discord" },
          ].map(({ icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-150"
              style={{ color: "#9b7d65" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#c0392b")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9b7d65")}
            >
              {icon}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-[11px] text-[#9b7d65]">
          © 2024 Studio Y Red. All rights reserved.
        </p>

        {/* Right: links + theme toggle */}
        <div className="flex items-center gap-4">
          {["이용약관", "개인정보처리방침", "문의하기"].map((label) => (
            <a
              key={label}
              href="#"
              className="text-[11px] transition-colors duration-150"
              style={{ color: "#9b7d65" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#2c1a0e")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9b7d65")}
            >
              {label}
            </a>
          ))}

          {/* Theme toggle */}
          <div
            className="flex items-center gap-0.5 p-1 rounded-full"
            style={{ border: "1.5px solid rgba(232,201,160,0.5)" }}
          >
            <button
              onClick={() => setIsDark(false)}
              className="w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-150"
              style={{
                background: !isDark ? "transparent" : "transparent",
                color: !isDark ? "#c0392b" : "#9b7d65",
              }}
              aria-label="라이트 모드"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </button>
            <button
              onClick={() => setIsDark(true)}
              className="w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-150"
              style={{
                background: isDark ? "#2c1a0e" : "transparent",
                color: isDark ? "white" : "#9b7d65",
              }}
              aria-label="다크 모드"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
