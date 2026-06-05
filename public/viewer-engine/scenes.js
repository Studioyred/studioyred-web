/* ============================================================
   scenes.js — 콘텐츠 정의 파일
   이 파일만 수정하면 어떤 프로젝트에도 재사용 가능합니다.
   ============================================================ */

const SCENES = [
  /* ──────────────────────────────────────────────────────────
     SCENE 1 · Friends EP.2 · 우주기지
     ────────────────────────────────────────────────────────── */
  {
    id:       "friends-space",
    label:    "FRIENDS  ·  EP.2",
    title:    "우주기지, 어딘가",

    /* 배경: 이미지 없을 때 CSS 그라디언트 사용 */
    bgImage:    null,
    bgGradient: "radial-gradient(ellipse at 28% 38%, #0d1f3c 0%, #060e1e 55%, #020509 100%)",
    bgColor:    "#020509",

    /* 앰비언트 효과: "stars" | "dust" | "snow" | "cherry-blossom" | "curtain" */
    ambient: ["stars", "dust"],
    crt:     true,                        /* CRT 스캔라인 + 플리커 */
    overlay: "rgba(0, 8, 28, 0.30)",      /* 분위기 색조 오버레이 */

    /* 오디오 */
    music:       null,                    /* "assets/space-ambient.mp3" */
    musicVolume: 0.45,

    /* 자막 시퀀스 */
    textColor: "#a8c8f0",
    texts: [
      {
        text:  "지구에서 150년이 흘렀다는 걸,\n아무도 실감하지 못했다.",
        delay: 1200,
      },
      {
        text:  "그날 저녁, 도깨비가 전화를 걸었다.",
        delay: 6000,
      },
      {
        text:  "\"얘들아.\n제너럴 집에 놀러가자.\"",
        delay: 10000,
      },
    ],

    duration: 16000,   /* ms 후 자동 다음 씬. 0 = 수동 전환 */
  },

  /* ──────────────────────────────────────────────────────────
     SCENE 2 · Little Groom · 은풍골 봄날 교실
     ────────────────────────────────────────────────────────── */
  {
    id:       "little-groom-spring",
    label:    "LITTLE GROOM  ·  봄",
    title:    "은풍골, 봄날의 교실",

    bgImage:    null,
    bgGradient: "linear-gradient(155deg, #fdf6e3 0%, #f5e4c0 40%, #e8d09a 100%)",
    bgColor:    "#f5e4c0",

    ambient: ["cherry-blossom", "dust", "curtain"],
    crt:     false,
    overlay: "rgba(255, 230, 160, 0.06)",

    music:       null,                    /* "assets/spring-theme.mp3" */
    musicVolume: 0.50,

    textColor: "#2c1a0e",
    texts: [
      {
        text:  "봄이 왔다.",
        delay: 1500,
      },
      {
        text:  "창문 너머로 벚꽃이 흩날리고,\n교실엔 분필 냄새가 가득했다.",
        delay: 5000,
      },
      {
        text:  "통기는 창밖을 바라보며 생각했다.\n'선주는 오늘도 안 오는 걸까.'",
        delay: 10500,
      },
    ],

    duration: 18000,
  },
];
