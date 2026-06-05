import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import HomeRanking from "../components/HomeRanking";

export const metadata = {
  title: "성적표 · Friends — Studio Y Red",
  description: "Friends 왓패드 랭킹 성적표 및 작품 소개",
};

export default function RankingPage() {
  return (
    <div style={{ background: "#fdf8f3", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HomeHeader />

      <main style={{ flex: 1, paddingTop: "68px" }}>
        {/* 페이지 상단 타이틀 */}
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
            <span style={{ fontSize: "11px", letterSpacing: "0.4em", color: "#9b7d65", textTransform: "uppercase", fontWeight: 600 }}>
              Wattpad Ranking
            </span>
            <div style={{ width: "48px", height: "1px", background: "#c9a068" }} />
          </div>
          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 800,
              color: "#2c1a0e",
              fontFamily: "'Nanum Myeongjo', serif",
              letterSpacing: "-0.02em",
              marginBottom: "10px",
            }}
          >
            성적표
          </h1>
          <p style={{ fontSize: "13px", color: "#6b4c35", opacity: 0.8 }}>
            Friends · 왓패드 전 세계 독자 랭킹 기록
          </p>
        </section>

        <HomeRanking />
      </main>

      <HomeFooter />
    </div>
  );
}
