import { Renderer, Program, Mesh, Triangle } from 'https://cdn.jsdelivr.net/npm/ogl@1.0.11/src/index.js';

const loader = document.getElementById("loader");
const html = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const navHeader = document.getElementById("navHeader");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const navLinkEls = navLinks ? navLinks.querySelectorAll(".nav-link") : [];
const backToTop = document.getElementById("backToTop");
const typedEl = document.getElementById("heroTyped");
const footerYear = document.getElementById("footerYear");

const savedTheme = localStorage.getItem("ds-theme") || "dark";
html.setAttribute("data-theme", savedTheme);

document.body.classList.add("is-loading");

window.addEventListener("load", () => {
  setTimeout(() => {
    if (loader) loader.classList.add("hidden");
    document.body.classList.remove("is-loading");
    triggerHeroReveal();
  }, 200);
});

let scrollFrameQueued = false;
window.addEventListener("scroll", () => {
  if (!scrollFrameQueued) {
    window.requestAnimationFrame(() => {
      if (navHeader) navHeader.classList.toggle("scrolled", window.scrollY > 30);
      updateActiveLink();
      toggleBackToTop();
      scrollFrameQueued = false;
    });
    scrollFrameQueued = true;
  }
}, { passive: true });

if (hamburger && navLinks) {
  const openMenu = () => {
    hamburger.classList.add("open");
    navLinks.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  };

  hamburger.addEventListener("click", () => {
    navLinks.classList.contains("open") ? closeMenu() : openMenu();
  });

  navLinkEls.forEach(link => link.addEventListener("click", closeMenu));

  document.addEventListener("click", (e) => {
    if (navLinks.classList.contains("open") && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("open")) closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 700 && navLinks.classList.contains("open")) closeMenu();
  });
}

function updateActiveLink() {
  if (!navLinkEls.length) return;

  let current = "";
  const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 50);

  if (isAtBottom) {
    current = "mainFooter";
  } else {
    const sections = document.querySelectorAll("main section[id]");
    sections.forEach((sec) => {
      if (window.scrollY >= (sec.offsetTop - 140)) current = sec.id;
    });
  }

  navLinkEls.forEach((link) => {
    const href = link.getAttribute("href").slice(1);
    link.classList.toggle("active", href === current);
  });
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", nextTheme);
    localStorage.setItem("ds-theme", nextTheme);
  });
}

const phrases = ["Economics Graduate", "Software Developer", "Backend Engineer", "Problem Solver"];
let phraseIndex = 0, charIndex = 0, isDeleting = false, typingDelay = 110;

function type() {
  if (!typedEl) return;
  const currentText = phrases[phraseIndex];

  if (isDeleting) {
    typedEl.textContent = currentText.slice(0, charIndex--);
    typingDelay = 55;
  } else {
    typedEl.textContent = currentText.slice(0, charIndex++);
    typingDelay = 110;
  }

  if (!isDeleting && charIndex === currentText.length + 1) {
    isDeleting = true;
    typingDelay = 1800;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typingDelay = 500;
  }
  setTimeout(type, typingDelay);
}

function triggerHeroReveal() {
  document.querySelectorAll(".hero .reveal").forEach((el, i) => {
    setTimeout(() => el.classList.add("in-view"), i * 150);
  });
  setTimeout(type, 800);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

document.querySelectorAll(".reveal:not(.hero .reveal)").forEach(el => revealObserver.observe(el));

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(".skill-card").forEach(card => skillObserver.observe(card));

function toggleBackToTop() {
  if (backToTop) backToTop.classList.toggle("visible", window.scrollY > 400);
}

if (backToTop) {
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

if (footerYear) footerYear.textContent = new Date().getFullYear();

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;
    e.preventDefault();

    const offset = this.getAttribute("href") === "#mainFooter" ? 0 : 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

/* CARD SWAP DESIGN FOR THE PROJECT SECTION */

function initCardSwap(container, options = {}) {
  const {
    cards = [],
    delay = 5000,
    pauseOnHover = false,
    cardDistance = 30,
    verticalDistance = 40
  } = options;

  if (!cards.length) return { destroy() {} };

  const total = cards.length;
  let order = Array.from({ length: total }, (_, i) => i);
  let activeIndex = 0;
  let intervalId = null;
  let destroyed = false;

  const wrapper = document.createElement('div');
  wrapper.className = 'card-swap-container';
  container.appendChild(wrapper);

  const cardEls = cards.map((cardData, i) => {
    const el = document.createElement('div');
    el.className = 'card-swap-card';
    el.dataset.index = i;
    el.innerHTML = `
      <div class="swap-card-inner">
        <div class="swap-card-number">${cardData.number || String(i + 1).padStart(2, '0')}</div>
        <h3 class="swap-card-title">${cardData.title}</h3>
        <p class="swap-card-desc">${cardData.desc}</p>
        <ul class="swap-card-tech">${(cardData.tech || []).map(t => `<li>${t}</li>`).join('')}</ul>
        <div class="swap-card-links">${cardData.links || ''}</div>
      </div>
    `;
    wrapper.appendChild(el);
    return el;
  });

  const dots = document.createElement('div');
  dots.className = 'card-swap-dots';
  order.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = `card-swap-dot${i === 0 ? ' active' : ''}`;
    dot.addEventListener('click', () => {
      const targetIdx = i;
      if (targetIdx !== activeIndex) swapTo(targetIdx);
    });
    dots.appendChild(dot);
  });
  container.appendChild(dots);

  const placeCard = (el, slotIndex, totalCards) => {
    const x = slotIndex * cardDistance;
    const y = -slotIndex * verticalDistance;
    const z = -slotIndex * cardDistance * 1.5;
    const zIndex = totalCards - slotIndex;
    const scale = 1 - slotIndex * 0.03;
    el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) translateZ(${z}px) scale(${scale})`;
    el.style.zIndex = zIndex;
    el.style.opacity = slotIndex > 2 ? 0 : 1;
  };

  const updateDots = () => {
    dots.querySelectorAll('.card-swap-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });
  };

  const swapTo = (targetIdx) => {
    if (destroyed) return;
    const front = order[0];
    const frontEl = cardEls[front];

    frontEl.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease';
    frontEl.style.transform = `translate(calc(-50% + 0px), calc(-50% + 400px)) translateZ(-200px) scale(0.8)`;
    frontEl.style.opacity = '0';

    const rest = order.filter(idx => idx !== targetIdx);
    const newOrder = [targetIdx, ...rest.filter(idx => idx !== front), front];

    setTimeout(() => {
      if (destroyed) return;
      newOrder.forEach((idx, pos) => {
        const el = cardEls[idx];
        el.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease';
        placeCard(el, pos, total);
      });
      order = newOrder;
      activeIndex = targetIdx;
      updateDots();
    }, 400);
  };

  const swap = () => {
    if (order.length < 2 || destroyed) return;
    const nextIdx = order[1];
    swapTo(nextIdx);
  };

  const init = () => {
    order.forEach((idx, pos) => {
      const el = cardEls[idx];
      el.style.transition = 'none';
      placeCard(el, pos, total);
    });
    setTimeout(() => {
      order.forEach(idx => {
        cardEls[idx].style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease';
      });
    }, 50);
  };

  init();
  intervalId = setInterval(swap, delay);

  if (pauseOnHover) {
    wrapper.addEventListener('mouseenter', () => clearInterval(intervalId));
    wrapper.addEventListener('mouseleave', () => { intervalId = setInterval(swap, delay); });
  }

  return {
    destroy() {
      destroyed = true;
      if (intervalId) clearInterval(intervalId);
    }
  };
}

/* FERROFLUID BACKGROUND DESIGN*/

const FERROFLUID_MAX_COLORS = 8;

function ferrofluidHexToRGB(hex) {
  const c = hex.replace('#', '').padEnd(6, '0');
  return [parseInt(c.slice(0, 2), 16) / 255, parseInt(c.slice(2, 4), 16) / 255, parseInt(c.slice(4, 6), 16) / 255];
}

function ferrofluidPrepColors(input) {
  const base = (input && input.length ? input : ['#4F46E5', '#06B6D4', '#E0F2FE']).slice(0, FERROFLUID_MAX_COLORS);
  const count = base.length;
  const arr = [];
  for (let i = 0; i < FERROFLUID_MAX_COLORS; i++) arr.push(ferrofluidHexToRGB(base[Math.min(i, base.length - 1)]));
  return { arr, count };
}

function ferrofluidFlowVec(d) {
  switch (d) {
    case 'up': return [0, 1];
    case 'down': return [0, -1];
    case 'left': return [-1, 0];
    case 'right': return [1, 0];
    default: return [0, -1];
  }
}

const FERROFLUID_VERTEX = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FERROFLUID_FRAGMENT = `
precision highp float;
uniform vec3 iResolution;
uniform vec2 iMouse;
uniform float iTime;
uniform vec3 uColor0; uniform vec3 uColor1; uniform vec3 uColor2; uniform vec3 uColor3;
uniform vec3 uColor4; uniform vec3 uColor5; uniform vec3 uColor6; uniform vec3 uColor7;
uniform int uColorCount;
uniform vec2 uFlow; uniform float uSpeed; uniform float uScale; uniform float uTurbulence;
uniform float uFluidity; uniform float uRimWidth; uniform float uSharpness;
uniform float uShimmer; uniform float uGlow; uniform float uOpacity;
uniform float uMouseEnabled; uniform float uMouseStrength; uniform float uMouseRadius;
varying vec2 vUv;
#define PI 3.14159265
vec3 palette(float h) {
  int count = uColorCount; if (count < 1) count = 1;
  int idx = int(floor(clamp(h, 0.0, 0.999999) * float(count)));
  if (idx <= 0) return uColor0; if (idx == 1) return uColor1; if (idx == 2) return uColor2;
  if (idx == 3) return uColor3; if (idx == 4) return uColor4; if (idx == 5) return uColor5;
  if (idx == 6) return uColor6; return uColor7;
}
float hash(vec3 p3) { p3 = fract(p3 * 0.1031); p3 += dot(p3, p3.zyx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float smin(float a, float b, float k) { float r = exp2(-a / k) + exp2(-b / k); return -k * log2(r); }
float sinlerp(float a, float b, float w) { return mix(a, b, (sin(w * PI - PI / 2.0) + 1.0) / 2.0); }
float vn(vec2 p, float s, float seed) {
  vec2 cellp = floor(p / s); vec2 relp = mod(p, s);
  float g1 = hash(vec3(cellp, seed)); float g2 = hash(vec3(cellp.x + 1.0, cellp.y, seed));
  float g3 = hash(vec3(cellp.x + 1.0, cellp.y + 1.0, seed)); float g4 = hash(vec3(cellp.x, cellp.y + 1.0, seed));
  float bx = sinlerp(g1, g2, relp.x / s); float tx = sinlerp(g4, g3, relp.x / s);
  return sinlerp(bx, tx, relp.y / s);
}
float dbn(vec2 p, float s, float seed) {
  float o = s / 2.0; float n0 = vn(p, s, seed); float n1 = vn(p + vec2(o, o), s, seed + 0.1);
  float n2 = vn(p + vec2(-o, o), s, seed + 0.2); float n3 = vn(p + vec2(o, -o), s, seed + 0.3);
  float n4 = vn(p + vec2(-o, -o), s, seed + 0.4);
  return (2.0 * n0 + 1.5 * n1 + 1.25 * n2 + 1.125 * n3 + n4) / 7.0;
}
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  float ref = 700.0 / max(uScale, 0.05);
  vec2 p = fragCoord / iResolution.y * ref;
  float spd = 200.0 * uSpeed; float t = iTime;
  vec2 dir = uFlow; vec2 perp = vec2(-dir.y, dir.x);
  float distort1 = vn(p + perp * (t * spd), 60.0, 10.0) * 50.0 * uTurbulence;
  float distort2 = vn(p - perp * (t * spd), 120.0, 15.0) * 100.0 * uTurbulence;
  float peaks = dbn(p + distort1 + dir * (t * spd * 0.5), 40.0, 1.0);
  float peaks2 = dbn(p + distort2 - dir * (t * spd * 0.5), 40.0, 0.0);
  float mapeaks = smin(peaks, peaks2, max(uFluidity, 0.001));
  float mGlow = 0.0;
  if (uMouseEnabled > 0.5) {
    vec2 mp = iMouse / iResolution.y * ref; float md = length(p - mp) / ref;
    float rr = max(uMouseRadius, 0.02); mGlow = exp(-md * md / (rr * rr)) * uMouseStrength;
  }
  float band = (uRimWidth - abs((mapeaks - 0.4) * 2.0)) * 5.0;
  float ltn = clamp(band - vn(p + dir * (t * spd * 0.5), 60.0, 12.0) * uShimmer, 0.0, 1.0);
  ltn = pow(ltn, uSharpness) * uGlow;
  ltn *= clamp(1.0 - mGlow, 0.0, 1.0);
  float h = clamp(0.5 + (peaks - peaks2) * 0.8, 0.0, 1.0);
  vec3 col = palette(h);
  vec3 outc = col * ltn;
  float a = clamp(max(outc.r, max(outc.g, outc.b)), 0.0, 1.0);
  fragColor = vec4(outc, a * uOpacity);
}
void main() {
  vec4 color; mainImage(color, vUv * iResolution.xy); gl_FragColor = color;
}`;

function initFerrofluid(container, options = {}) {
  const {
    colors = ['#ffffff', '#ffffff', '#ffffff'],
    speed = 0.5, scale = 1.6, turbulence = 1, fluidity = 0.1,
    rimWidth = 0.2, sharpness = 2.5, shimmer = 1.5, glow = 2,
    flowDirection = 'down', opacity = 1,
    mouseInteraction = true, mouseStrength = 1, mouseRadius = 0.35, mouseDampening = 0.15,
    dpr
  } = options;

  let renderer = null, program = null, mesh = null, geometry = null;
  let rafId = null, destroyed = false;
  const mouseTarget = [0, 0];
  let lastTime = 0;

  const rendererDpr = dpr ?? (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);

  renderer = new Renderer({ dpr: rendererDpr, alpha: true, antialias: true });
  const gl = renderer.gl;
  const canvas = gl.canvas;
  gl.clearColor(0, 0, 0, 0);
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  container.appendChild(canvas);

  const { arr, count } = ferrofluidPrepColors(colors);

  const uniforms = {
    iResolution: { value: [gl.drawingBufferWidth, gl.drawingBufferHeight, 1] },
    iMouse: { value: [0, 0] },
    iTime: { value: 0 },
    uColor0: { value: arr[0] }, uColor1: { value: arr[1] }, uColor2: { value: arr[2] }, uColor3: { value: arr[3] },
    uColor4: { value: arr[4] }, uColor5: { value: arr[5] }, uColor6: { value: arr[6] }, uColor7: { value: arr[7] },
    uColorCount: { value: count },
    uFlow: { value: ferrofluidFlowVec(flowDirection) },
    uSpeed: { value: speed }, uScale: { value: scale }, uTurbulence: { value: turbulence },
    uFluidity: { value: fluidity }, uRimWidth: { value: rimWidth }, uSharpness: { value: sharpness },
    uShimmer: { value: shimmer }, uGlow: { value: glow }, uOpacity: { value: opacity },
    uMouseEnabled: { value: mouseInteraction ? 1 : 0 },
    uMouseStrength: { value: mouseStrength }, uMouseRadius: { value: mouseRadius }
  };

  program = new Program(gl, { vertex: FERROFLUID_VERTEX, fragment: FERROFLUID_FRAGMENT, uniforms });
  geometry = new Triangle(gl);
  mesh = new Mesh(gl, { geometry, program });

  const resize = () => {
    if (!container || destroyed) return;
    const rect = container.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height);
    uniforms.iResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight, 1];
  };

  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  const onPointerMove = e => {
    const rect = canvas.getBoundingClientRect();
    const sc = renderer.dpr || 1;
    mouseTarget[0] = (e.clientX - rect.left) * sc;
    mouseTarget[1] = (rect.height - (e.clientY - rect.top)) * sc;
    if (mouseDampening <= 0) {
      uniforms.iMouse.value[0] = mouseTarget[0];
      uniforms.iMouse.value[1] = mouseTarget[1];
    }
  };

  if (mouseInteraction) canvas.addEventListener('pointermove', onPointerMove);

  const loop = t => {
    if (destroyed) return;
    rafId = requestAnimationFrame(loop);
    uniforms.iTime.value = t * 0.001;
    if (mouseDampening > 0) {
      if (!lastTime) lastTime = t;
      const dt = (t - lastTime) / 1000;
      lastTime = t;
      const tau = Math.max(1e-4, mouseDampening);
      let factor = 1 - Math.exp(-dt / tau);
      if (factor > 1) factor = 1;
      const cur = uniforms.iMouse.value;
      cur[0] += (mouseTarget[0] - cur[0]) * factor;
      cur[1] += (mouseTarget[1] - cur[1]) * factor;
    } else {
      lastTime = t;
    }
    try { renderer.render({ scene: mesh }); } catch (e) {}
  };
  rafId = requestAnimationFrame(loop);

  return {
    destroy() {
      destroyed = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (mouseInteraction) canvas.removeEventListener('pointermove', onPointerMove);
      ro.disconnect();
      if (canvas.parentElement === container) container.removeChild(canvas);
      try { gl.getExtension('WEBGL_lose_context')?.loseContext(); } catch (e) {}
    }
  };
}

/* ==========================================================================
   5. INITIALIZES FERROFLUID AND CARDSWAP
   ========================================================================== */

const heroFerrofluid = document.getElementById('heroFerrofluid');
const cardSwapEl = document.getElementById('cardSwap');
const prevBtn = document.getElementById('prevProject');
const nextBtn = document.getElementById('nextProject');

if (heroFerrofluid) {
  initFerrofluid(heroFerrofluid, {
    colors: ['#c5dc6d', '#a2b499', '#8a9189'],
    speed: 0.3,
    scale: 1.8,
    turbulence: 0.8,
    fluidity: 0.15,
    rimWidth: 0.25,
    sharpness: 3,
    shimmer: 1.2,
    glow: 1.5,
    flowDirection: 'down',
    opacity: 0.6,
    mouseInteraction: true,
    mouseStrength: 0.8,
    mouseRadius: 0.3,
  });
}

if (cardSwapEl) {
  const projectCards = [
    {
      number: '01',
      title: 'Go Text Processor',
      desc: 'A command-line application built in Go that processes and transforms text files. Handles formatting, value conversion, and text transformations while processing files efficiently.',
      tech: ['Go', 'Regex', 'Streams', 'CLI'],
      links: `<a href="https://github.com/dsunday05034-crypto/go_text_processor" class="btn-link" target="_blank" rel="noopener noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
        GitHub
      </a>`
    },
    {
      number: '02',
      title: 'ASCII Art Web Generator',
      desc: 'A high-performance full-stack web application serving as a centralized canvas for an optimized Go text-rendering engine. Cloud-native architecture with Go file embedding, optimized I/O, and serverless edge deployment.',
      tech: ['Go', 'Go Embed', 'HTTP Server', 'RGBA', 'File I/O'],
      links: `<a href="https://github.com/dsunday05034-crypto/ASCII-Art-Web-Generator.git" class="btn-link" target="_blank" rel="noopener noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
        GitHub
      </a>
      <a href="https://ascii-art-web-generator.vercel.app/" class="btn-link" target="_blank" rel="noopener noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="12" height="12"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Live Demo
      </a>`
    },
    {
      number: '03',
      title: 'Forex AI Trader',
      desc: 'A forex market analysis project combining economic concepts, market data, and AI-assisted insights. Studying price movements, evaluating trading opportunities, and experimenting with automated decision-making tools.',
      tech: ['Go', 'AI/ML', 'REST APIs', 'Data Analysis'],
      links: `<span class="status-badge">In Active Development</span>`
    },
  ];

  initCardSwap(cardSwapEl, {
    cards: projectCards,
    delay: 5000,
    pauseOnHover: true,
    cardDistance: 30,
    verticalDistance: 40,
  });

  if (prevBtn && nextBtn) {
    let currentIndex = 0;
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + projectCards.length) % projectCards.length;
      const dots = cardSwapEl.parentElement?.querySelectorAll('.card-swap-dot');
      dots?.[currentIndex]?.click();
    });
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % projectCards.length;
      const dots = cardSwapEl.parentElement?.querySelectorAll('.card-swap-dot');
      dots?.[currentIndex]?.click();
    });
  }
}

