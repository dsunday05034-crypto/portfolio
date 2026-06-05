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
   2. CUSTOM CURSOR
═══════════════════════════════════════════════ */
const cursor = document.getElementById("cursor");
const cursorFollower = document.getElementById("cursorFollower");

if (window.matchMedia("(hover: hover)").matches) {
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + "px";
    cursor.style.top  = mouseY + "px";
  });

  // Smooth follower with RAF
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + "px";
    cursorFollower.style.top  = followerY + "px";
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Expand on interactive elements
  const interactives = document.querySelectorAll("a, button, input, textarea");
  interactives.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorFollower.style.width  = "52px";
      cursorFollower.style.height = "52px";
    });
    el.addEventListener("mouseleave", () => {
      cursorFollower.style.width  = "32px";
      cursorFollower.style.height = "32px";
    });
  });

  // Hide when leaving window
  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
    cursorFollower.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    cursor.style.opacity = "1";
    cursorFollower.style.opacity = "1";
  });
}

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
  const sections = document.querySelectorAll("main section[id]");
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
   8. CONTACT FORM
═══════════════════════════════════════════════ */
const contactForm = document.getElementById("contactForm");
const formStatus  = document.getElementById("formStatus");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name    = contactForm.name.value.trim();
    const email   = contactForm.email.value.trim();
    const subject = contactForm.subject.value.trim();
    const message = contactForm.message.value.trim();

    // Basic validation
    if (!name || !email || !subject || !message) {
      showStatus("Please fill in all fields.", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus("Please enter a valid email address.", "error");
      return;
    }

    // Simulate send (replace with actual backend / EmailJS / Formspree)
    const submitBtn = contactForm.querySelector(".form-submit");
    submitBtn.disabled = true;
    submitBtn.querySelector(".submit-text").textContent = "Sending…";

    setTimeout(() => {
      showStatus("Message sent! I'll get back to you soon.", "success");
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.querySelector(".submit-text").textContent = "Send Message";
    }, 1600);
  });
}

function showStatus(msg, type) {
  formStatus.textContent = msg;
  formStatus.className   = "form-status " + type;
  setTimeout(() => {
    formStatus.textContent = "";
    formStatus.className   = "form-status";
  }, 5000);
}

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
    const offset = 80; // nav height
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  });
});
