// Wattpad 전체 본문 재크롤링 (인증 쿠키 사용)
import { readFileSync, writeFileSync } from 'fs';

const COOKIE = `lang=1; locale=en_US; wp_id=d98e3602-5880-46b8-a333-d46f46db95bb; ff=1; tz=-9; X-Time-Zone=Asia%2FSeoul; token=544590310%3A2%3A1777022934%3AaPaLva-xXA-6TxNPxIFp02D11dz2ApjJcyr6Jg7NFAFyHFBeRujwuSRwWpBLHI2i; remix_host_header_100=1; seen-series-onboarding=1; seen-wallet-onboard=1; _col_uuid=6628382c-b757-4266-9660-86c4c8da6a40-616w; _fbp=fb.1.1777116797804.930926527496658511; _pubcid=ae349138-1aa6-4e43-9b3f-de425cd67bec; _pubcid_cst=V0fMHQ%3D%3D; _gcl_au=1.1.201547440.1777116798.459212279.1777530850.1777530850; wp-web-migration-write-story-new=1; wp-web-migration-write-story-edit=1; wp-web-migration-write-story-publish=1; wp-web-write-stories-review=1; _ga_7Q587CP16R=GS2.2.s1777968336$o1$g0$t1777968336$j60$l0$h0; fs__exp=2; g_state={"i_l":0,"i_ll":1778201011666,"i_e":{"enable_itp_optimization":23},"i_et":1777022920941}; _ga_20V8PSL7D2=GS2.1.s1778732222$o1$g1$t1778732234$j48$l0$h0; _gid=GA1.2.476028864.1778978215; dpr=1; cto_bundle=HS5X8l9SaHZVTyUyRkVNS2NSTElSMSUyRk04SU1SN21tUHZhMHV6OFhGVmI4TUZndHp1JTJGaiUyQjlYJTJGWnlNZmZRT0E1RDRUeldldWFLaGFGMTQxb0ZkbjZyZllpWHFVRXFhRkdSNyUyRlpmJTJCVlRpQkVmYWN5STNMUlhYYzNuekVoaDhVUXF2UyUyRnJwZnBZRDdNJTJGM1ZKc3BxZnNhNVo5cHpxbEElM0QlM0Q; cto_bidid=8b_Mg182ZVRackwwa2JWaGZRb0g3ZFNxJTJCSXh2VmNKcWIyUW9mSWpWRW4lMkJqJTJGdHJ1OU9TYnk5WmR2OXF2V25FMWRUYzFFWlZvanlSWHNtS0FZV25vckR6MHYwMnhIME5CNjduajg4VHpzclFIdm9acyUzRA; isStaff=1; te_session_id=1779242987833; signupFrom=user_profile; AMP_TOKEN=%24NOT_FOUND; _ga_FNDTZ0MZDQ=GS2.1.s1779253476$o104$g0$t1779253476$j60$l0$h0; _ga=GA1.1.429423159.1777116797;`;

const HEADERS = {
  Cookie: COOKIE,
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'application/json',
  Referer: 'https://www.wattpad.com/',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchPartText(partId) {
  const url = `https://www.wattpad.com/apiv2/storytext?id=${partId}`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.text()).trim();
}

const EDITS = 'public/docs/edits';

// Little Groom: season 파일들 각각 처리 후 merge
const LG_SEASONS = ['lg-s1','lg-s2','lg-s3','lg-s4','lg-s5','lg-s6'];
const OTHER_WORKS = ['gca', 'miss-catherine', 'flower', 'friends'];

async function processFile(filename) {
  const path = `${EDITS}/${filename}.json`;
  const data = JSON.parse(readFileSync(path, 'utf8'));
  let updated = 0;

  for (let i = 0; i < data.chapters.length; i++) {
    const ch = data.chapters[i];
    try {
      const text = await fetchPartText(ch.id);
      if (text) {
        data.chapters[i].content = text;
        updated++;
        console.log(`  ✓ [${String(i + 1).padStart(2,'0')}/${data.chapters.length}] ${ch.title} (${text.length}자)`);
      } else {
        console.warn(`  ⚠ [${i + 1}] ${ch.title}: 빈 응답`);
      }
    } catch (e) {
      console.error(`  ✗ [${i + 1}] ${ch.title}: ${e.message}`);
    }
    await sleep(600);
  }

  writeFileSync(path, JSON.stringify(data), 'utf8');
  console.log(`→ ${filename}.json 저장 (${updated}/${data.chapters.length}화 갱신)\n`);
  return data.chapters;
}

// ── 실행 ──────────────────────────────────────────────────────────────────────
console.log('=== Little Groom 시즌별 재크롤링 ===');
const lgAll = [];
for (const s of LG_SEASONS) {
  console.log(`\n[${s}]`);
  const chapters = await processFile(s);
  lgAll.push(...chapters);
}
writeFileSync(`${EDITS}/little-groom.json`, JSON.stringify({ chapters: lgAll }), 'utf8');
console.log(`✓ little-groom.json 병합 완료 (총 ${lgAll.length}화)\n`);

console.log('=== 기타 작품 재크롤링 ===');
for (const w of OTHER_WORKS) {
  console.log(`\n[${w}]`);
  await processFile(w);
}

console.log('\n=== 완료 ===');
