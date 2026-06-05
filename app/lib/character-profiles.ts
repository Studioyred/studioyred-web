export type CharProfile = {
  nameKo: string;
  nameEn?: string;
  subtitle?: string;
  // 프로필 테이블
  identity?: string;     // 본 정체
  affiliation?: string;  // 현재 소속
  role?: string;         // 역할
  family?: string;       // 가족
  friends?: string;      // 친구
  territory?: string;    // 활동 지역
  traits?: string;       // 특징
  likes?: string;        // 좋아하는 것
  dislikes?: string;     // 싫어하는 것
  relations?: string;    // 관계
  // 메모
  caption?: string;      // 사진 아래 한 줄
  descTitle?: string;    // 설명 노트 제목
  desc?: string;         // 설명 노트 내용
  quote?: string;        // 명대사
  episodes?: string[];   // 주요 에피소드
};

// 파일명을 키로 사용
export const CHAR_PROFILES: Record<string, CharProfile> = {
  "06_Agent_M.png": {
    nameKo: "에이전트 M",
    nameEn: "Agent M",
    subtitle: "과부 귀신의 사회 적응 버전",
    identity: "과부 귀신",
    affiliation: "GCA (Ghost Consultant Agency)",
    role: "현장 요원 / 정보 전달 / 사건 보조",
    family: "메신저의 배우자 (사망) / 아들 1명 (대학 다님)",
    friends: "훌드라, 도깨비",
    territory: "인간 세계 / 저승 / 오딘 왕국",
    traits: "뛰어난 외모가 아님, 하지만 보좌와 상황력 탁월. 어딜 가든 빠르게 적응.",
    likes: "수다 떨기, 시장 구경, 시원 정보, 아들 용돈 챙겨주기, 맛있는 음식",
    dislikes: "혼자 남겨지는 것, 큰 소리, 딱딱한 분위기, 서류 작업",
    relations: "메신저와 결혼, 오딘 왕국 유학, 훌드라와 친구, 도깨비와 동기",
    caption: "완벽해 보이지 않아도,\n어딘가 제일 든든한 사람. ♡",
    descTitle: "Agent M은 이런 존재",
    desc: "죽은 뒤에도 다시 사람들 사이를 돌아다니며\n함께 살아가는 법을 배우는 귀신.\n화려하지도, 특별하지도 않지만\n어디에나 있는, 그래서 더 정이 가는 존재.\n\n외모는 평범, 실수는 많지만,\n그래서 더 사람스러운 캐릭터.",
    quote: "무섭게 살기엔 너무 정이 많고,\n조용히 살기엔 너무 사건이 많다.",
    episodes: [
      "시장에서 선 누나 사면",
      "아들 용돈 플랙스 날",
      "훌드라 결혼식 참석",
      "귀신 면접 비서 사고",
      "GCA 현장 지원",
      "메신저와의 신혼 생활",
      "도깨비와 합동 작전",
      "200명과 야바위한 날(?)",
    ],
  },
  "01_donggi_adult.png": {
    nameKo: "장군",
    nameEn: "General",
    subtitle: "조용하지만 든든한 리더",
    caption: "모두의 형.",
    descTitle: "장군은 이런 존재",
    desc: "조용하지만 든든한 리더 모두의 형.",
  },
  "03_dokaebi.png": {
    nameKo: "도깨비",
    nameEn: "Dokkaebi",
    subtitle: "시고들씨 분위기 메이커",
    caption: "호방을 사랑함.",
    descTitle: "도깨비는 이런 존재",
    desc: "시고들씨 분위기 메이커 호방을 사랑함.",
  },
  "04_messenger.png": {
    nameKo: "메신저",
    nameEn: "Messenger",
    subtitle: "약자. 눈치 없음",
    caption: "호기심이 많다.",
    descTitle: "메신저는 이런 존재",
    desc: "약자. 눈치 없음 호기심이 많다.",
  },
  "05_grimRipper.png": {
    nameKo: "그림리퍼",
    nameEn: "Grim Reaper",
    subtitle: "말이 적고 조용함",
    caption: "하지만 다 보고 있다.",
    descTitle: "그림리퍼는 이런 존재",
    desc: "말이 적고 조용함 하지만 다 보고 있다.",
  },
};
