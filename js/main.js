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
const navLinkEls = navLinks ? navLinks.querySelectorAll(".nav-link") : [];

window.addEventListener("scroll", () => {
  navHeader.classList.toggle("scrolled", window.scrollY > 30);
  updateActiveLink();
  toggleBackToTop();
}, { passive: true });

if (hamburger && navLinks) {
  function openMenu() {
    hamburger.classList.add("open");
    navLinks.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "";
  }

  function closeMenu() {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  hamburger.addEventListener("click", () => {
    if (navLinks.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navLinkEls.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    const isClickInsideMenu = navLinks.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);
    
    if (navLinks.classList.contains("open") && !isClickInsideMenu && !isClickOnHamburger) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navLinks.classList.contains("open")) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 700 && navLinks.classList.contains("open")) {
      closeMenu();
    }
  });
}

function updateActiveLink() {
  const sections = document.querySelectorAll("main section[id], footer[id]");
  let current = "";

  // Check if the user has reached the absolute bottom of the page viewport
  const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 50);

  if (isAtBottom) {
    current = "mainFooter";
  } else {
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });
  }

  navLinkEls.forEach((link) => {
    const href = link.getAttribute("href").slice(1);
    link.classList.toggle("active", href === current);
  });
}

const themeToggle = document.getElementById("themeToggle");
const html = document.documentElement;

const savedTheme = localStorage.getItem("ds-theme") || "dark";
html.setAttribute("data-theme", savedTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("ds-theme", next);
  });
}

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
  if (backToTop) {
    backToTop.classList.toggle("visible", window.scrollY > 400);
  }
}

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

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