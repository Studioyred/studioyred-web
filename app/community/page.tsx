import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import CommunityList from "./CommunityList";

export default function CommunityPage() {
  return (
    <div style={{ background: "#fdf8f3", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HomeHeader />
      <main style={{ flex: 1, paddingTop: "68px" }}>
        <section
          style={{
            padding: "48px 32px 36px",
            textAlign: "center",
            background: "linear-gradient(to bottom, #f5e8d4 0%, #fdf8f3 100%)",
            borderBottom: "1px solid rgba(232,201,160,0.35)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginBottom: "14px" }}>
            <div style={{ width: "48px", height: "1px", background: "#c9a068" }} />
            <span style={{ fontSize: "11px", letterSpacing: "0.4em", color: "#9b7d65", textTransform: "uppercase", fontWeight: 600 }}>Community</span>
            <div style={{ width: "48px", height: "1px", background: "#c9a068" }} />
          </div>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 800, color: "#2c1a0e", letterSpacing: "-0.02em", marginBottom: "10px" }}>
            커뮤니티 게시판
          </h1>
          <p style={{ fontSize: "13px", color: "#6b4c35", opacity: 0.8 }}>
            자유롭게 이야기를 나눠보세요.
          </p>
        </section>
        <CommunityList />
      </main>
      <HomeFooter />
    </div>
  );
}
