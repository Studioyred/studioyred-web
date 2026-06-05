"use client";

import { useEffect, useRef, useState } from "react";
import HomeHeader from "@/app/components/HomeHeader";

// ── Sprite sheet ─────────────────────────────────────────────────────────────
// /chibi_tennis.png: 4 chars (top row) + 3 chars (bottom row)
// Top row (y 0–50%):   0=도깨비  1=메신저  2=제너럴의아내  3=우주
// Bottom row (y 50–100%): 4=에이전트M  5=저승사자  6=제너럴AI
const SPRITE_SRC = "/chibi_tennis.png";

interface SpriteDef { row: 0 | 1; col: number; totalCols: number }
const SPRITE_DEFS: SpriteDef[] = [
  { row: 0, col: 0, totalCols: 4 }, // 0: 도깨비
  { row: 0, col: 1, totalCols: 4 }, // 1: 메신저
  { row: 0, col: 2, totalCols: 4 }, // 2: 제너럴의아내
  { row: 0, col: 3, totalCols: 4 }, // 3: 우주
  { row: 1, col: 0, totalCols: 3 }, // 4: 에이전트M
  { row: 1, col: 1, totalCols: 3 }, // 5: 저승사자
  { row: 1, col: 2, totalCols: 3 }, // 6: 제너럴AI
];

const PLAYER_CHARS = [
  { index: 0, name: "도깨비",      color: "#7c3aed" },
  { index: 1, name: "메신저",      color: "#0891b2" },
  { index: 2, name: "제너럴의아내", color: "#be185d" },
  { index: 3, name: "훌드라",      color: "#1d4ed8" },
  { index: 6, name: "에이전트M",   color: "#b45309" },
  { index: 5, name: "저승사자",    color: "#334155" },
] as const;

const AI_CHAR = { index: 4, name: "제너럴 AI", color: "#b91c1c" };

// ── Canvas / court ───────────────────────────────────────────────────────────
const CW = 460;
const CH = 680;
const NET_Y = CH / 2;

// Character draw dimensions
const CHAR_W = 64;
const CHAR_H = 96;
const HIT_W = 40; // half-width of hit zone
const HIT_H = 28; // half-height of hit zone

// Ball
const BALL_R = 9;
const BALL_SPEED = 3;
const BALL_MAX = 10;

const WIN = 7;

// ── Types ─────────────────────────────────────────────────────────────────────
type Phase = "select" | "playing" | "gameover";

interface Vec2 { x: number; y: number }
interface Ball extends Vec2 { vx: number; vy: number }

interface GS {
  ball: Ball;
  player: Vec2;
  ai: Vec2;
  pScore: number;
  aiScore: number;
  keys: Set<string>;
  spacePresses: number[];
  paused: boolean;
  pauseFrames: number;
  charIndex: number;
  phase: Phase;
  rafId: number;
  isLoopActive: boolean;
}

// ── Sprite helper ─────────────────────────────────────────────────────────────
function getSpriteRegion(img: HTMLImageElement, index: number) {
  const def = SPRITE_DEFS[index];
  const sw = img.naturalWidth / def.totalCols;
  const sh = img.naturalHeight / 2;
  return { sx: def.col * sw, sy: def.row * sh, sw, sh };
}

function CharSprite({ index, w, h }: { index: number; w: number; h: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = SPRITE_SRC;
    const paint = () => {
      if (!img.naturalWidth) return;
      ctx.clearRect(0, 0, w, h);
      const { sx, sy, sw, sh } = getSpriteRegion(img, index);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
    };
    img.onload = paint;
    if (img.complete) paint();
  }, [index, w, h]);

  return <canvas ref={ref} width={w} height={h} style={{ display: "block" }} />;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TennisPage() {
  const [phase, setPhase] = useState<Phase>("select");
  const [scores, setScores] = useState({ p: 0, ai: 0 });
  const [winner, setWinner] = useState<"p" | "ai" | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spriteRef = useRef<HTMLImageElement | null>(null);

  // Load sprite sheet once
  useEffect(() => {
    const img = new Image();
    img.src = SPRITE_SRC;
    spriteRef.current = img;
  }, []);

  const gs = useRef<GS>({
    ball: { x: CW / 2, y: CH / 2, vx: 0, vy: BALL_SPEED },
    player: { x: CW / 2, y: CH - 100 },
    ai: { x: CW / 2, y: 100 },
    pScore: 0,
    aiScore: 0,
    keys: new Set(),
    spacePresses: [],
    paused: true,
    pauseFrames: 90,
    charIndex: 1,
    phase: "select",
    rafId: 0,
    isLoopActive: false,
  });

  // ── Helpers ──────────────────────────────────────────────────────────────────

  function serveBall(toPlayer: boolean): Ball {
    const a = (Math.random() * 0.6 - 0.3);
    const s = BALL_SPEED;
    return {
      x: CW / 2,
      y: CH / 2,
      vx: s * Math.sin(a),
      vy: toPlayer ? s * Math.cos(a) : -(s * Math.cos(a)),
    };
  }

  function spaceBoost(presses: number[]): number {
    const now = Date.now();
    const recent = presses.filter(t => now - t < 600);
    presses.length = 0;
    recent.forEach(t => presses.push(t));
    return Math.min(recent.length, 8);
  }

  function drawSprite(
    ctx: CanvasRenderingContext2D,
    index: number,
    dx: number, dy: number,
    dw: number, dh: number,
    flipY = false,
  ) {
    const img = spriteRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      const { sx, sy, sw, sh } = getSpriteRegion(img, index);
      if (flipY) {
        ctx.save();
        ctx.translate(dx + dw / 2, dy + dh / 2);
        ctx.scale(1, -1);
        ctx.drawImage(img, sx, sy, sw, sh, -dw / 2, -dh / 2, dw, dh);
        ctx.restore();
      } else {
        ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
      }
    } else {
      // Fallback
      const colors = ["#7c3aed","#0891b2","#be185d","#1d4ed8","#b45309","#334155","#b91c1c"];
      ctx.fillStyle = (colors[index] ?? "#555") + "cc";
      ctx.beginPath();
      ctx.roundRect(dx + 4, dy + 4, dw - 8, dh - 8, 8);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = `bold ${Math.min(dw, dh) * 0.28}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const labels = ["도깨","메신","아내","훌드","AI","저승","에M"];
      ctx.fillText(labels[index] ?? "?", dx + dw / 2, dy + dh / 2);
    }
  }

  function draw(ctx: CanvasRenderingContext2D) {
    const { ball, player, ai, paused, pScore, aiScore, charIndex } = gs.current;

    // Court background
    const bg = ctx.createLinearGradient(0, 0, 0, CH);
    bg.addColorStop(0,   "#163a16");
    bg.addColorStop(0.48,"#1e5c1e");
    bg.addColorStop(0.52,"#1e5c1e");
    bg.addColorStop(1,   "#163a16");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, CW, CH);

    // Court lines
    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.lineWidth = 2;
    ctx.strokeRect(22, 22, CW - 44, CH - 44);
    // Center vertical line (only in service boxes)
    ctx.beginPath(); ctx.moveTo(CW / 2, 22); ctx.lineTo(CW / 2, NET_Y - 6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(CW / 2, NET_Y + 6); ctx.lineTo(CW / 2, CH - 22); ctx.stroke();
    // Service lines
    ctx.beginPath(); ctx.moveTo(22, NET_Y - 110); ctx.lineTo(CW - 22, NET_Y - 110); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(22, NET_Y + 110); ctx.lineTo(CW - 22, NET_Y + 110); ctx.stroke();

    // Net
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(22, NET_Y - 9, CW - 44, 18);
    ctx.strokeStyle = "rgba(255,255,255,0.75)";
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(18, NET_Y); ctx.lineTo(CW - 18, NET_Y); ctx.stroke();
    ctx.fillStyle = "#bbb";
    ctx.fillRect(16, NET_Y - 22, 6, 44);
    ctx.fillRect(CW - 22, NET_Y - 22, 6, 44);
    // Mesh — 단일 path로 22번 stroke → 1번으로
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let nx = 34; nx < CW - 30; nx += 18) {
      ctx.moveTo(nx, NET_Y - 9);
      ctx.lineTo(nx, NET_Y + 9);
    }
    ctx.stroke();

    // AI character (top, flipped vertically to face player)
    drawSprite(ctx, AI_CHAR.index, ai.x - CHAR_W / 2, ai.y - CHAR_H / 2, CHAR_W, CHAR_H, true);

    // Player character (bottom)
    drawSprite(ctx, charIndex, player.x - CHAR_W / 2, player.y - CHAR_H / 2, CHAR_W, CHAR_H, false);

    // Ball
    if (!paused) {
      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.beginPath();
      ctx.ellipse(ball.x, ball.y + 5, BALL_R * 0.9, BALL_R * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffe838";
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(160,100,0,0.5)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // 하이라이트 점
      ctx.fillStyle = "rgba(255,255,255,0.65)";
      ctx.beginPath();
      ctx.arc(ball.x - 3, ball.y - 3, BALL_R * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }

    // Scores
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 18px 'Pretendard Variable', sans-serif";
    ctx.fillStyle = "rgba(255,130,130,0.9)";
    ctx.fillText(String(aiScore), CW / 2, 12);
    ctx.fillStyle = "rgba(120,210,255,0.9)";
    ctx.fillText(String(pScore), CW / 2, CH - 12);

    // Pause overlay
    if (paused) {
      ctx.fillStyle = "rgba(0,0,0,0.38)";
      ctx.fillRect(0, CH / 2 - 22, CW, 44);
      ctx.fillStyle = "#e8c9a0";
      ctx.font = "bold 16px 'Pretendard Variable', sans-serif";
      ctx.fillText("● 서브 준비 중 ●", CW / 2, CH / 2);
    }

    ctx.textBaseline = "alphabetic";
  }

  // ── Game loop ─────────────────────────────────────────────────────────────────

  function tick() {
    const state = gs.current;
    if (!state.isLoopActive || state.phase !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (state.paused) {
      state.pauseFrames--;
      if (state.pauseFrames <= 0) { state.paused = false; }
      draw(ctx);
      state.rafId = requestAnimationFrame(tick);
      return;
    }

    // Player movement
    const boost = spaceBoost(state.spacePresses);
    const spd = 3 + boost * 0.75; // 3–9 px/frame based on space mashing
    if (state.keys.has("ArrowLeft"))
      state.player.x = Math.max(CHAR_W / 2, state.player.x - spd);
    if (state.keys.has("ArrowRight"))
      state.player.x = Math.min(CW - CHAR_W / 2, state.player.x + spd);
    if (state.keys.has("ArrowUp"))
      state.player.y = Math.max(NET_Y + CHAR_H / 2 + 10, state.player.y - spd);
    if (state.keys.has("ArrowDown"))
      state.player.y = Math.min(CH - CHAR_H / 2, state.player.y + spd);

    // AI movement — tracks ball, speed scales with player score
    const aiSpd = Math.min(2 + state.pScore * 0.45, 9);
    const dax = state.ball.x - state.ai.x;
    if (Math.abs(dax) > 1)
      state.ai.x = Math.max(CHAR_W / 2, Math.min(CW - CHAR_W / 2,
        state.ai.x + Math.sign(dax) * Math.min(Math.abs(dax), aiSpd)));

    // Y: 공이 플레이어 쪽으로 갈 때는 베이스라인으로 후퇴, 올 때만 전진
    const AI_HOME_Y = CHAR_H / 2 + 30; // 자기 코트 안쪽 기본 위치
    if (state.ball.vy > 0) {
      // 공이 플레이어 방향 — 베이스라인으로 물러남
      const dyHome = AI_HOME_Y - state.ai.y;
      if (Math.abs(dyHome) > 2)
        state.ai.y = Math.max(CHAR_H / 2, Math.min(NET_Y - CHAR_H / 2 - 20,
          state.ai.y + Math.sign(dyHome) * Math.min(Math.abs(dyHome), aiSpd * 0.6)));
    } else {
      // 공이 AI 방향 — 공 위치로 전진
      const day = state.ball.y - state.ai.y;
      if (Math.abs(day) > 1)
        state.ai.y = Math.max(CHAR_H / 2, Math.min(NET_Y - CHAR_H / 2 - 20,
          state.ai.y + Math.sign(day) * Math.min(Math.abs(day), aiSpd * 0.7)));
    }

    // Ball movement
    state.ball.x += state.ball.vx;
    state.ball.y += state.ball.vy;

    // Side walls
    if (state.ball.x - BALL_R < 22)       { state.ball.x = 22 + BALL_R;       state.ball.vx =  Math.abs(state.ball.vx); }
    if (state.ball.x + BALL_R > CW - 22)  { state.ball.x = CW - 22 - BALL_R;  state.ball.vx = -Math.abs(state.ball.vx); }

    // ── Player hit detection (ball moving down, in bottom half) ──
    if (state.ball.vy > 0 && state.ball.y > NET_Y) {
      const dx = Math.abs(state.ball.x - state.player.x);
      const dy = Math.abs(state.ball.y - state.player.y);
      if (dx < HIT_W + BALL_R && dy < HIT_H + BALL_R) {
        const offset = (state.ball.x - state.player.x) / HIT_W;
        const s = Math.min(Math.hypot(state.ball.vx, state.ball.vy) + 0.4, BALL_MAX);
        state.ball.vx = offset * s * 0.5;
        state.ball.vy = -Math.sqrt(s * s - state.ball.vx * state.ball.vx); // 속도 보존
        state.ball.y = state.player.y - HIT_H - BALL_R - 1;
      } else if (state.ball.y > CH + 20) {
        // AI scores
        state.aiScore++;
        setScores({ p: state.pScore, ai: state.aiScore });
        if (state.aiScore >= WIN) { endGame("ai"); return; }
        state.ball = serveBall(true);
        state.paused = true;
        state.pauseFrames = 90;
      }
    }

    // ── AI hit detection (ball moving up, in top half) ──
    if (state.ball.vy < 0 && state.ball.y < NET_Y) {
      const dx = Math.abs(state.ball.x - state.ai.x);
      const dy = Math.abs(state.ball.y - state.ai.y);
      if (dx < HIT_W + BALL_R && dy < HIT_H + BALL_R) {
        const offset = (state.ball.x - state.ai.x) / HIT_W;
        const s = Math.min(Math.hypot(state.ball.vx, state.ball.vy) + 0.3, BALL_MAX);
        state.ball.vx = offset * s * 0.45;
        state.ball.vy = Math.sqrt(s * s - state.ball.vx * state.ball.vx); // 속도 보존
        state.ball.y = state.ai.y + HIT_H + BALL_R + 1;
      } else if (state.ball.y < -20) {
        // Player scores
        state.pScore++;
        setScores({ p: state.pScore, ai: state.aiScore });
        if (state.pScore >= WIN) { endGame("p"); return; }
        state.ball = serveBall(false);
        state.paused = true;
        state.pauseFrames = 90;
      }
    }

    draw(ctx);
    state.rafId = requestAnimationFrame(tick);
  }

  function endGame(w: "p" | "ai") {
    cancelAnimationFrame(gs.current.rafId);
    gs.current.phase = "gameover";
    setWinner(w);
    setPhase("gameover");
  }

  function startGame(charIndex: number) {
    gs.current.isLoopActive = false;
    cancelAnimationFrame(gs.current.rafId);
    Object.assign(gs.current, {
      ball: serveBall(true),
      player: { x: CW / 2, y: CH - 100 },
      ai: { x: CW / 2, y: 100 },
      pScore: 0,
      aiScore: 0,
      keys: new Set<string>(),
      spacePresses: [] as number[],
      paused: true,
      pauseFrames: 100,
      charIndex,
      phase: "playing" as Phase,
      rafId: 0,
    });
    setScores({ p: 0, ai: 0 });
    setWinner(null);
    setPhase("playing");
  }

  // ── Key events ───────────────────────────────────────────────────────────────

  useEffect(() => {
    if (phase !== "playing") return;

    const onDown = (e: KeyboardEvent) => {
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key))
        e.preventDefault();
      gs.current.keys.add(e.key);
      if (e.key === " ") gs.current.spacePresses.push(Date.now());
    };
    const onUp = (e: KeyboardEvent) => { gs.current.keys.delete(e.key); };

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);

    gs.current.isLoopActive = true;
    gs.current.rafId = requestAnimationFrame(tick);

    return () => {
      gs.current.isLoopActive = false;
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      cancelAnimationFrame(gs.current.rafId);
    };
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Render ───────────────────────────────────────────────────────────────────

  const curCharName = PLAYER_CHARS.find(c => c.index === gs.current.charIndex)?.name ?? "플레이어";

  return (
    <div style={{ background: "#0a0604", minHeight: "100vh" }}>
      <HomeHeader />

      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        paddingTop: "80px", paddingBottom: "40px", gap: "0",
      }}>

        {/* ── Character Select ── */}
        {phase === "select" && (
          <div style={{ color: "#e8c9a0", textAlign: "center", maxWidth: "500px", width: "100%", padding: "0 16px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: 800, marginBottom: "4px" }}>테니스 게임</h1>
            <p style={{ fontSize: "12px", color: "#7a5a3a", marginBottom: "22px" }}>
              캐릭터를 골라 제너럴 AI에 도전하세요
            </p>

            {/* AI preview */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "11px", color: "#7a5a3a", letterSpacing: "1px", marginBottom: "8px" }}>
                상대방
              </div>
              <div style={{
                display: "inline-flex", flexDirection: "column", alignItems: "center",
                background: "rgba(139,0,0,0.15)", border: "2px solid rgba(185,28,28,0.4)",
                borderRadius: "12px", padding: "14px 22px",
              }}>
                <div style={{
                  width: 64, height: 96, borderRadius: 8, overflow: "hidden",
                  background: "rgba(185,28,28,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <CharSprite index={AI_CHAR.index} w={64} h={96} />
                </div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#ff8080", marginTop: "8px" }}>
                  {AI_CHAR.name}
                </div>
              </div>
            </div>

            {/* Player character grid */}
            <div style={{ fontSize: "11px", color: "#7a5a3a", letterSpacing: "1px", marginBottom: "10px" }}>
              내 캐릭터 선택
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
              {PLAYER_CHARS.map(char => (
                <button
                  key={char.index}
                  onClick={() => startGame(char.index)}
                  style={{
                    background: "#1a0a04", border: `2px solid #3a2010`,
                    borderRadius: "12px", padding: "14px 8px 10px",
                    cursor: "pointer", textAlign: "center", color: "#e8c9a0",
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget;
                    el.style.borderColor = char.color;
                    el.style.background = "#2a1204";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget;
                    el.style.borderColor = "#3a2010";
                    el.style.background = "#1a0a04";
                  }}
                >
                  <div style={{
                    width: 56, height: 84, borderRadius: 8, overflow: "hidden",
                    margin: "0 auto 8px",
                    background: char.color + "22",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <CharSprite index={char.index} w={56} h={84} />
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: 600 }}>{char.name}</div>
                </button>
              ))}
            </div>

            <div style={{ marginTop: "18px", fontSize: "12px", color: "#5a4030", lineHeight: 2 }}>
              ← → ↑ ↓ 이동 &nbsp;·&nbsp; 스페이스바 연타 = 빠른 이동<br />
              공이 내 위치에 오면 자동 리턴 &nbsp;·&nbsp; 7점 선취 승리
            </div>
          </div>
        )}

        {/* ── Game Screen ── */}
        {phase === "playing" && (
          <div>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              width: `${CW}px`, marginBottom: "6px",
            }}>
              <span style={{ fontSize: "13px", color: "#ff8080" }}>
                제너럴 AI &nbsp;
                <span style={{ fontSize: "22px", fontWeight: 800 }}>{scores.ai}</span>
              </span>
              <span style={{ fontSize: "11px", color: "#5a4030" }}>먼저 7점 승리</span>
              <span style={{ fontSize: "13px", color: "#88ccff" }}>
                <span style={{ fontSize: "22px", fontWeight: 800 }}>{scores.p}</span>
                &nbsp; {curCharName}
              </span>
            </div>
            <canvas
              ref={canvasRef}
              width={CW}
              height={CH}
              style={{ display: "block", borderRadius: "10px", border: "2px solid #2a1a08" }}
            />
            <div style={{ textAlign: "center", marginTop: "8px", fontSize: "11px", color: "#4a3020" }}>
              ← → ↑ ↓ 이동 &nbsp;·&nbsp; 스페이스바 연타 = 빠른 이동
            </div>
          </div>
        )}

        {/* ── Game Over ── */}
        {phase === "gameover" && (
          <div style={{ color: "#e8c9a0", textAlign: "center", paddingTop: "60px" }}>
            <div style={{ fontSize: "60px", marginBottom: "12px" }}>
              {winner === "p" ? "🏆" : "💀"}
            </div>
            <h2 style={{ fontSize: "34px", fontWeight: 800, marginBottom: "8px" }}>
              {winner === "p" ? "승리!" : "패배..."}
            </h2>
            <div style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "6px", marginBottom: "8px" }}>
              {scores.p} <span style={{ fontSize: "18px", color: "#7a5a3a" }}>:</span> {scores.ai}
            </div>
            <div style={{ fontSize: "14px", color: "#7a5a3a", marginBottom: "36px" }}>
              {winner === "p"
                ? "제너럴 AI를 꺾었습니다!"
                : "제너럴 AI에게 패배했습니다."}
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                onClick={() => startGame(gs.current.charIndex)}
                style={{
                  background: "#5c3a1e", color: "#e8c9a0", border: "none",
                  borderRadius: "8px", padding: "12px 28px",
                  fontSize: "15px", cursor: "pointer", fontWeight: 700,
                }}
              >
                다시 도전
              </button>
              <button
                onClick={() => setPhase("select")}
                style={{
                  background: "transparent", color: "#e8c9a0",
                  border: "2px solid #5c3a1e", borderRadius: "8px",
                  padding: "12px 28px", fontSize: "15px", cursor: "pointer", fontWeight: 700,
                }}
              >
                캐릭터 변경
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
