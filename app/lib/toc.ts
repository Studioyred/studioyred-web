export type Episode = { id: number; title: string; url: string };
export type Season  = { num: number; episodes: Episode[] };

export type WorkToc =
  | { kind: "seasons"; seasons: Season[] }
  | { kind: "flat";    episodes: Episode[] };

export const TOC: Record<string, WorkToc> = {
  /* ──────────────── Little Groom ─────────────────────────────────── */
  "little-groom": {
    kind: "seasons",
    seasons: [
      {
        num: 1,
        episodes: [
          { id: 1622282282, title: "Scene 1 - Declaration 1",              url: "https://www.wattpad.com/1622282282" },
          { id: 1622290784, title: "Scene 2 - Declaration 2",              url: "https://www.wattpad.com/1622290784" },
          { id: 1622481056, title: "Scene 3 - Measle",                     url: "https://www.wattpad.com/1622481056" },
          { id: 1622501057, title: "Scene 4 - A tale that wasn't a Lie",   url: "https://www.wattpad.com/1622501057" },
          { id: 1622528616, title: "Scene 5 - The Agreement",              url: "https://www.wattpad.com/1622528616" },
          { id: 1622538195, title: "Scene 6 - Sharpness unvailed",         url: "https://www.wattpad.com/1622538195" },
          { id: 1622699571, title: "Scene 7 - Back from Death",            url: "https://www.wattpad.com/1622699571" },
          { id: 1622701330, title: "Scene 8 - Lesser Guardians",           url: "https://www.wattpad.com/1622701330" },
          { id: 1622756161, title: "Scene 9 - Peaceful Night",             url: "https://www.wattpad.com/1622756161" },
          { id: 1622756378, title: "Scene 10 - Doenjang Promise",          url: "https://www.wattpad.com/1622756378" },
        ],
      },
      {
        num: 2,
        episodes: [
          { id: 1623193130, title: "Scene 1 - Riverside Wash Place (Summer)", url: "https://www.wattpad.com/1623193130" },
          { id: 1623193841, title: "Scene 2 - The Smell of Ramyeon",          url: "https://www.wattpad.com/1623193841" },
          { id: 1623194025, title: "Scene 3 - Riverside Wash Place (Winter)", url: "https://www.wattpad.com/1623194025" },
          { id: 1623194514, title: "Scene 4 - Burned by Fire",               url: "https://www.wattpad.com/1623194514" },
          { id: 1623194897, title: "Scene 5 - Garden of Pine Trees",          url: "https://www.wattpad.com/1623194897" },
          { id: 1623195592, title: "Scene 6 - Compaints of Ghosts",           url: "https://www.wattpad.com/1623195592" },
          { id: 1623630049, title: "Scene 7 - The Rise of Legend",            url: "https://www.wattpad.com/1623630049" },
          { id: 1623630249, title: "Scene 8 - Baseball Kit",                  url: "https://www.wattpad.com/1623630249" },
          { id: 1623630981, title: "Scene 9 - Little Genesis",                url: "https://www.wattpad.com/1623630981" },
          { id: 1623631752, title: "Scene 10 - Judgement",                    url: "https://www.wattpad.com/1623631752" },
        ],
      },
      {
        num: 3,
        episodes: [
          { id: 1624218040, title: "Scene 1 - Flower Garden Village",                   url: "https://www.wattpad.com/1624218040" },
          { id: 1624219280, title: "Scene 2 - The First Full Moon of the Lunar Year",   url: "https://www.wattpad.com/1624219280" },
          { id: 1624220066, title: "Scene 3 - Messenger's wife",                        url: "https://www.wattpad.com/1624220066" },
          { id: 1624220422, title: "Scene 4 - Kimchi-Mandu",                            url: "https://www.wattpad.com/1624220422" },
          { id: 1624220818, title: "Scene 5 - The Realm of Women (ft. Liam Neeson)",   url: "https://www.wattpad.com/1624220818" },
          { id: 1624630004, title: "Scene 6 - Letter from Odin's Kingdom 1",           url: "https://www.wattpad.com/1624630004" },
          { id: 1624630308, title: "Scene 7 - Madam Chungju",                          url: "https://www.wattpad.com/1624630308" },
          { id: 1624630689, title: "Scene 8 - Dokkaebi's Another one",                 url: "https://www.wattpad.com/1624630689" },
          { id: 1624631351, title: "Scene 9 - Miss Catherine",                         url: "https://www.wattpad.com/1624631351" },
          { id: 1624631818, title: "Scene 10 - Rumor Travels Faster Than Light",       url: "https://www.wattpad.com/1624631818" },
        ],
      },
      {
        num: 4,
        episodes: [
          { id: 1625054428, title: "Scene 1 - Duplicator",                            url: "https://www.wattpad.com/1625054428" },
          { id: 1625057307, title: "Scene 2 - Food Poisoning",                        url: "https://www.wattpad.com/1625057307" },
          { id: 1625058228, title: "Scene 3 - Letter from Odin's Kingdom 2",          url: "https://www.wattpad.com/1625058228" },
          { id: 1625059280, title: "Scene 4 - Dandelion Pickle",                      url: "https://www.wattpad.com/1625059280" },
          { id: 1625059844, title: "Scene 5 - Bossam-jil (Widow-napping)",            url: "https://www.wattpad.com/1625059844" },
          { id: 1625060139, title: "Scene 6 - Guest from Odin's Kingdom",             url: "https://www.wattpad.com/1625060139" },
          { id: 1625060393, title: "Scene 7 - Taste of Tobacco",                      url: "https://www.wattpad.com/1625060393" },
          { id: 1625061611, title: "Scene 8 - A man from GIA (Ghost Intelligence Agency)", url: "https://www.wattpad.com/1625061611" },
          { id: 1625061945, title: "Scene 9 - Harvest",                               url: "https://www.wattpad.com/1625061945" },
          { id: 1625062164, title: "Scene 10 - The Smell of Ramyeon 2",               url: "https://www.wattpad.com/1625062164" },
        ],
      },
      {
        num: 5,
        episodes: [
          { id: 1626128640, title: "Scene 1 - Head of the Household",              url: "https://www.wattpad.com/1626128640" },
          { id: 1626129137, title: "Scene 2 - Once Upon a Time on the Radio",      url: "https://www.wattpad.com/1626129137" },
          { id: 1626133733, title: "Scene 3 - Two Faces of the Wash-Place",        url: "https://www.wattpad.com/1626133733" },
          { id: 1626134481, title: "Scene 4 - Madam Kitchen (Bueokdaegi)",         url: "https://www.wattpad.com/1626134481" },
          { id: 1626137539, title: "Scene 5 - Two, Two, Two Babies",               url: "https://www.wattpad.com/1626137539" },
          { id: 1626138388, title: "Scene 6 - Canvas Theater",                     url: "https://www.wattpad.com/1626138388" },
          { id: 1626139184, title: "Scene 7 - Manners Maketh a Woman",             url: "https://www.wattpad.com/1626139184" },
          { id: 1626141653, title: "Scene 8 - Autumn Sports Day",                  url: "https://www.wattpad.com/1626141653" },
          { id: 1626142245, title: "Scene 9 - Forbidden Love",                     url: "https://www.wattpad.com/1626142245" },
          { id: 1626143179, title: "Scene 10 - Song of Winter",                    url: "https://www.wattpad.com/1626143179" },
        ],
      },
      {
        num: 6,
        episodes: [
          { id: 1626826762, title: "Scene 1 - Hobbang Time",                         url: "https://www.wattpad.com/1626826762" },
          { id: 1626827075, title: "Scene 2 - Branching Out (Bunga)",                url: "https://www.wattpad.com/1626827075" },
          { id: 1626827939, title: "Scene 3 - Friends (After Hobbang Time)",         url: "https://www.wattpad.com/1626827939" },
          { id: 1626834123, title: "Scene 4 - First Love",                           url: "https://www.wattpad.com/1626834123" },
          { id: 1626835160, title: "Scene 5 - Rice Cake or Bread?",                  url: "https://www.wattpad.com/1626835160" },
          { id: 1626835871, title: "Scene 6 - After the Lights Went Out",            url: "https://www.wattpad.com/1626835871" },
          { id: 1626836342, title: "Scene 7 - Briquettes vs. Steam 1",               url: "https://www.wattpad.com/1626836342" },
          { id: 1626836760, title: "Scene 8 - Briquettes vs. Steam 2",               url: "https://www.wattpad.com/1626836760" },
          { id: 1626838857, title: "Scene 9 - Jangnal (Market Day 1)",               url: "https://www.wattpad.com/1626838857" },
          { id: 1626839054, title: "Scene 10 - Jangnal (Market Day 2)",              url: "https://www.wattpad.com/1626839054" },
          { id: 1626839388, title: "Scene 11 - Hit-and-Run",                         url: "https://www.wattpad.com/1626839388" },
          { id: 1626839587, title: "Scene 12 - Transfer",                            url: "https://www.wattpad.com/1626839587" },
          { id: 1626839970, title: "Scene 13 - Eorimseong (Royal Overlook Fortress)",url: "https://www.wattpad.com/1626839970" },
          { id: 1626840539, title: "Scene 14 - Separation",                          url: "https://www.wattpad.com/1626840539" },
          { id: 1626841829, title: "Scene 15 - Good bye Little Groom!",              url: "https://www.wattpad.com/1626841829" },
        ],
      },
    ],
  },

  /* ──────────────── GCA ───────────────────────────────────────────── */
  "gca": {
    kind: "flat",
    episodes: [
      { id: 1621212032, title: "The rise of GCA",            url: "https://www.wattpad.com/1621212032" },
      { id: 1621244878, title: "Case 1 - The Legend of A-rang",  url: "https://www.wattpad.com/1621244878" },
      { id: 1621295723, title: "Case 2 - The Nine-Tailed Fox",   url: "https://www.wattpad.com/1621295723" },
      { id: 1621451207, title: "Case 3 - Bulgasal",              url: "https://www.wattpad.com/1621451207" },
      { id: 1621718805, title: "Case 4 - Evil Spirit",           url: "https://www.wattpad.com/1621718805" },
      { id: 1621867776, title: "Case 5 - Jangsanbeom",           url: "https://www.wattpad.com/1621867776" },
      { id: 1621911816, title: "Case 6 - Dugeoksini",            url: "https://www.wattpad.com/1621911816" },
      { id: 1622087368, title: "Case 7 - No Minor Ghost",        url: "https://www.wattpad.com/1622087368" },
    ],
  },

  /* ──────────────── Miss Catherine ───────────────────────────────── */
  "miss-catherine": {
    kind: "flat",
    episodes: [
      { id: 1620394035, title: "EP 1 - Strange grasshopper", url: "https://www.wattpad.com/1620394035" },
      { id: 1620396814, title: "EP 2 - Rooster",             url: "https://www.wattpad.com/1620396814" },
      { id: 1620423204, title: "EP 3 - Snow",                url: "https://www.wattpad.com/1620423204" },
      { id: 1620429691, title: "EP 4 - Balloon Cat",         url: "https://www.wattpad.com/1620429691" },
      { id: 1620430644, title: "EP 5 - Another life",        url: "https://www.wattpad.com/1620430644" },
      { id: 1620437146, title: "EP 6 - Real Cat!",           url: "https://www.wattpad.com/1620437146" },
      { id: 1620438758, title: "EP 7 - Spring Rain",         url: "https://www.wattpad.com/1620438758" },
    ],
  },

  /* ──────────────── Flower ────────────────────────────────────────── */
  "flower": {
    kind: "flat",
    episodes: [
      { id: 1628215481, title: "Flower", url: "https://www.wattpad.com/1628215481" },
    ],
  },

  /* ──────────────── Friends ───────────────────────────────────────── */
  "friends": {
    kind: "flat",
    episodes: [
      { id: 1629852794, title: "EP 1 - The Crime of Distributing Obscene Material", url: "https://www.wattpad.com/1629852794" },
      { id: 1748044801, title: "EP 2 - The Crime of Illegal Gambling",              url: "" },
    ],
  },
};
