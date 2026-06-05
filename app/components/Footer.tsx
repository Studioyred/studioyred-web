export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-12 px-6 border-t border-[#e8c9a0]/40">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="text-[#c0392b] font-bold text-lg tracking-widest">Y</span>
          <span className="text-sm tracking-[0.2em] text-[#9b7d65]">STUDIO Y RED</span>
        </div>

        <p className="text-xs text-[#c9a97a] tracking-wider text-center">
          Where Warm Stories Are Made
        </p>

        <p className="text-xs text-[#c9a97a] tracking-wider">
          © {year} Studio Y Red. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
