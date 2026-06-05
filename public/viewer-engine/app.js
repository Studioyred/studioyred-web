/* ============================================================
   app.js — Ambient Cinematic Viewer Engine
   Lo-fi · Nostalgic · Slow Cinematic
   ============================================================ */

'use strict';

/* ── DOM Cache ──────────────────────────────────────────────── */
const $ = id => document.getElementById(id);

let dom = {};

function cacheDOM() {
  dom = {
    viewer:       $('viewer'),
    bgLayer:      $('bg-layer'),
    ambientLayer: $('ambient-layer'),
    canvas:       $('particle-canvas'),
    crtOverlay:   $('crt-overlay'),
    curtainL:     $('curtain-left'),
    curtainR:     $('curtain-right'),
    vignette:     $('vignette'),
    filmGrain:    $('film-grain'),
    textLayer:    $('text-layer'),
    sceneLabel:   $('scene-label'),
    subtitleBox:  $('subtitle-box'),
    subtitleText: $('subtitle-text'),
    uiLayer:      $('ui-layer'),
    btnPrev:      $('btn-prev'),
    btnNext:      $('btn-next'),
    sceneDots:    $('scene-dots'),
    sceneCounter: $('scene-counter'),
    progressBar:  $('progress-bar'),
    progressFill: $('progress-fill'),
    fadeOverlay:  $('fade-overlay'),
  };
  dom.ctx = dom.canvas.getContext('2d');
}

/* ── State ──────────────────────────────────────────────────── */
let currentIdx = 0;
let autoTimer  = null;
let textTimers = [];

/* ── Background Module ──────────────────────────────────────── */
const Background = {
  load(scene) {
    const el = dom.bgLayer;

    /* Ken Burns reset */
    el.classList.remove('kb-active');
    void el.offsetWidth; /* reflow to restart animation */

    if (scene.bgImage) {
      el.style.backgroundImage  = `url('${scene.bgImage}')`;
      el.style.backgroundSize   = 'cover';
      el.style.backgroundPosition = 'center';
      el.style.background       = '';
    } else if (scene.bgGradient) {
      el.style.backgroundImage  = 'none';
      el.style.background       = scene.bgGradient;
    } else {
      el.style.backgroundImage  = 'none';
      el.style.background       = scene.bgColor || '#000';
    }

    /* Slight delay so gradient is painted before KB starts */
    requestAnimationFrame(() => el.classList.add('kb-active'));

    /* Mood overlay on vignette layer */
    if (scene.overlay) {
      dom.vignette.style.background =
        `radial-gradient(ellipse at 50% 50%, ${scene.overlay} 0%, rgba(0,0,0,0.70) 100%)`;
    } else {
      dom.vignette.style.background =
        'radial-gradient(ellipse at 50% 50%, transparent 42%, rgba(0,0,0,0.60) 100%)';
    }
  },
};

/* ── Particle Canvas Module ─────────────────────────────────── */
const Particles = (() => {
  let raf = null;
  let particles = [];
  let mode = null; /* 'stars' | 'dust' | 'snow' | null */

  function resize() {
    dom.canvas.width  = dom.viewer.offsetWidth;
    dom.canvas.height = dom.viewer.offsetHeight;
  }

  /* ── Stars ─────────────────────────────────────────────────── */
  function initStars(count = 180) {
    particles = Array.from({ length: count }, () => ({
      x:    Math.random(),
      y:    Math.random(),
      r:    Math.random() * 1.1 + 0.3,
      base: Math.random(),          /* base opacity */
      t:    Math.random() * Math.PI * 2,
      spd:  0.008 + Math.random() * 0.018,
    }));
  }

  function drawStars(ctx, w, h, now) {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.t += p.spd;
      const a = p.base * 0.5 + Math.sin(p.t) * p.base * 0.5;
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(210,230,255,${a.toFixed(3)})`;
      ctx.fill();
    }
  }

  /* ── Dust ──────────────────────────────────────────────────── */
  function initDust(count = 55) {
    particles = Array.from({ length: count }, () => spawnDust(true));
  }

  function spawnDust(random = false) {
    const h = dom.canvas.height || window.innerHeight;
    return {
      x:   Math.random(),
      y:   random ? Math.random() : -0.05,
      r:   0.6 + Math.random() * 1.4,
      vx:  (Math.random() - 0.5) * 0.00015,
      vy:  0.00012 + Math.random() * 0.00018,
      a:   0.12 + Math.random() * 0.22,
      t:   Math.random() * Math.PI * 2,
      spd: 0.005 + Math.random() * 0.012,
    };
  }

  function drawDust(ctx, w, h) {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.t  += p.spd;
      p.x  += p.vx + Math.sin(p.t) * 0.00008;
      p.y  += p.vy;
      if (p.y > 1.05) particles[i] = spawnDust(false);
      const a = p.a * (0.7 + Math.sin(p.t) * 0.3);
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,248,220,${a.toFixed(3)})`;
      ctx.fill();
    }
  }

  /* ── Snow ──────────────────────────────────────────────────── */
  function initSnow(count = 80) {
    particles = Array.from({ length: count }, () => spawnSnow(true));
  }

  function spawnSnow(random = false) {
    return {
      x:   Math.random(),
      y:   random ? Math.random() : -0.02,
      r:   0.8 + Math.random() * 2.2,
      vx:  (Math.random() - 0.5) * 0.0003,
      vy:  0.0005 + Math.random() * 0.0008,
      a:   0.35 + Math.random() * 0.55,
      t:   Math.random() * Math.PI * 2,
      spd: 0.003 + Math.random() * 0.008,
    };
  }

  function drawSnow(ctx, w, h) {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.t  += p.spd;
      p.x  += p.vx + Math.sin(p.t) * 0.0002;
      p.y  += p.vy;
      if (p.y > 1.05) particles[i] = spawnSnow(false);
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.a.toFixed(3)})`;
      ctx.fill();
    }
  }

  /* ── Composite draw (stars + dust can coexist) ─────────────── */
  let activeTypes = [];

  function tick() {
    const { ctx, canvas } = dom;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    for (const t of activeTypes) {
      if (t === 'stars') drawStars(ctx, w, h);
      if (t === 'dust')  drawDust(ctx, w, h);
      if (t === 'snow')  drawSnow(ctx, w, h);
    }
    raf = requestAnimationFrame(tick);
  }

  return {
    start(types) {
      this.stop();
      resize();
      activeTypes = types;
      particles = [];

      for (const t of types) {
        if (t === 'stars') initStars();
        if (t === 'dust')  initDust();
        if (t === 'snow')  initSnow();
      }

      /* Merge particles for canvas-based types */
      if (activeTypes.some(t => ['stars','dust','snow'].includes(t))) {
        tick();
      }
    },
    stop() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      const { ctx, canvas } = dom;
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      activeTypes = [];
    },
    resize,
  };
})();

/* ── Cherry Blossom Module ──────────────────────────────────── */
const CherryBlossom = (() => {
  let interval = null;
  const colors = [
    'rgba(255,183,197,0.82)',
    'rgba(255,210,221,0.75)',
    'rgba(255,160,180,0.70)',
    'rgba(255,230,240,0.65)',
    'rgba(240,170,188,0.72)',
  ];

  function spawn() {
    const petal = document.createElement('div');
    petal.className = 'petal';
    const size = 5 + Math.random() * 9;
    petal.style.cssText = [
      `width:${size}px`,
      `height:${size * 0.65}px`,
      `background:${colors[Math.floor(Math.random() * colors.length)]}`,
      `left:${Math.random() * 105 - 2}vw`,
      `top:-20px`,
      `--drift:${(Math.random() - 0.5) * 280}px`,
      `--spin:${Math.random() * 720 - 360}deg`,
      `animation-duration:${7 + Math.random() * 9}s`,
      `animation-delay:${Math.random() * 1.5}s`,
    ].join(';');
    dom.ambientLayer.appendChild(petal);
    petal.addEventListener('animationend', () => petal.remove(), { once: true });
  }

  return {
    start() {
      this.stop();
      spawn(); spawn(); spawn();
      interval = setInterval(() => {
        const count = Math.random() < 0.4 ? 2 : 1;
        for (let i = 0; i < count; i++) spawn();
      }, 900);
    },
    stop() {
      if (interval) { clearInterval(interval); interval = null; }
      dom.ambientLayer.querySelectorAll('.petal').forEach(p => p.remove());
    },
  };
})();

/* ── Ambient Module ─────────────────────────────────────────── */
const Ambient = {
  start(scene) {
    this.stop();
    const types   = scene.ambient || [];
    const canvas  = types.filter(t => ['stars','dust','snow'].includes(t));
    const hasPetal = types.includes('cherry-blossom');
    const hasCurtain = types.includes('curtain');

    if (canvas.length) Particles.start(canvas);
    if (hasPetal)  CherryBlossom.start();
    if (hasCurtain) {
      dom.curtainL.classList.add('active');
      dom.curtainR.classList.add('active');
    }
    if (scene.crt) dom.crtOverlay.classList.add('active');
  },
  stop() {
    Particles.stop();
    CherryBlossom.stop();
    dom.curtainL.classList.remove('active');
    dom.curtainR.classList.remove('active');
    dom.crtOverlay.classList.remove('active');
  },
};

/* ── Audio Module ───────────────────────────────────────────── */
const Audio = (() => {
  let audio = null;
  let fadeRaf = null;

  return {
    play(src, vol = 0.5) {
      this.stop();
      if (!src) return;
      audio = new window.Audio(src);
      audio.loop   = true;
      audio.volume = 0;
      audio.play().catch(() => {});
      this._fadeTo(vol, 2000);
    },
    stop() {
      if (fadeRaf) { cancelAnimationFrame(fadeRaf); fadeRaf = null; }
      if (audio) {
        this._fadeTo(0, 800, () => { audio.pause(); audio = null; });
      }
    },
    _fadeTo(target, duration, cb) {
      if (!audio) return;
      const start = audio.volume;
      const delta = target - start;
      const t0    = performance.now();
      const step  = (now) => {
        const p = Math.min((now - t0) / duration, 1);
        if (audio) audio.volume = start + delta * p;
        if (p < 1) {
          fadeRaf = requestAnimationFrame(step);
        } else {
          fadeRaf = null;
          if (cb) cb();
        }
      };
      fadeRaf = requestAnimationFrame(step);
    },
  };
})();

/* ── Text / Typewriter Module ───────────────────────────────── */
const Text = (() => {
  let typeRaf  = null;
  let timers   = [];

  function clearAll() {
    timers.forEach(t => clearTimeout(t));
    timers = [];
    if (typeRaf) { cancelAnimationFrame(typeRaf); typeRaf = null; }
    dom.subtitleText.classList.remove('visible','typing');
    dom.subtitleText.textContent = '';
    dom.sceneLabel.classList.remove('visible');
  }

  function typewrite(fullText, color, onDone) {
    dom.subtitleText.style.color = color || '#fff';
    dom.subtitleText.textContent = '';
    dom.subtitleText.classList.add('visible','typing');

    const chars = [...fullText]; /* Unicode-safe split */
    let   i     = 0;
    let   last  = 0;

    /* Vary speed: ~28–55ms/char with slight jitter */
    function step(now) {
      const interval = 32 + Math.random() * 22;
      if (now - last >= interval) {
        last = now;
        if (i < chars.length) {
          /* Preserve newlines */
          if (chars[i] === '\n') {
            dom.subtitleText.appendChild(document.createElement('br'));
          } else {
            dom.subtitleText.appendChild(document.createTextNode(chars[i]));
          }
          i++;
        } else {
          dom.subtitleText.classList.remove('typing');
          if (onDone) onDone();
          return;
        }
      }
      typeRaf = requestAnimationFrame(step);
    }
    typeRaf = requestAnimationFrame(step);
  }

  return {
    schedule(scene) {
      clearAll();

      /* Scene label */
      timers.push(setTimeout(() => {
        dom.sceneLabel.textContent = scene.label || '';
        dom.sceneLabel.classList.add('visible');
      }, 400));

      /* Each text entry */
      (scene.texts || []).forEach((entry, i) => {
        timers.push(setTimeout(() => {
          if (typeRaf) { cancelAnimationFrame(typeRaf); typeRaf = null; }
          dom.subtitleText.classList.remove('visible','typing');
          dom.subtitleText.textContent = '';

          /* Small gap before next text */
          timers.push(setTimeout(() => {
            typewrite(entry.text, scene.textColor || '#fff');
          }, 150));
        }, entry.delay));
      });
    },
    clear: clearAll,
  };
})();

/* ── Transition Module ──────────────────────────────────────── */
const Transition = (() => {
  let raf = null;

  function animateFade(fromOpacity, toOpacity, duration, cb) {
    const el  = dom.fadeOverlay;
    const t0  = performance.now();
    el.style.pointerEvents = toOpacity > 0 ? 'all' : 'none';

    function step(now) {
      const p = Math.min((now - t0) / duration, 1);
      el.style.opacity = fromOpacity + (toOpacity - fromOpacity) * p;
      if (p < 1) {
        raf = requestAnimationFrame(step);
      } else {
        if (cb) cb();
      }
    }
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(step);
  }

  return {
    fadeOut(cb, duration = 600) {
      animateFade(0, 1, duration, cb);
    },
    fadeIn(duration = 700) {
      animateFade(1, 0, duration, () => {
        dom.fadeOverlay.style.pointerEvents = 'none';
      });
    },
  };
})();

/* ── Progress Module ────────────────────────────────────────── */
const Progress = (() => {
  let raf  = null;
  let t0   = null;
  let dur  = 0;

  return {
    start(duration) {
      this.reset();
      if (!duration) return;
      dur = duration;
      t0  = performance.now();
      const step = (now) => {
        const p = Math.min((now - t0) / dur, 1);
        dom.progressFill.style.width = (p * 100) + '%';
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    },
    reset() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      dom.progressFill.style.width = '0%';
    },
  };
})();

/* ── Scene Dots ─────────────────────────────────────────────── */
function buildDots() {
  dom.sceneDots.innerHTML = '';
  SCENES.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.title = SCENES[i].title || '';
    d.addEventListener('click', () => navigateTo(i));
    dom.sceneDots.appendChild(d);
  });
}

function updateDots(idx) {
  dom.sceneDots.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });
}

function updateCounter(idx) {
  dom.sceneCounter.textContent =
    String(idx + 1).padStart(2, '0') + ' / ' + String(SCENES.length).padStart(2, '0');
}

function updateNav(idx) {
  dom.btnPrev.disabled = idx === 0;
  dom.btnNext.disabled = idx === SCENES.length - 1;
}

/* ── Scene Loader ───────────────────────────────────────────── */
function loadScene(idx, direction = 1) {
  if (idx < 0 || idx >= SCENES.length) return;
  clearTimeout(autoTimer);

  Transition.fadeOut(() => {
    const scene = SCENES[idx];
    currentIdx  = idx;

    /* Stop previous */
    Ambient.stop();
    Text.clear();
    Progress.reset();

    /* Load new */
    Background.load(scene);
    Ambient.start(scene);
    Audio.play(scene.music, scene.musicVolume);
    Text.schedule(scene);

    /* UI */
    updateDots(idx);
    updateCounter(idx);
    updateNav(idx);

    Transition.fadeIn(700);

    /* Auto-advance */
    if (scene.duration > 0) {
      Progress.start(scene.duration);
      autoTimer = setTimeout(() => {
        if (currentIdx < SCENES.length - 1) navigateTo(currentIdx + 1);
      }, scene.duration);
    }
  });
}

function navigateTo(idx) {
  if (idx === currentIdx) return;
  loadScene(idx, idx > currentIdx ? 1 : -1);
}

/* ── Event Handlers ─────────────────────────────────────────── */
function attachEvents() {
  dom.btnPrev.addEventListener('click', () => navigateTo(currentIdx - 1));
  dom.btnNext.addEventListener('click', () => navigateTo(currentIdx + 1));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') navigateTo(currentIdx + 1);
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   navigateTo(currentIdx - 1);
  });

  window.addEventListener('resize', () => {
    Particles.resize();
  });
}

/* ── Init ───────────────────────────────────────────────────── */
function init() {
  cacheDOM();
  buildDots();
  attachEvents();

  /* Start with overlay fully black, then load */
  dom.fadeOverlay.style.opacity = '1';
  dom.fadeOverlay.style.pointerEvents = 'none';

  /* Tiny delay so browser has painted the layout */
  setTimeout(() => loadScene(0), 80);
}

document.addEventListener('DOMContentLoaded', init);
