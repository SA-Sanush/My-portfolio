/* ═══════════════════════════════════════════════
   COMMAND PALETTE — Standalone Module
   Guaranteed to run after DOM is ready.
   Ctrl+K / Cmd+K to open.
═══════════════════════════════════════════════ */
(function initCmdPalette() {
  "use strict";

  function setup() {
    const overlay    = document.getElementById("cmd-palette");
    const searchEl   = document.getElementById("cmd-search");
    const resultsEl  = document.getElementById("cmd-results");
    const triggerBtn = document.getElementById("cmd-trigger-btn");
    const body       = document.body;

    if (!overlay || !searchEl || !resultsEl) {
      console.warn("[CMD-PALETTE] Required DOM elements not found.", { overlay, searchEl, resultsEl });
      return;
    }

    console.log("[CMD-PALETTE] Initialised successfully.");

    /* ── Cursor helpers ── */
    function cursorState(state) {
      // state: null | 'item' | 'search'
      body.classList.remove("cmd-item-hover", "cmd-search-hover");
      if (state === "item")   body.classList.add("cmd-item-hover");
      if (state === "search") body.classList.add("cmd-search-hover");
    }

    /* ── Commands ── */
    const COMMANDS = [
      { key:"top",           title:"Home — Scroll to Top",          desc:"Navigate to the hero section",                shortcut:"H", action: () => scrollTo("hero") },
      { key:"about",         title:"About — Who I Am",              desc:"Navigate to the about me section",            shortcut:"A", action: () => scrollTo("about") },
      { key:"skills",        title:"Skills — Technical Stack",      desc:"Navigate to the skills grid",                 shortcut:"S", action: () => scrollTo("skills") },
      { key:"projects",      title:"Projects — Featured Works",     desc:"Navigate to my portfolio projects",           shortcut:"P", action: () => scrollTo("projects") },
      { key:"github",        title:"GitHub — Open Source Activity", desc:"Navigate to my contribution heatmap & repos", shortcut:"G", action: () => scrollTo("github-activity") },
      { key:"education",     title:"Education — Timeline",          desc:"Navigate to my academic history",             shortcut:"E", action: () => scrollTo("education") },
      { key:"certifications",title:"Certificates — Credentials",    desc:"Navigate to my verified licenses & certs",    shortcut:"C", action: () => scrollTo("certifications") },
      { key:"contact",       title:"Contact — Let's Talk",          desc:"Navigate to the contact form & socials",      shortcut:"M", action: () => scrollTo("contact") },
      { key:"resume",        title:"Resume — View PDF",             desc:"Open resume in a new browser tab",            shortcut:"R", action: () => { window.open("./Sanush%20Resume.pdf","_blank"); close(); } },
      { key:"chatbot",       title:"Chatbot — Open AI Assistant",   desc:"Toggle the chat assistant overlay window",    shortcut:"T", action: () => { const b = document.getElementById("chat-trigger"); if (b) b.click(); close(); } },
    ];

    let activeIdx = 0;
    let filtered  = [...COMMANDS];

    /* ── Open / Close ── */
    function open() {
      overlay.classList.add("open");
      body.classList.add("cmd-open");
      body.style.overflow = "hidden";
      searchEl.value = "";
      activeIdx = 0;
      render("");
      setTimeout(() => searchEl.focus(), 50);
    }

    function close() {
      overlay.classList.remove("open");
      body.classList.remove("cmd-open");
      body.style.overflow = "";
      cursorState(null); // reset cursor on close
    }

    /* ── Scroll helper ── */
    function scrollTo(id) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      close();
    }

    /* ── Render results ── */
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

        /* Cursor: expand ring + show SELECT on item hover */
        div.addEventListener("mouseenter", () => {
          activeIdx = idx;
          document.querySelectorAll(".cmd-item").forEach((el, i) =>
            el.classList.toggle("active", i === idx)
          );
          cursorState("item");
        });
        div.addEventListener("mouseleave", () => {
          cursorState(null);
        });

        div.addEventListener("click", cmd.action);
        resultsEl.appendChild(div);
      });

      const activeItem = resultsEl.children[activeIdx];
      if (activeItem) activeItem.scrollIntoView({ block: "nearest" });
    }

    /* ── Search input cursor state ── */
    searchEl.addEventListener("mouseenter", () => cursorState("search"));
    searchEl.addEventListener("mouseleave", () => cursorState(null));
    searchEl.addEventListener("focus",      () => cursorState("search"));
    searchEl.addEventListener("blur",       () => cursorState(null));

    /* ── Search input typing ── */
    searchEl.addEventListener("input", (e) => {
      activeIdx = 0;
      render(e.target.value);
    });

    /* ── Keyboard: Global Ctrl/Cmd+K (capture phase) ── */
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        e.stopPropagation();
        overlay.classList.contains("open") ? close() : open();
        return;
      }
      if (!overlay.classList.contains("open")) return;

      if (e.key === "Escape")    { close(); return; }
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
    }, true);

    /* ── Click backdrop to close ── */
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    /* ── Nav trigger button ── */
    if (triggerBtn) {
      const handleTrigger = (e) => {
        e.preventDefault();
        e.stopPropagation();
        open();
      };
      triggerBtn.addEventListener("click", handleTrigger);
      triggerBtn.addEventListener("touchstart", handleTrigger, { passive: false });
    }
  }

  /* Run as soon as DOM is ready */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup);
  } else {
    setup();
  }
})();
