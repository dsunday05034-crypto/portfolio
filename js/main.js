"use strict";

const loader = document.getElementById("loader");

window.addEventListener("load", () => {
  // Matches CSS animation duration + buffer
  setTimeout(() => {
    loader.classList.add("hidden");
    document.body.style.overflow = "";
    triggerHeroReveal();
  }, 1500);
});

document.body.style.overflow = "hidden";

const navHeader = document.getElementById("navHeader");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const navLinkEls = navLinks.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  navHeader.classList.toggle("scrolled", window.scrollY > 30);
  updateActiveLink();
  toggleBackToTop();
}, { passive: true });

hamburger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  hamburger.classList.toggle("open", open);
  hamburger.setAttribute("aria-expanded", open);
  document.body.style.overflow = open ? "hidden" : "";
});

navLinkEls.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  });
});

function updateActiveLink() {
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

const themeToggle = document.getElementById("themeToggle");
const html = document.documentElement;

const savedTheme = localStorage.getItem("ds-theme") || "dark";
html.setAttribute("data-theme", savedTheme);

themeToggle.addEventListener("click", () => {
  const current = html.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("ds-theme", next);
});

const typedEl = document.getElementById("heroTyped");
const phrases = [
  "Economics Graduate",
  "Software Developer",
  "Backend Engineer",
  "Go (Golang) Developer",
  "Problem Solver",
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
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

const revealEls = document.querySelectorAll(".reveal:not(.hero .reveal)");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
);

revealEls.forEach((el) => revealObserver.observe(el));

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

const backToTop = document.getElementById("backToTop");

function toggleBackToTop() {
  backToTop.classList.toggle("visible", window.scrollY > 400);
}

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const footerYear = document.getElementById("footerYear");
if (footerYear) footerYear.textContent = new Date().getFullYear();

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;
    e.preventDefault();

    const isFooter = this.getAttribute("href") === "#mainFooter";
    const offset = isFooter ? 0 : 80;

    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  });
});