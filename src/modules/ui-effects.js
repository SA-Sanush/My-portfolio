import emailjs from "@emailjs/browser";

(function initUiEffects() {
  "use strict";

  /* ═══════════════════════════════════════
     CURSOR
  ═══════════════════════════════════════ */
  const cur = document.getElementById("cur");
  const curRing = document.getElementById("cur-ring");
  let mx = 0,
    my = 0,
    rx = 0,
    ry = 0;

  if (cur && curRing) {
    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      cur.style.left = mx + "px";
      cur.style.top = my + "px";
    });

    const animRing = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      curRing.style.left = rx + "px";
      curRing.style.top = ry + "px";
      requestAnimationFrame(animRing);
    };
    animRing();

    const addHoverEffect = (elements) => {
      elements.forEach((el) => {
        el.addEventListener("mouseenter", () => curRing.classList.add("big"));
        el.addEventListener("mouseleave", () => curRing.classList.remove("big"));
      });
    };

    addHoverEffect(document.querySelectorAll("a, button, .sk-card, .edu-card, .about-card, .resume-cta, input, textarea, .filter-btn, .bento-card, .t-tab, .mood-box, .explore-btn, .modal-link-btn, .gh-stat-card, .gh-repo-card, .cert-row, .cert-link-btn, .side-dock-link, .modal-close"));

    // Observe dynamically added elements
    const observer = new MutationObserver(() => {
      addHoverEffect(document.querySelectorAll("a, button, .sk-card, .edu-card, .about-card, .resume-cta, input, textarea, .filter-btn, .bento-card, .t-tab, .mood-box, .explore-btn, .modal-link-btn, .gh-stat-card, .gh-repo-card, .cert-row, .cert-link-btn, .side-dock-link, .modal-close"));
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  /* ═══════════════════════════════════════
     GLOBAL INERT HELPERS (Accessibility)
  ═══════════════════════════════════════ */
  window.lastFocusedElement = null;
  window.setInertExcept = function (activeEl) {
    const ids = ["app", "side-dock", "project-modal", "chat-trigger", "chat-window", "resume-fab", "cmd-palette"];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (el === activeEl) {
        el.removeAttribute("inert");
      } else {
        el.setAttribute("inert", "");
      }
    });
  };
  window.clearInert = function () {
    const ids = ["app", "side-dock", "project-modal", "chat-trigger", "chat-window", "resume-fab", "cmd-palette"];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.removeAttribute("inert");
    });
  };

  /* ═══════════════════════════════════════
     STATS COUNTER ANIMATION
  ═══════════════════════════════════════ */
  function animateStats() {
    const stats = [
      { el: document.querySelector(".stats-bar .stat-item:nth-child(1) .stat-num"), target: 5, decimals: 0, suffix: "+" },
      { el: document.querySelector(".stats-bar .stat-item:nth-child(3) .stat-num"), target: 13, decimals: 0, suffix: "" },
      { el: document.querySelector(".stats-bar .stat-item:nth-child(5) .stat-num"), target: 12, decimals: 0, suffix: "+" },
      { el: document.querySelector(".stats-bar .stat-item:nth-child(7) .stat-num"), target: 3, decimals: 0, suffix: "" },
      { el: document.querySelector(".stats-bar .stat-item:nth-child(9) .stat-num"), target: 3, decimals: 0, suffix: "+" }
    ];

    stats.forEach(stat => {
      if (!stat.el) return;
      let current = 0;
      const duration = 1500;
      const steps = 40;
      const stepValue = stat.target / steps;
      stat.el.textContent = "0" + stat.suffix;

      const timer = setInterval(() => {
        current += stepValue;
        if (current >= stat.target) {
          current = stat.target;
          clearInterval(timer);
        }
        stat.el.textContent = current.toFixed(stat.decimals) + stat.suffix;
      }, duration / steps);
    });
  }

  const statsBar = document.querySelector(".stats-bar");
  if (statsBar) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStats();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(statsBar);
  }

  /* ═══════════════════════════════════════
     SCROLL-SPY NAVIGATION
  ═══════════════════════════════════════ */
  const spySections = document.querySelectorAll("section, #hero");
  const navLinks = document.querySelectorAll(".nav-link, .nav-home");

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          link.classList.remove("active");
          const href = link.getAttribute("href");
          if (href === `#${id}` || (href === "#hero" && id === "hero")) {
            link.classList.add("active");
          }
        });
      }
    });
  }, { rootMargin: "-30% 0px -60% 0px" });

  spySections.forEach(sec => spyObserver.observe(sec));

  /* ═══════════════════════════════════════
     CONTACT FORM SUBMISSION (Hardened with EmailJS npm package)
  ═══════════════════════════════════════ */
  window.handleFormSubmit = async function() {
    const toast = document.getElementById("form-toast");
    const form = document.getElementById("portfolio-contact-form");
    const btn = form ? form.querySelector(".submit-btn") : null;
    const btnSpan = btn ? btn.querySelector("span") : null;

    // EmailJS keys
    const EMAILJS_PUBLIC_KEY = "WrqDIjZxVauYxwUEg"; 
    const EMAILJS_SERVICE_ID = "service_fbolu0w";
    const EMAILJS_TEMPLATE_ID = "template_j91i93m";

    if (btn) { btn.disabled = true; btn.style.opacity = "0.7"; }
    if (btnSpan) btnSpan.textContent = "Sending…";

    if (EMAILJS_PUBLIC_KEY === "YOUR_EMAILJS_PUBLIC_KEY" || !EMAILJS_PUBLIC_KEY) {
      alert("Please configure your EmailJS credentials in ui-effects.js first!");
      if (btn) { btn.disabled = false; btn.style.opacity = "1"; }
      if (btnSpan) btnSpan.textContent = "Send Message";
      return;
    }

    try {
      // Initialize EmailJS safely using npm library
      emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY,
      });

      const templateParams = {
        name: document.getElementById("form-name").value,
        from_name: document.getElementById("form-name").value,
        email: document.getElementById("form-email").value,
        reply_to: document.getElementById("form-email").value,
        message: document.getElementById("form-message").value,
        title: "New Contact Message",
      };

      const res = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

      if (res.status === 200) {
        if (toast) {
          toast.classList.add("show");
          setTimeout(() => toast.classList.remove("show"), 5000);
        }
        if (form) form.reset();
      } else {
        alert("Oops! Something went wrong: status " + res.status);
      }
    } catch (err) {
      console.error("EmailJS Error:", err);
      alert("Error sending message. Please email me directly at sasanush86@gmail.com");
    } finally {
      if (btn) { btn.disabled = false; btn.style.opacity = "1"; }
      if (btnSpan) btnSpan.textContent = "Send Message";
    }
  };

  /* ═══════════════════════════════════════
     CONFETTI ON FORM SUBMIT
  ═══════════════════════════════════════ */
  const confettiCanvas = document.getElementById("confetti-canvas");
  let confettiActive = false;

  function launchConfetti() {
    if (!confettiCanvas || confettiActive) return;
    confettiActive = true;
    confettiCanvas.style.display = "block";
    const ctx = confettiCanvas.getContext("2d");
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    const colors = [window.currentAccentColor || "#FFE000", `color-mix(in srgb, ${window.currentAccentColor || "#FFE000"} 60%, #ff5500)`,"#fff","#00f7ff","#6FCF97","#FF6B6B"];
    const particles = Array.from({length: 120}, () => ({
      x: Math.random() * confettiCanvas.width,
      y: -20,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      r: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * Math.PI * 2,
      angVel: (Math.random() - 0.5) * 0.2,
      shape: Math.random() > 0.5 ? "rect" : "circle"
    }));
    let frame = 0;
    function animConf() {
      if (frame > 200) {
        confettiCanvas.style.display = "none";
        confettiActive = false;
        return;
      }
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.angle += p.angVel; p.vy += 0.05;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - frame / 200);
        if (p.shape === "rect") ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        else { ctx.beginPath(); ctx.arc(0, 0, p.r, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
      });
      frame++;
      requestAnimationFrame(animConf);
    }
    animConf();
  }

  const origSubmit = window.handleFormSubmit;
  window.handleFormSubmit = function() {
    if (origSubmit) origSubmit();
    launchConfetti();
  };

  /* ═══════════════════════════════════════
     PROJECTS CATEGORY FILTER
  ═══════════════════════════════════════ */
  const filterBtns = document.querySelectorAll(".project-filters .filter-btn");
  const projectCards = document.querySelectorAll(".bento-grid .bento-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        if (filter === "all" || card.dataset.category === filter) {
          card.classList.remove("hide");
          card.style.opacity = "0";
          card.style.transform = "scale(0.95)";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 50);
        } else {
          card.classList.add("hide");
        }
      });
    });
  });

  /* ═══════════════════════════════════════
     TRAVEL TABS INTERACTION
  ═══════════════════════════════════════ */
  const travelTabs = document.querySelectorAll(".travel-tabs .t-tab");
  const previewLoc = document.querySelector(".travel-preview-card .p-loc");
  const previewPrice = document.querySelector(".travel-preview-card .p-price");

  const travelData = {
    "Kerala": { bgAccent: true, loc: "Exploring Kerala, IN", price: "$299/day" },
    "Pune": { bg: "linear-gradient(135deg, #00C6FF, #0072FF)", loc: "Visiting Pune City, IN", price: "$199/day" },
    "Paris": { bg: "linear-gradient(135deg, #f857a6, #ff5858)", loc: "Sightseeing Paris, FR", price: "$499/day" }
  };

  travelTabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      travelTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const data = travelData[tab.textContent.trim()];
      if (data && previewLoc && previewPrice) {
        previewLoc.textContent = data.loc;
        previewPrice.textContent = data.price;
      }
    });
  });

  /* ═══════════════════════════════════════
     CERTIFICATES & REPOS REVEALS
  ═══════════════════════════════════════ */
  const certObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateX(0)";
        }, i * 120);
        certObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".cert-row").forEach((row) => {
    row.style.opacity = "0";
    row.style.transform = "translateX(-24px)";
    row.style.transition = "opacity 0.6s ease, transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)";
    certObserver.observe(row);
  });

  const ghObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }, i * 70);
        ghObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(".gh-repo-card, .gh-stat-card").forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(24px)";
    card.style.transition = "opacity 0.5s ease, transform 0.5s ease, border-color 0.3s, box-shadow 0.3s";
    ghObserver.observe(card);
  });

  /* ═══════════════════════════════════════
     GITHUB STAT COUNTERS
  ═══════════════════════════════════════ */
  const ghStatNums = document.querySelectorAll(".gh-stat-num");
  const ghStatObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.textContent.replace(/[^0-9.]/g, "");
        const suffix = el.textContent.replace(/[0-9.]/g, "");
        if (!raw) return;
        const target = parseFloat(raw);
        let curr = 0;
        const step = target / 40;
        const iv = setInterval(() => {
          curr = Math.min(curr + step, target);
          el.textContent = (Number.isInteger(target) ? Math.floor(curr) : curr.toFixed(1)) + suffix;
          if (curr >= target) clearInterval(iv);
        }, 35);
        ghStatObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  ghStatNums.forEach(el => ghStatObserver.observe(el));

  /* ═══════════════════════════════════════
     HERO BG TEXT PARALLAX
  ═══════════════════════════════════════ */
  const heroBgText = document.querySelector(".hero-bg-text");
  if (heroBgText) {
    window.addEventListener("scroll", () => {
      heroBgText.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    }, { passive: true });
  }

  /* ═══════════════════════════════════════
     SCROLL PROGRESS BAR
  ═══════════════════════════════════════ */
  const progressBar = document.getElementById("scroll-progress");
  if (progressBar) {
    window.addEventListener("scroll", () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = Math.min((scrolled / total) * 100, 100) + "%";
    }, { passive: true });
  }

  /* ═══════════════════════════════════════
     TYPING HERO EFFECT
  ═══════════════════════════════════════ */
  const typingEl = document.getElementById("typing-text");
  const phrases = [
    "pixel-perfect interfaces",
    "AI-powered tools",
    "3D web experiences",
    "interactive animations",
    "responsive UIs",
    "creative front-ends"
  ];
  let pIdx = 0, cIdx = 0, deleting = false;
  function typeLoop() {
    if (!typingEl) return;
    const current = phrases[pIdx];
    if (!deleting) {
      typingEl.textContent = current.slice(0, ++cIdx);
      if (cIdx === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1800);
        return;
      }
      setTimeout(typeLoop, 60);
    } else {
      typingEl.textContent = current.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        setTimeout(typeLoop, 400);
        return;
      }
      setTimeout(typeLoop, 30);
    }
  }
  if (typingEl) setTimeout(typeLoop, 2800);

  /* ═══════════════════════════════════════
     3D CARD TILT EFFECT (Bento, About, etc.)
  ═══════════════════════════════════════ */
  const tiltCards = document.querySelectorAll(
    ".bento-card, .about-card, .about-visual, .gh-stat-card, .gh-repo-card, .edu-card, .c-card, .msg-card"
  );
  const MAX_TILT = 10;

  tiltCards.forEach((card) => {
    let rafId = null;

    card.addEventListener("mousemove", (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transition = "transform 0.1s ease-out";
        card.style.transform = `perspective(800px) rotateY(${x * MAX_TILT}deg) rotateX(${-y * MAX_TILT}deg) scale3d(1.02, 1.02, 1.02)`;
      });
    });

    card.addEventListener("mouseleave", () => {
      if (rafId) cancelAnimationFrame(rafId);
      card.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
      card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)";
    });
  });

  /* ═══════════════════════════════════════
     GITHUB CONTRIBUTION HEATMAP
  ═══════════════════════════════════════ */
  const heatmap = document.getElementById("gh-heatmap");
  if (heatmap) {
    const activity = [
      0,0,1,1,0,2,0, 1,1,0,0,2,1,0, 0,0,3,2,0,1,0,
      0,1,1,2,0,0,1, 2,0,0,1,1,0,2, 1,0,2,0,3,1,0,
      0,0,1,2,0,0,1, 3,2,1,0,0,2,1, 0,1,0,2,1,0,0,
      2,1,0,1,3,0,1, 0,2,1,0,2,0,1, 1,0,0,2,1,3,0,
      0,1,2,0,1,0,2, 0,0,3,2,1,0,0, 1,2,0,0,1,2,0,
      0,3,1,0,2,1,0, 1,0,2,0,0,3,1, 2,0,1,0,2,1,0,
      0,0,1,2,1,0,2, 0,1,0,2,1,3,0, 1,0,2,1,0,0,2,
      0,2,1,3,0,1,0, 2,1,0,1,0,2,1, 3,0,0,2,1,0,1
    ];
    window._ghHeatmapActivity = activity;
    const tooltips = ["No activity","1-2 commits","3-4 commits","5-6 commits","7+ commits"];
    function buildHeatmapColors(accentHex) {
      return [
        "#1a1a1a",
        `color-mix(in srgb, ${accentHex} 15%, transparent)`,
        `color-mix(in srgb, ${accentHex} 40%, transparent)`,
        `color-mix(in srgb, ${accentHex} 75%, transparent)`,
        accentHex
      ];
    }
    function renderHeatmap(accentHex) {
      heatmap.innerHTML = "";
      const colors = buildHeatmapColors(accentHex);
      activity.forEach((level) => {
        const cell = document.createElement("div");
        cell.className = "gh-cell";
        cell.style.background = colors[Math.min(level, 4)];
        cell.title = tooltips[Math.min(level, 4)];
        heatmap.appendChild(cell);
      });
    }
    const initialAccent = getComputedStyle(document.documentElement).getPropertyValue('--y').trim() || '#ffe000';
    renderHeatmap(initialAccent);
    window._renderHeatmap = renderHeatmap;
  }

  /* ═══════════════════════════════════════
     PROJECT MODALS
  ═══════════════════════════════════════ */
  const projectData = {
    jarvis: {
      title: "J.A.R.V.I.S — AI Desktop Assistant",
      tags: ["Python","Electron","ChromaDB","Whisper STT","AI Agent","LLM"],
      visual: `<div style="text-align:left;font-family:monospace;font-size:13px;color:#00f7ff;line-height:2;padding:8px 0">
        <div>&gt; Initializing JARVIS core...</div>
        <div>&gt; Voice engine: Whisper STT [active]</div>
        <div>&gt; Long-term memory: ChromaDB vector DB</div>
        <div>&gt; LLM fallback chain: 9 providers</div>
        <div style="color:var(--y)">&gt; STATUS: ONLINE ✦ All systems nominal</div>
      </div>`,
      desc: "A cross-platform AI desktop voice assistant that combines the power of 9 LLM APIs with ChromaDB-powered vector memory for persistent context, offline wake-word activation, and full OS-level voice control.",
      features: [
        "Offline wake-word activation with local speech detection",
        "ChromaDB vector memory for long-term context recall",
        "Auto-fallback across 9 LLM APIs (GPT-4, Gemini, Claude, Mistral, etc.)",
        "Multi-source web search via Tavily, Brave, Serper, DuckDuckGo",
        "Full OS-level voice control — launch apps, control settings",
        "Text-to-Speech output with voice style selection",
        "Electron desktop shell for cross-platform deployment"
      ],
      github: "https://github.com/SA-Sanush/Jarvis-AI-Assistant"
    },
    portfolio: {
      title: "My Portfolio Website",
      tags: ["HTML5", "CSS3", "JavaScript", "Three.js"],
      visual: `<div style="text-align:center;padding:12px 0">
        <div style="font-size:13px;color:rgba(245,245,240,0.45);margin-bottom:12px">Interactive Chatbot Assistant</div>
        <div style="background:#111;border-radius:8px;padding:12px;font-size:12px;text-align:left;line-height:2">
          <div style="color:#27ae60">Visitor: "Hey, what are Sanush's skills?"</div>
          <div style="color:var(--y)">Chatbot: "Sanush is skilled in Front End Development, UI/UX Design, and AI &amp; Python..."</div>
          <div style="color:var(--y)">&gt; Live Status: Online and Ready ✦</div>
        </div>
      </div>`,
      desc: "A personal portfolio website built with HTML, CSS, JavaScript, and Three.js — features 3D visuals, smooth animations, and an AI-powered chatbot assistant.",
      features: [
        "Interactive 3D particle background using Three.js",
        "AI Chatbot assistant responding to visitor questions",
        "Standardized glassmorphic card design (Bento Grid)",
        "Vanilla JS mouse-tilt perspective effect on all cards",
        "Responsive timeline certifications with LinkedIn verification links"
      ],
      github: "https://github.com/SA-Sanush/My-portfolio"
    },
    daytone: {
      title: "DayTone — Mood Tracker & Analyser",
      tags: ["Flask","Python","Random Forest","VADER NLP","Scikit-learn"],
      visual: `<div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center">
        <span style="background:rgba(0,247,255,0.7);border-radius:8px;padding:8px 16px;font-size:12px;font-weight:600">😊 Productive</span>
        <span style="background:rgba(111,207,151,0.7);border-radius:8px;padding:8px 16px;font-size:12px;font-weight:600">😌 Calm</span>
        <span style="background:color-mix(in srgb, var(--y) 70%, transparent);border-radius:8px;padding:8px 16px;font-size:12px;font-weight:600">⚡ Energetic</span>
        <span style="background:rgba(255,100,100,0.7);border-radius:8px;padding:8px 16px;font-size:12px;font-weight:600">😰 Stressed</span>
        <span style="width:100%;text-align:center;color:var(--y);font-size:13px;margin-top:8px">Burnout risk: LOW — Keep it up! ✦</span>
      </div>`,
      desc: "An AI-driven wellness assistant using ensemble ML models (Random Forest, Decision Trees) and VADER sentiment analytics to track daily mental health logs, predict burnout levels, and generate actionable analytics reports.",
      features: [
        "Random Forest + Decision Tree ensemble for mood prediction",
        "VADER NLP for real-time journal sentiment analysis",
        "Burnout risk scoring with personalized recommendations",
        "Daily log tracking with trend visualization",
        "PDF/CSV report generation for mental health analytics",
        "Flask REST API backend with responsive web dashboard"
      ],
      github: "https://github.com/SA-Sanush/DayTone-Mood-Analyser"
    },
    tas: {
      title: "Talent Acquisition System",
      tags: ["Flask","spaCy NLP","SQLite","Python","PDF Parser"],
      visual: `<div style="text-align:center">
        <div style="font-size:13px;color:rgba(245,245,240,0.45);margin-bottom:12px">Resume Matching Engine</div>
        <div style="background:#111;border-radius:8px;padding:12px;font-size:12px;text-align:left;line-height:2">
          <div style="color:var(--y)">📄 resume_sanush.pdf → Parsing...</div>
          <div style="color:#27ae60">✓ Skills extracted: [Python, React, Flask, SQL]</div>
          <div style="color:#27ae60">✓ Experience: 2 years</div>
          <div style="color:var(--y)">⚡ JD Match Score: <b style="font-size:16px">92%</b></div>
        </div>
      </div>`,
      desc: "An intelligent recruitment matching dashboard that automatically parses PDF and Word resumes using spaCy NLP, extracts core tech skills, and ranks candidate compatibility scores against target job descriptions.",
      features: [
        "Automated PDF/DOCX resume parsing with PyMuPDF & docx2txt",
        "spaCy NLP for entity extraction — skills, experience, education",
        "Candidate-to-JD compatibility scoring algorithm",
        "SQLite database for candidate profile management",
        "Recruiter dashboard with ranked candidate list & filters",
        "Batch processing mode for high-volume recruitment workflows"
      ],
      github: "https://github.com/SA-Sanush/Talent-Acquisition-System"
    }
  };

  const modal = document.getElementById("project-modal");
  const modalClose = document.getElementById("modal-close");
  const curRingEl = document.getElementById("cur-ring");

  function openModal(key) {
    const data = projectData[key];
    if (!data || !modal) return;
    document.getElementById("modal-tags").innerHTML = data.tags.map(t => `<span class="p-tag">${t}</span>`).join("");
    document.getElementById("modal-title").textContent = data.title;
    document.getElementById("modal-visual").innerHTML = data.visual;
    document.getElementById("modal-desc").textContent = data.desc;
    document.getElementById("modal-features").innerHTML = data.features.map(f => `<div class="modal-feature-item">${f}</div>`).join("");
    document.getElementById("modal-links").innerHTML = `
      <a href="${data.github}" target="_blank" class="modal-link-btn primary">⟨/⟩ GitHub Repo</a>
      <a href="${data.github}" target="_blank" class="modal-link-btn secondary">View Code ↗</a>
    `;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    modal.querySelectorAll(".modal-link-btn, .modal-close").forEach(el => {
      el.addEventListener("mouseenter", () => curRingEl && curRingEl.classList.add("big"));
      el.addEventListener("mouseleave", () => curRingEl && curRingEl.classList.remove("big"));
    });

    window.lastFocusedElement = document.activeElement;
    if (window.setInertExcept) window.setInertExcept(modal);
    const closeBtn = document.getElementById("modal-close");
    if (closeBtn) setTimeout(() => closeBtn.focus(), 50);
  }

  function closeModal() {
    if (!modal || !modal.classList.contains("open")) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";

    if (window.clearInert) window.clearInert();
    if (window.lastFocusedElement) {
      window.lastFocusedElement.focus();
      window.lastFocusedElement = null;
    }
  }

  document.querySelectorAll(".explore-btn").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const key = el.dataset.modal;
      if (key && projectData[key]) openModal(key);
    });
  });

  document.querySelectorAll(".bento-card[data-modal]").forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("a, button")) return;
      const key = card.dataset.modal;
      if (key && projectData[key]) openModal(key);
    });
  });

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
})();
