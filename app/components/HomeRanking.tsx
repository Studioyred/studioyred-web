const C = {
  textPrimary: "#2c1a0e",
  textSecondary: "#6b4c35",
  textTertiary: "#9b7d65",
  bgPrimary: "#fdf8f3",
  bgSecondary: "#f5ede0",
  borderTertiary: "rgba(155,125,101,0.18)",
  borderSecondary: "rgba(155,125,101,0.38)",
  accent: "#B85C38",
  radiusLg: "14px",
  radiusMd: "10px",
} as const;

export default function HomeRanking() {
  return (
    <section style={{ background: C.bgPrimary, padding: "2.5rem 2rem 3rem" }}>
      {/* Main content — centered 680px */}
      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          fontFamily: "'Noto Serif KR', serif",
          color: C.textPrimary,
        }}
      >
        {/* Hero */}
        <div
          style={{
            textAlign: "center",
            padding: "2rem 0 1.5rem",
            borderBottom: `0.5px solid ${C.borderTertiary}`,
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "inline-block",
              fontSize: "11px",
              letterSpacing: "0.1em",
              color: C.textTertiary,
              border: `0.5px solid ${C.borderSecondary}`,
              padding: "4px 14px",
              borderRadius: "20px",
              marginBottom: "1rem",
            }}
          >
            Wattpad 전체 · 전 세계 독자
          </div>
          <h3
            style={{
              fontFamily: "'Nanum Myeongjo', serif",
              fontSize: "22px",
              fontWeight: 700,
              marginBottom: "0.5rem",
            }}
          >
            《Friends》는 왜 귀신 퇴치물이 아닌가
          </h3>
          <div style={{ fontSize: "13px", color: C.textTertiary }}>작가 동기(恩風) · 2024</div>
        </div>

        {/* 종합 최고 성적 */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "0.08em",
              color: C.textTertiary,
              textTransform: "uppercase" as const,
              marginBottom: "1rem",
              paddingBottom: "0.5rem",
              borderBottom: `0.5px solid ${C.borderTertiary}`,
            }}
          >
            종합 최고 성적
          </div>
          <div
            style={{
              background: C.bgSecondary,
              borderRadius: C.radiusLg,
              padding: "1.25rem 1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
            }}
          >
            <div
              style={{
                fontFamily: "'Nanum Myeongjo', serif",
                fontSize: "36px",
                fontWeight: 700,
                color: C.accent,
                minWidth: "80px",
                textAlign: "center" as const,
                lineHeight: 1,
              }}
            >
              <span style={{ fontSize: "18px" }}>#</span>118
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "15px", fontWeight: 500, marginBottom: "4px" }}>
                ghosts{" "}
                <span
                  style={{
                    background: C.accent,
                    color: "#fff",
                    fontSize: "10px",
                    padding: "2px 8px",
                    borderRadius: "10px",
                    marginLeft: "8px",
                    verticalAlign: "middle",
                  }}
                >
                  최고 성적
                </span>
              </div>
              <div style={{ fontSize: "12px", color: C.textSecondary }}>전체 24,200개 작품 중</div>
            </div>
            <div style={{ fontSize: "13px", color: C.textSecondary, textAlign: "right" as const, minWidth: "70px" }}>
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: 500,
                  color: C.textPrimary,
                  display: "block",
                }}
              >
                상위 0.49%
              </span>
            </div>
          </div>
        </div>

        {/* 성적표 원본 */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "0.08em",
              color: C.textTertiary,
              textTransform: "uppercase" as const,
              marginBottom: "1rem",
              paddingBottom: "0.5rem",
              borderBottom: `0.5px solid ${C.borderTertiary}`,
            }}
          >
            성적표 원본
          </div>
          <div
            style={{
              border: `0.5px solid ${C.borderTertiary}`,
              borderRadius: C.radiusLg,
              overflow: "hidden",
              marginBottom: "2rem",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/novel_record.png"
              alt="Friends 왓패드 분류별 성적표"
              style={{ width: "100%", display: "block" }}
            />
          </div>
        </div>

        {/* 왜 귀신 퇴치물이 아닌가 */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              fontFamily: "'Nanum Myeongjo', serif",
              fontSize: "17px",
              fontWeight: 700,
              marginBottom: "1rem",
              paddingLeft: "1rem",
              borderLeft: `3px solid ${C.accent}`,
            }}
          >
            왜 귀신 퇴치물이 아닌가?
          </div>
          <div style={{ fontSize: "14px", lineHeight: 1.9, color: C.textSecondary }}>
            <p style={{ marginBottom: "0.75rem" }}>
              《Friends》는 귀신을 물리치거나 퇴치하는 이야기로 시작하지 않았다. 작가는 동양의 전통적인 사후 세계관에 더 관심이 있었다.
            </p>
            <p style={{ marginBottom: "0.75rem" }}>
              한국의 민간 신앙과 설화에서 귀신은 반드시 악한 존재가 아니다. 억울하게 죽은 사람, 미련이 남은 사람, 갈 곳을 찾지 못한 사람, 혹은 단순히 인간 세상을 그리워하는 존재로 등장한다.
            </p>
            <p style={{ marginBottom: "0.75rem" }}>작가는 이러한 관점에서 하나의 질문을 던졌다.</p>
          </div>
          <div
            style={{
              fontFamily: "'Nanum Myeongjo', serif",
              fontSize: "15px",
              color: C.textPrimary,
              textAlign: "center" as const,
              padding: "1.25rem",
              background: C.bgSecondary,
              borderRadius: C.radiusMd,
              margin: "1.25rem 0",
              fontStyle: "italic",
            }}
          >
            "만약 귀신도 우리처럼 살아간다면 어떨까?"
          </div>
          <div style={{ fontSize: "14px", lineHeight: 1.9, color: C.textSecondary }}>
            <p>
              그 결과 탄생한 세계가 《Friends》이다. 이 작품에서 귀신들은 퇴치의 대상이 아니다. 그들은 직업을 찾고, 친구를 사귀고, 가족을 만들고, 때로는 실수를 저지르는 평범한 존재들이다.
            </p>
          </div>
        </div>

        {/* 사후 세계는 삶의 연장 */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              fontFamily: "'Nanum Myeongjo', serif",
              fontSize: "17px",
              fontWeight: 700,
              marginBottom: "1rem",
              paddingLeft: "1rem",
              borderLeft: `3px solid ${C.accent}`,
            }}
          >
            사후 세계는 삶의 연장이다
          </div>
          <div style={{ fontSize: "14px", lineHeight: 1.9, color: C.textSecondary }}>
            <p style={{ marginBottom: "0.75rem" }}>
              《Friends》의 사후 세계는 천국과 지옥의 이분법으로 구성되지 않는다. 오히려 한국 전통 설화에 등장하는 저승과 매우 유사하다.
            </p>
            <p style={{ marginBottom: "0.75rem" }}>
              죽음은 끝이 아니라 또 다른 사회로의 이동이다. 그곳에도 병원이 있고, 행정 기관이 있고, 복지 제도가 있으며, 심판과 재활 과정이 존재한다.
            </p>
            <p style={{ marginBottom: "0.75rem" }}>
              작품 속 염라대왕은 절대적인 신이라기보다 사후 세계를 운영하는 행정 책임자에 가깝다. 저승사자는 영혼을 관리하는 공무원이고, Agent M은 현장 상담사이며, General은 복잡한 사건을 해결하는 관리자 역할을 맡는다.
            </p>
            <p>따라서 이 작품의 핵심 갈등은 선과 악의 전쟁이 아니라,</p>
          </div>
          <div
            style={{
              fontFamily: "'Nanum Myeongjo', serif",
              fontSize: "15px",
              color: C.textPrimary,
              textAlign: "center" as const,
              padding: "1.25rem",
              background: C.bgSecondary,
              borderRadius: C.radiusMd,
              margin: "1.25rem 0",
              fontStyle: "italic",
            }}
          >
            "죽은 뒤에도 어떻게 함께 살아갈 것인가?"
          </div>
        </div>

        {/* 카테고리 그리드 */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "0.08em",
              color: C.textTertiary,
              textTransform: "uppercase" as const,
              marginBottom: "1rem",
              paddingBottom: "0.5rem",
              borderBottom: `0.5px solid ${C.borderTertiary}`,
            }}
          >
            왜 이렇게 다양한 분류에서 랭킹되는가
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "12px",
            }}
          >
            {[
              {
                name: "Ghosts",
                annotation: "귀신 이야기",
                desc: "등장인물 대부분이 귀신, 도깨비, 저승사자, 구미호 등 전설 속 존재들. 하지만 공포보다는 일상에 가깝다.",
              },
              {
                name: "Afterlife",
                annotation: "사후 세계관",
                desc: "작품의 핵심 무대는 사후 세계. 독자들은 죽음 이후의 사회와 행정 시스템에 높은 관심을 보였다.",
              },
              {
                name: "Sitcom",
                annotation: "시트콤",
                desc: "귀신들이 성과급을 요구하고, 도깨비가 육아 문제로 고민하고, 구미호가 취업 상담을 받는다.",
              },
              {
                name: "Mythology",
                annotation: "신화·설화",
                desc: "한국과 북유럽, 세계 각국의 설화 속 존재들이 하나의 세계관 안에서 공존한다.",
              },
              {
                name: "Space",
                annotation: "우주·SF",
                desc: "달 기지, 우주 개발, 다른 행성 개척. 사후 세계와 우주 개척이 동시에 존재하는 독특한 구조.",
              },
              {
                name: "Korean / Asian Fantasy",
                annotation: "동양 판타지",
                desc: "염라대왕, 도깨비, 저승사자, 구미호. 서양 판타지보다 동양적 사후관과 공동체 의식이 강하게 반영된다.",
              },
            ].map((cat) => (
              <div
                key={cat.name}
                style={{
                  background: C.bgPrimary,
                  border: `0.5px solid ${C.borderTertiary}`,
                  borderRadius: C.radiusLg,
                  padding: "1rem",
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: 500, marginBottom: "6px" }}>{cat.name}</div>
                <div style={{ fontSize: "11px", color: C.textTertiary, marginBottom: "8px" }}>{cat.annotation}</div>
                <div style={{ fontSize: "12px", color: C.textSecondary, lineHeight: 1.6 }}>{cat.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 작품 평 */}
        <div
          style={{
            borderTop: `0.5px solid ${C.borderTertiary}`,
            paddingTop: "1.5rem",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "0.08em",
              color: C.textTertiary,
              marginBottom: "1rem",
            }}
          >
            작품 평
          </div>
          <div
            style={{
              fontFamily: "'Nanum Myeongjo', serif",
              fontSize: "14px",
              lineHeight: 2,
              color: C.textSecondary,
            }}
          >
            《Friends》는 귀신 이야기처럼 보이지만 사실은 사람 이야기다.<br />
            작품에 등장하는 귀신들은 죽음 이후의 존재이지만, 그들이 고민하는 문제는 인간과 크게 다르지 않다.<br />
            일, 가족, 사랑, 우정, 책임, 그리고 살아가는 이유.<br />
            <br />
            이 작품이 여러 장르에서 동시에 반응을 얻는 이유는, 공포 소설도, 판타지 소설도, 시트콤도 — 어느 한 장르에 머무르지 않고 그 경계 위를 자유롭게 오가기 때문이다.
          </div>
          <div
            style={{
              fontFamily: "'Nanum Myeongjo', serif",
              fontSize: "15px",
              color: C.textPrimary,
              textAlign: "center" as const,
              marginTop: "1.5rem",
              fontStyle: "italic",
            }}
          >
            독자들은 귀신을 보러 왔다가, 결국 자신과 비슷한 존재들을 만나게 된다.
          </div>
        </div>
      </div>
    </section>
  );
}
