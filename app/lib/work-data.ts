export type Character = {
  name: string;
  nameEn: string;
  role: string;
  desc: string;
};

export type OstTrack = {
  title: string;
  artist: string;
  src?: string;
};

export type WorkData = {
  title: string;
  titleEn: string;
  accentColor: string;
  characters: Character[];
  ost: OstTrack[];
};

export const WORK_DATA: Record<string, WorkData> = {
  "friends": {
    title: "Friends",
    titleEn: "FRIENDS",
    accentColor: "#C97A3C",
    characters: [
      { name: "장군", nameEn: "General", role: "", desc: "조용하지만 든든한 리더 모두의 형." },
      { name: "도깨비", nameEn: "Dokkaebi", role: "", desc: "시고들씨 분위기 메이커 호방을 사랑함." },
      { name: "메신저", nameEn: "Messenger", role: "", desc: "약자. 눈치 없음 호기심이 많다." },
      { name: "Agent M", nameEn: "Agent M", role: "", desc: "이성적이고 냉정함 모두를 관리." },
      { name: "그림리파", nameEn: "Grim Reaper", role: "", desc: "말이 적고 조용함 하지만 다 보고 있다." },
    ],
    ost: [
      { title: "Pressure Points", artist: "Camel" },
      { title: "Roads", artist: "Portishead" },
      { title: "Teardrop", artist: "Massive Attack" },
      { title: "Meiso", artist: "DJ Krush" },
      { title: "Feather", artist: "Nujabes" },
    ],
  },
  "little-groom": {
    title: "리틀그룸",
    titleEn: "LITTLE GROOM",
    accentColor: "#c0392b",
    characters: [],
    ost: [
      { title: "Kiss the Rain", artist: "Yiruma" },
      { title: "River Flows in You", artist: "Yiruma" },
    ],
  },
  "flower": {
    title: "Flower",
    titleEn: "FLOWER",
    accentColor: "#6b4c8a",
    characters: [],
    ost: [],
  },
  "gca": {
    title: "GCA",
    titleEn: "GCA",
    accentColor: "#9b5a3c",
    characters: [],
    ost: [],
  },
  "miss-catherine": {
    title: "Miss Catherine",
    titleEn: "MISS CATHERINE",
    accentColor: "#7a3f2e",
    characters: [],
    ost: [],
  },
};
