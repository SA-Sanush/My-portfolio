/* ═══════════════════════════════════════════════
   COMMAND PALETTE — Standalone Module
   Guaranteed to run after DOM is ready.
   Ctrl+K / Cmd+K to open.
═══════════════════════════════════════════════ */
(function initCmdPalette() {
  "use strict";

  function setup() {
    const overlay   = document.getElementById("cmd-palette");
    const searchEl  = document.getElementById("cmd-search");
    const resultsEl = document.getElementById("cmd-results");
    const triggerBtn = document.getElementById("cmd-trigger-btn");

    if (!overlay || !searchEl || !resultsEl) {
      console.warn("[CMD-PALETTE] Required DOM elements not found.", {overlay, searchEl, resultsEl});
      return;
    }

    console.log("[CMD-PALETTE] Initialised successfully.");

    /* ── Commands ── */
    const COMMANDS = [
      { key:"top",           title:"Home — Scroll to Top",          desc:"Navigate to the hero section",                    shortcut:"H", action: () => scrollTo("hero") },
      { key:"about",         title:"About — Who I Am",              desc:"Navigate to the about me section",                shortcut:"A", action: () => scrollTo("about") },
      { key:"skills",        title:"Skills — Technical Stack",      desc:"Navigate to the skills grid",                     shortcut:"S", action: () => scrollTo("skills") },
      { key:"projects",      title:"Projects — Featured Works",     desc:"Navigate to my portfolio projects",               shortcut:"P", action: () => scrollTo("projects") },
      { key:"github",        title:"GitHub — Open Source Activity", desc:"Navigate to my contribution heatmap & repos",     shortcut:"G", action: () => scrollTo("github-activity") },
      { key:"education",     title:"Education — Timeline",          desc:"Navigate to my academic history",                 shortcut:"E", action: () => scrollTo("education") },
      { key:"certifications",title:"Certificates — Credentials",    desc:"Navigate to my verified licenses & certs",        shortcut:"C", action: () => scrollTo("certifications") },
      { key:"contact",       title:"Contact — Let's Talk",          desc:"Navigate to the contact form & socials",          shortcut:"M", action: () => scrollTo("contact") },
      { key:"resume",        title:"Resume — View PDF",             desc:"Open resume in a new browser tab",                shortcut:"R", action: () => { window.open("./Sanush%20Resume.pdf","_blank"); close(); } },
      { key:"chatbot",       title:"Chatbot — Open AI Assistant",   desc:"Toggle the chat assistant overlay window",        shortcut:"T", action: () => { const b = document.getElementById("chat-trigger"); if(b) b.click(); close(); } },
    ];

    let activeIdx = 0;
    let filtered  = [...COMMANDS];

    /* ── Helpers ── */
    function scrollTo(id) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
      close();
    }

    function open() {
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
      searchEl.value = "";
      activeIdx = 0;
      render("");
      setTimeout(() => searchEl.focus(), 50);
    }

    function close() {
      overlay.classList.remove("open");
      document.body.style.overflow = "";
    }

    function render(query) {
      resultsEl.innerHTML = "";
      filtered = COMMANDS.filter(c =>
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.desc.toLowerCase().includes(query.toLowerCase())
      );
      activeIdx = Math.max(0, Math.min(activeIdx, filtered.length - 1));

      if (filtered.length === 0) {
        resultsEl.innerHTML = `<div style="padding:16px 20px;font-size:12px;color:var(--dim);text-align:center">No commands matching "${query}"</div>`;
        return;
      }

      filtered.forEach((cmd, idx) => {
        const div = document.createElement("div");
        div.className = "cmd-item" + (idx === activeIdx ? " active" : "");
        div.innerHTML = `
          <div class="cmd-item-left">
            <div class="cmd-item-title">${cmd.title}</div>
            <div class="cmd-item-desc">${cmd.desc}</div>
          </div>
          <span class="cmd-item-shortcut">${cmd.shortcut}</span>
        `;
        div.addEventListener("click", cmd.action);
        div.addEventListener("mouseenter", () => {
          activeIdx = idx;
          document.querySelectorAll(".cmd-item").forEach((el, i) =>
            el.classList.toggle("active", i === idx)
          );
        });
        resultsEl.appendChild(div);
      });

      const activeItem = resultsEl.children[activeIdx];
      if (activeItem) activeItem.scrollIntoView({ block:"nearest" });
    }

    /* ── Keyboard: Global Ctrl/Cmd+K ── */
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        e.stopPropagation();
        overlay.classList.contains("open") ? close() : open();
        return;
      }
      if (!overlay.classList.contains("open")) return;

      if (e.key === "Escape") { close(); return; }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        activeIdx = (activeIdx + 1) % filtered.length;
        render(searchEl.value);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        activeIdx = (activeIdx - 1 + filtered.length) % filtered.length;
        render(searchEl.value);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filtered[activeIdx];
        if (cmd) cmd.action();
      }
    }, true); // ← capture phase so no other handler can block it

    /* ── Search input ── */
    searchEl.addEventListener("input", (e) => {
      activeIdx = 0;
      render(e.target.value);
    });

    /* ── Click backdrop to close ── */
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    /* ── Nav trigger button ── */
    if (triggerBtn) {
      triggerBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        open();
      });
    }
  }

  /* Run as soon as DOM is ready */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup);
  } else {
    setup(); // DOM already ready
  }
})();
