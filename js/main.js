const loader = document.getElementById("loader");
const html = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const navHeader = document.getElementById("navHeader");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const navLinkEls = navLinks ? navLinks.querySelectorAll(".nav-link") : [];
const backToTop = document.getElementById("backToTop");
const typedEl = document.getElementById("heroTyped");
const typedLiveEl = document.getElementById("heroTypedLive");
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
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimer = null;

function scheduleType(delay) {
  if (typingTimer) clearTimeout(typingTimer);
  typingTimer = setTimeout(type, delay);
}

function type() {
  if (!typedEl) return;

  if (document.hidden) {
    scheduleType(400);
    return;
  }

  const currentText = phrases[phraseIndex];

  if (isDeleting) {
    charIndex = Math.max(0, charIndex - 1);
    typedEl.textContent = currentText.slice(0, charIndex);
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      scheduleType(450);
      return;
    }
    scheduleType(45);
    return;
  }

  charIndex = Math.min(currentText.length, charIndex + 1);
  typedEl.textContent = currentText.slice(0, charIndex);

  if (charIndex === currentText.length) {
    if (typedLiveEl) typedLiveEl.textContent = currentText;
    isDeleting = true;
    scheduleType(1800);
    return;
  }

  scheduleType(100);
}

function triggerHeroReveal() {
  document.querySelectorAll(".hero .reveal").forEach((el, i) => {
    setTimeout(() => el.classList.add("in-view"), i * 150);
  });
  scheduleType(800);
}

document.addEventListener("visibilitychange", () => {
  if (!document.hidden && typedEl) scheduleType(200);
});

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

  if (!cards.length) return { next() { }, prev() { }, destroy() { } };

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
    next() {
      if (order.length < 2 || destroyed) return;
      swapTo(order[1]);
    },
    prev() {
      if (order.length < 2 || destroyed) return;
      swapTo(order[order.length - 1]);
    },
    destroy() {
      destroyed = true;
      if (intervalId) clearInterval(intervalId);
    }
  };
}

const cardSwapEl = document.getElementById('cardSwap');
const prevBtn = document.getElementById('prevProject');
const nextBtn = document.getElementById('nextProject');

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
      tech: ['Python', 'AI/ML', 'REST APIs', 'Data Analysis'],
      links: `<span class="status-badge">Private Repo</span>`
    },
  ];

  const isMobileStack = window.matchMedia('(max-width: 768px)').matches;

  const swapInstance = initCardSwap(cardSwapEl, {
    cards: projectCards,
    delay: 5000,
    pauseOnHover: true,
    cardDistance: isMobileStack ? 16 : 30,
    verticalDistance: isMobileStack ? 22 : 40,
  });

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => swapInstance.prev());
    nextBtn.addEventListener('click', () => swapInstance.next());
  }
}
