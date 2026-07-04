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
})();
