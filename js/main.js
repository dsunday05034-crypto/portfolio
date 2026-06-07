/**
 * Daniel Sunday — Portfolio JS
 * Features: loader, custom cursor, navigation, typing effect,
 *           scroll reveal, skill bars, theme toggle, contact form,
 *           back-to-top button.
 */

"use strict";

/* ═══════════════════════════════════════════════
   1. LOADER
═══════════════════════════════════════════════ */
const loader = document.getElementById("loader");

window.addEventListener("load", () => {
  // Give the fill bar time to animate, then fade out
  setTimeout(() => {
    loader.classList.add("hidden");
    document.body.style.overflow = "";
    // Trigger hero animations once loader is gone
    triggerHeroReveal();
  }, 1500);
});

// Prevent scroll while loading
document.body.style.overflow = "hidden";

/* ═══════════════════════════════════════════════
   3. NAVIGATION
═══════════════════════════════════════════════ */
const navHeader   = document.getElementById("navHeader");
const hamburger   = document.getElementById("hamburger");
const navLinks    = document.getElementById("navLinks");
const navLinkEls  = navLinks.querySelectorAll(".nav-link");

// Scroll shadow
window.addEventListener("scroll", () => {
  navHeader.classList.toggle("scrolled", window.scrollY > 30);
  updateActiveLink();
  toggleBackToTop();
}, { passive: true });

// Mobile menu
hamburger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  hamburger.classList.toggle("open", open);
  hamburger.setAttribute("aria-expanded", open);
  // Prevent page scroll when menu open
  document.body.style.overflow = open ? "hidden" : "";
});

// Close menu on link click (mobile)
navLinkEls.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  });
});

// Highlight active section link
function updateActiveLink() {
  // Added footer[id] so the header highlights "Contact" when reaching the bottom
  const sections = document.querySelectorAll("main section[id], footer[id]");
  let current = "";

  sections.forEach((sec) => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.id;
  });

  navLinkEls.forEach((link) => {
    const href = link.getAttribute("href").slice(1);
    link.classList.toggle("active", href === current);
  });
}

/* ═══════════════════════════════════════════════
   4. THEME TOGGLE
═══════════════════════════════════════════════ */
const themeToggle = document.getElementById("themeToggle");
const html        = document.documentElement;

// Load saved preference
const savedTheme = localStorage.getItem("ds-theme") || "dark";
html.setAttribute("data-theme", savedTheme);

themeToggle.addEventListener("click", () => {
  const current = html.getAttribute("data-theme");
  const next    = current === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("ds-theme", next);
});

/* ═══════════════════════════════════════════════
   5. TYPING EFFECT (hero)
═══════════════════════════════════════════════ */
const typedEl = document.getElementById("heroTyped");
const phrases = [
  "Economics Graduate",
  "Software Developer",
  "Backend Engineer",
  "Go (Golang) Developer",
  "Problem Solver",
];

let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
let typingDelay = 110;

function type() {
  if (!typedEl) return;

  const current = phrases[phraseIndex];

  if (isDeleting) {
    typedEl.textContent = current.slice(0, charIndex--);
    typingDelay = 55;
  } else {
    typedEl.textContent = current.slice(0, charIndex++);
    typingDelay = 110;
  }

  if (!isDeleting && charIndex === current.length + 1) {
    // Pause at end before deleting
    isDeleting  = true;
    typingDelay = 1800;
  } else if (isDeleting && charIndex === 0) {
    isDeleting  = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typingDelay = 500;
  }

  setTimeout(type, typingDelay);
}

// Start typing after loader
function triggerHeroReveal() {
  // Reveal hero elements
  document.querySelectorAll(".hero .reveal").forEach((el, i) => {
    setTimeout(() => el.classList.add("in-view"), i * 150);
  });

  // Start typing
  setTimeout(type, 800);
}

/* ═══════════════════════════════════════════════
   6. SCROLL REVEAL
═══════════════════════════════════════════════ */
const revealEls = document.querySelectorAll(".reveal:not(.hero .reveal)");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        // Unobserve after reveal for performance
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
);

revealEls.forEach((el) => revealObserver.observe(el));

/* ═══════════════════════════════════════════════
   7. SKILL BARS (animate on intersection)
═══════════════════════════════════════════════ */
const skillCards = document.querySelectorAll(".skill-card");

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

skillCards.forEach((card) => skillObserver.observe(card));

/* ═══════════════════════════════════════════════
   9. BACK TO TOP
═══════════════════════════════════════════════ */
const backToTop = document.getElementById("backToTop");

function toggleBackToTop() {
  backToTop.classList.toggle("visible", window.scrollY > 400);
}

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ═══════════════════════════════════════════════
   10. FOOTER YEAR
═══════════════════════════════════════════════ */
const footerYear = document.getElementById("footerYear");
if (footerYear) footerYear.textContent = new Date().getFullYear();

/* ═══════════════════════════════════════════════
   11. SMOOTH SCROLL (fallback for older browsers)
═══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    
    // If target is the footer, scroll completely to the bottom (0 offset)
    const isFooter = this.getAttribute("href") === "#mainFooter";
    const offset = isFooter ? 0 : 80; // 80px nav header height for sections
    
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  });
});
