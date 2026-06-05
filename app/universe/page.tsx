import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";

export default function UniversePage() {
  return (
    <div style={{ background: "#fdf8f3", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HomeHeader />

      <main style={{ flex: 1, paddingTop: "68px" }}>

        {/* 상단 타이틀 */}
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
              World&apos;s Universe
            </span>
            <div style={{ width: "48px", height: "1px", background: "#c9a068" }} />
          </div>
          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 800,
              color: "#2c1a0e",
              letterSpacing: "-0.02em",
              marginBottom: "10px",
            }}
          >
            작품 세계관
          </h1>
          <p style={{ fontSize: "13px", color: "#6b4c35", opacity: 0.8 }}>
            각 에피소드별 세계관입니다.
          </p>
        </section>

        {/* 액자 영역 */}
        <section style={{ padding: "48px 24px 56px", display: "flex", justifyContent: "center" }}>
          <div
            style={{
              maxWidth: "1200px",
              width: "100%",
              boxShadow: "0 32px 80px rgba(80,40,10,0.22), 0 4px 16px rgba(80,40,10,0.10)",
              borderRadius: "4px",
            }}
          >
            {/* 바깥 나무 프레임 */}
            <div
              style={{
                border: "12px solid #6b3a14",
                borderRadius: "4px",
                padding: "4px",
                background: "#b8863c",
              }}
            >
              {/* 금 선 */}
              <div
                style={{
                  border: "2px solid #d4a240",
                  padding: "18px",
                  background: "#ede3cc",
                }}
              >
                {/* 코너 장식 */}
                <div style={{ position: "relative" }}>
                  {[
                    { top: "-6px", left: "-6px" },
                    { top: "-6px", right: "-6px" },
                    { bottom: "-6px", left: "-6px" },
                    { bottom: "-6px", right: "-6px" },
                  ].map((pos, i) => (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        width: "14px",
                        height: "14px",
                        background: "#d4a240",
                        borderRadius: "50%",
                        zIndex: 2,
                        ...pos,
                      }}
                    />
                  ))}

                  {/* 이미지 */}
                  <div style={{ overflow: "hidden", lineHeight: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/homepage-Universe1.png"
                      alt="작품 세계관"
                      style={{
                        width: "100%",
                        height: "675px",
                        objectFit: "cover",
                        objectPosition: "center",
                        display: "block",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <HomeFooter />
    </div>
  );
}
