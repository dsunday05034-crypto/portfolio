"use strict";

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
  }, 800);
});

let isScrolling = false;
window.addEventListener("scroll", () => {
  if (!isScrolling) {
    window.requestAnimationFrame(() => {
      if (navHeader) navHeader.classList.toggle("scrolled", window.scrollY > 30);
      updateActiveLink();
      toggleBackToTop();
      isScrolling = false;
    });
    isScrolling = true;
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

const phrases = ["Economics Graduate", "Software Developer", "Backend Engineer", "Go (Golang) Developer", "Problem Solver"];
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