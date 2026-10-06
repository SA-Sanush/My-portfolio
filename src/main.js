import "./styles/main.css";
import "./modules/three-loader.js";
import "./modules/three-bg.js";
import "./modules/three-showcase.js";
import "./modules/chatbot.js";
import "./modules/cmd-palette.js";
import "./modules/ui-effects.js";

/* ═══════════════════════════════════════
   SKILLS CARDS (Points to local SVGs)
═══════════════════════════════════════ */
const skills = [
  { icon: "icons/html5.svg", name: "HTML5", pct: 90 },
  { icon: "icons/css.svg", name: "CSS3", pct: 85 },
  { icon: "icons/javascript.svg", name: "JavaScript", pct: 78 },
  { icon: "icons/react.svg", name: "React JS", pct: 72 },
  { icon: "icons/nextdotjs.svg", name: "Next JS", pct: 65 },
  { icon: "icons/tailwindcss.svg", name: "Tailwind CSS", pct: 80 },
  { icon: "icons/threedotjs.svg", name: "Three JS", pct: 60 },
  { icon: "icons/bootstrap.svg", name: "Bootstrap", pct: 82 },
  { icon: "icons/figma.svg", name: "Figma", pct: 75 },
  { icon: "icons/python.svg", name: "Python", pct: 68 },
  { icon: "icons/flask.svg", name: "Flask", pct: 70 },
  { icon: "icons/mysql.svg", name: "MySQL", pct: 65 },
  { icon: "icons/git.svg", name: "Git", pct: 74 },
  { icon: "icons/github.svg", name: "GitHub", pct: 74 }
];

const grid = document.getElementById("skills-grid");
if (grid) {
  skills.forEach((s, i) => {
    grid.innerHTML += `
    <div class="sk-card reveal" style="transition-delay:${i * 0.06}s">
      <div class="sk-icon">
        <img src="${s.icon}" alt="${s.name} logo" loading="lazy" />
      </div>
      <div class="sk-name">${s.name}</div>
      <div class="sk-bar-wrap"><div class="sk-bar" data-w="${s.pct}"></div></div>
      <div class="sk-pct">${s.pct}%</div>
    </div>`;
  });
}

/* ═══════════════════════════════════════
   SCROLL REVEAL OBSERVERS
═══════════════════════════════════════ */
const revObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal, .reveal-l, .reveal-r").forEach((el) => revObs.observe(el));

// Skill bars loading animation on scroll
const barObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.querySelectorAll(".sk-bar").forEach((b) => {
          const w = b.dataset.w;
          b.style.width = "0";
          setTimeout(() => {
            b.style.width = w + "%";
          }, 200);
        });
        barObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.2 }
);

const sg2 = document.getElementById("skills-grid");
if (sg2) barObs.observe(sg2);

/* ═══════════════════════════════════════
   NAV BAR DYNAMICS
═══════════════════════════════════════ */
const nav = document.querySelector("nav");
let lastScrollY = window.scrollY;
window.addEventListener(
  "scroll",
  () => {
    if (!nav) return;
    const currentY = window.scrollY;
    nav.classList.toggle("nav-scrolled", currentY > 18);
    if (window.innerWidth <= 768) {
      nav.classList.remove("nav-hidden");
      lastScrollY = currentY;
      return;
    }
    const scrollingDown = currentY > lastScrollY;
    nav.classList.toggle("nav-hidden", scrollingDown && currentY > 120);
    lastScrollY = currentY;
  },
  { passive: true }
);

/* ═══════════════════════════════════════
   SPINNING RINGS STYLING
═══════════════════════════════════════ */
const style = document.createElement("style");
style.textContent = `@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}`;
document.head.appendChild(style);

/* ═══════════════════════════════════════
   PWA SERVICE WORKER REGISTRATION (Fixed Loop)
═══════════════════════════════════════ */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js")
      .then((reg) => console.log("Service Worker registered successfully:", reg.scope))
      .catch((err) => console.warn("Service Worker registration failed:", err));
  });
}
