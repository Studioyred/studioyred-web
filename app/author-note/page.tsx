import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";

export default function AuthorNotePage() {
  return (
    <div style={{ background: "#fdf8f3", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HomeHeader />

      <main style={{ flex: 1, paddingTop: "68px" }}>

        {/* ── 페이지 상단 타이틀 ── */}
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
              Author&apos;s Note
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
            작가 노트
          </h1>
          <p style={{ fontSize: "13px", color: "#6b4c35", opacity: 0.8 }}>
            이야기가 태어난 시간과 공간, 그리고 기억 속 사람들의 이야기를 여기에 남깁니다.
          </p>
        </section>

        {/* ── 액자 영역 ── */}
        <section style={{ padding: "48px 24px 56px", display: "flex", justifyContent: "center" }}>
          {/* 바깥 그림자 + 액자 */}
          <div
            style={{
              maxWidth: "860px",
              width: "100%",
              boxShadow: "0 32px 80px rgba(80,40,10,0.22), 0 4px 16px rgba(80,40,10,0.10)",
              borderRadius: "4px",
            }}
          >
            {/* 1. 바깥 나무 프레임 */}
            <div
              style={{
                border: "12px solid #6b3a14",
                borderRadius: "4px",
                padding: "4px",
                background: "#b8863c",   /* 금색 내부 선 */
              }}
            >
              {/* 2. 금 선 */}
              <div
                style={{
                  border: "2px solid #d4a240",
                  padding: "18px",
                  background: "#ede3cc",  /* 크림 매트 */
                }}
              >
                {/* 3. 코너 장식 */}
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

                  {/* 4. 이미지 — 상단 타이틀 그래픽 잘라내기 */}
                  {/*
                    원본 1024×1536, 상단 ~12% 크롭
                    컨테이너 너비 기준 marginTop 계산:
                    12% of 1536px = 184px (원본) → display에서 동일 비율
                    = 12% * (height/width) * container_width의 % = 18% of container width
                  */}
                  <div style={{ overflow: "hidden", lineHeight: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/author-note.png"
                      alt="작가노트"
                      style={{
                        width: "100%",
                        display: "block",
                        marginTop: "-18%",  /* 상단 타이틀 영역 크롭 */
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 하단 인용구 ── */}
        <section
          style={{
            padding: "0 32px 64px",
            textAlign: "center",
            background: "linear-gradient(to bottom, #fdf8f3 0%, #f5e8d4 100%)",
            borderTop: "1px solid rgba(232,201,160,0.35)",
            paddingTop: "56px",
          }}
        >
          <div style={{ maxWidth: "520px", margin: "0 auto" }}>
            <div style={{ fontSize: "36px", color: "rgba(192,57,43,0.15)", fontFamily: "Georgia,serif", lineHeight: 1, marginBottom: "8px" }}>
              &ldquo;
            </div>
            <p
              style={{
                fontSize: "clamp(15px, 2vw, 19px)",
                fontWeight: 500,
                color: "#2c1a0e",
                lineHeight: 2,
                fontStyle: "italic",
                marginBottom: "20px",
              }}
            >
              사라져 가는 것들을 기억하고,<br />
              기억 속의 것들을 이야기로 남기고 싶었다.
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              <div style={{ width: "28px", height: "1px", background: "rgba(192,57,43,0.3)" }} />
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(192,57,43,0.3)", display: "inline-block" }} />
              <div style={{ width: "28px", height: "1px", background: "rgba(192,57,43,0.3)" }} />
            </div>
            <p style={{ fontSize: "11px", color: "#9b7d65", letterSpacing: "0.15em", marginTop: "14px" }}>
              Studio Y Red &nbsp;·&nbsp; 작가 노트 中
            </p>
          </div>
        </section>

      </main>

      <HomeFooter />
    </div>
  );
}
