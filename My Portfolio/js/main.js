/* =========================================================
   Portfolio interactions
   ---------------------------------------------------------
   - Hydrates config-driven links, document states and projects
   - Sticky navigation, mobile menu and active section tracking
   - Intersection Observer scroll reveals
   - All core content remains visible if JavaScript fails
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Stale service-worker cleanup ----------
     Live Server and Live Preview reuse localhost ports across projects. If
     another project on the same origin registered a service worker (the
     Habit-Tracker app uses /sw.js and a "chromatic" cache), it can replay its
     old pages here. Remove that known worker and cache, then reload once. */
  function clearStaleServiceWorker() {
    if (!("serviceWorker" in navigator)) return;

    const cleanupKey = "portfolio-stale-sw-cleaned";

    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        const stale = registrations.filter((registration) => {
          const worker = registration.active || registration.waiting || registration.installing;
          if (!worker || !worker.scriptURL) return false;

          try {
            return new URL(worker.scriptURL).pathname.endsWith("/sw.js");
          } catch (error) {
            return false;
          }
        });

        if (!stale.length) return;

        return Promise.all(stale.map((registration) => registration.unregister())).then(() => {
          if ("caches" in window) {
            caches
              .keys()
              .then((keys) =>
                Promise.all(
                  keys
                    .filter((key) => key.toLowerCase().startsWith("chromatic"))
                    .map((key) => caches.delete(key))
                )
              )
              .catch(() => {});
          }

          if (!sessionStorage.getItem(cleanupKey)) {
            sessionStorage.setItem(cleanupKey, "1");
            window.location.reload();
          }
        });
      })
      .catch(() => {
        // Service workers are an optional enhancement; never block the page.
      });
  }

  clearStaleServiceWorker();

  const config = window.PORTFOLIO_CONFIG || {};
  const profile = config.profile || {};
  const social = config.social || {};
  const documents = config.documents || {};
  const displayName = String(profile.name || "Niel").trim();

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  /* ---------- Small helpers ---------- */

  function createElement(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function createIcon(id, extraClass) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", extraClass ? `icon ${extraClass}` : "icon");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `#icon-${id}`);
    svg.append(use);
    return svg;
  }

  function normalizeHttpUrl(value) {
    const raw = String(value || "").trim();
    if (!raw || /[\[\]<>"']/.test(raw)) return "";

    const candidate = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`;

    try {
      const url = new URL(candidate);
      if ((url.protocol === "http:" || url.protocol === "https:") && url.hostname.includes(".")) {
        return url.href;
      }
    } catch (error) {
      // Invalid or placeholder URL — keep the safe placeholder state.
    }

    return "";
  }

  function normalizeEmail(value) {
    const raw = String(value || "").trim();
    if (!raw || /[\[\]\s]/.test(raw)) return "";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw) ? raw : "";
  }

  function setExternalLink(link, url, label) {
    link.setAttribute("href", url);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    link.removeAttribute("aria-disabled");
    link.setAttribute("title", `${label} (opens in a new tab)`);

    if (!link.querySelector("[data-new-tab-hint]")) {
      const hint = createElement("span", "sr-only", " (opens in a new tab)");
      hint.setAttribute("data-new-tab-hint", "");
      link.append(hint);
    }
  }

  /* ---------- Profile details ---------- */

  $$("[data-profile-name]").forEach((node) => {
    node.textContent = displayName;
  });

  const pageTitle = document.title;
  if (pageTitle.startsWith("Niel")) {
    document.title = pageTitle.replace(/^Niel/, displayName);
  }

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute("content", ogTitle.getAttribute("content").replace(/^Niel/, displayName));
  }

  const profilePhoto = document.getElementById("profile-photo");
  if (profilePhoto && profile.photo) {
    const photoIsPlaceholder = /placeholder/i.test(profile.photo);
    profilePhoto.alt = photoIsPlaceholder
      ? `Portrait placeholder for ${displayName}`
      : String(profile.photoAlt || `Portrait of ${displayName}`);

    if (profilePhoto.getAttribute("src") !== profile.photo) {
      profilePhoto.addEventListener(
        "error",
        function handlePhotoError() {
          profilePhoto.removeEventListener("error", handlePhotoError);
          profilePhoto.src = "assets/images/profile-placeholder.svg";
          profilePhoto.alt = `Portrait placeholder for ${displayName}`;
        },
        { once: true }
      );
      profilePhoto.src = profile.photo;
    }
  }

  /* ---------- Social links ---------- */

  const socialLinks = {
    linkedin: normalizeHttpUrl(social.linkedin),
    github: normalizeHttpUrl(social.github),
    whatsapp: normalizeHttpUrl(social.whatsapp),
  };
  const emailAddress = normalizeEmail(social.email);
  const socialLabels = { linkedin: "LinkedIn", github: "GitHub", whatsapp: "WhatsApp" };

  const contactActions = $$("[data-contact]");
  const missingContactLabels = [];

  function joinLabels(labels) {
    if (labels.length <= 1) return labels[0] || "";
    if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
    return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
  }

  contactActions.forEach((action) => {
    const key = action.getAttribute("data-contact");
    const label = socialLabels[key] || (key === "email" ? "Email" : key);

    if (key === "email") {
      if (!emailAddress) {
        missingContactLabels.push("email address");
        action.hidden = true;
        action.setAttribute("aria-disabled", "true");
        return;
      }

      action.setAttribute("href", `mailto:${emailAddress}`);
      action.setAttribute("aria-label", `Email ${emailAddress}`);
      action.setAttribute("title", `Email ${emailAddress}`);
      action.removeAttribute("aria-disabled");
      action.classList.add("is-live");
      return;
    }

    const url = socialLinks[key];
    if (!url) {
      missingContactLabels.push(label);
      action.hidden = true;
      action.setAttribute("aria-disabled", "true");
      return;
    }

    action.setAttribute("href", url);
    action.setAttribute("target", "_blank");
    action.setAttribute("rel", "noopener noreferrer");
    action.setAttribute("aria-label", `${label} (opens in a new tab)`);
    action.setAttribute(
      "title",
      key === "whatsapp" && String(social.whatsappDisplay || "").trim()
        ? `WhatsApp ${String(social.whatsappDisplay).trim()}`
        : label
    );
    action.removeAttribute("aria-disabled");
    action.classList.add("is-live");
  });

  const contactNote = $(".contact-note");
  if (contactNote) {
    const noteText = $("[data-contact-note-text]", contactNote);

    if (missingContactLabels.length === 0) {
      contactNote.hidden = true;
    } else if (noteText) {
      const verb = missingContactLabels.length === 1 ? "it has" : "they have";
      noteText.textContent = `My ${joinLabels(missingContactLabels)} will appear here once ${verb} been added.`;
      contactNote.hidden = false;
    }
  }

  const heroSocial = $("[data-hero-social]");
  if (heroSocial) {
    const heroLinks = [];

    if (socialLinks.linkedin) {
      heroLinks.push({ key: "linkedin", label: "LinkedIn", url: socialLinks.linkedin, brand: true });
    }
    if (socialLinks.github) {
      heroLinks.push({ key: "github", label: "GitHub", url: socialLinks.github, brand: true });
    }
    if (socialLinks.whatsapp) {
      heroLinks.push({ key: "whatsapp", label: "WhatsApp", url: socialLinks.whatsapp, brand: true });
    }
    if (emailAddress) {
      heroLinks.push({ key: "mail", label: "Email", url: `mailto:${emailAddress}`, email: true });
    }

    heroLinks.forEach((item) => {
      const link = createElement("a", "social-icon-link");
      link.append(createIcon(item.key, item.brand ? "icon--brand" : ""), document.createTextNode(item.label));

      if (item.email) {
        link.setAttribute("href", item.url);
        link.setAttribute("title", `Email ${displayName}`);
      } else {
        setExternalLink(link, item.url, `${item.label} profile`);
      }

      heroSocial.append(link);
    });

    heroSocial.hidden = heroLinks.length === 0;
  }

  $$("[data-footer-social]").forEach((link) => {
    const key = link.getAttribute("data-footer-social");
    const url = socialLinks[key];
    if (!url) return;

    setExternalLink(link, url, `${socialLabels[key]} profile`);
    link.setAttribute("title", `Open ${socialLabels[key]} in a new tab`);
  });

  /* ---------- Documents ---------- */

  const documentLabels = {
    cv: {
      button: "Download CV",
      title: "Curriculum Vitae",
      missing: "Not added yet",
      ready: "Available",
      readyCaption: "Ready to download",
      missingCaption: "Awaiting the original document",
    },
    samtrac: {
      button: "Download certificate",
      title: "SAMTRAC Certificate",
      missing: "Not added yet",
      ready: "Available",
      readyCaption: "Ready to download",
      missingCaption: "Awaiting the original document",
    },
  };

  function isDocumentAvailable(entry) {
    return Boolean(entry && entry.available === true && typeof entry.path === "string" && entry.path.trim());
  }

  function applyDocumentState(card, key, entry) {
    const labels = documentLabels[key];
    const button = $("[data-doc-button]", card);
    const status = $("[data-doc-status]", card);
    const caption = $("[data-doc-caption]", card);
    const buttonText = $("[data-doc-button-text]", card);
    const heading = $("h3", card);
    if (!labels || !button || !status || !caption || !buttonText) return;

    const title = heading ? heading.textContent.trim() : labels.title;

    if (isDocumentAvailable(entry)) {
      button.setAttribute("href", entry.path);
      button.setAttribute(
        "download",
        entry.fileName || entry.path.split("/").pop() || `${key}.pdf`
      );
      button.classList.remove("is-disabled");
      button.removeAttribute("aria-disabled");
      button.removeAttribute("title");
      buttonText.textContent = labels.button;
      status.textContent = labels.ready;
      status.classList.add("is-ready");
      caption.textContent = labels.readyCaption;
    } else {
      button.removeAttribute("href");
      button.removeAttribute("download");
      button.classList.add("is-disabled");
      button.setAttribute("aria-disabled", "true");
      button.setAttribute("title", `${title} has not been added yet.`);
      buttonText.textContent = "Download unavailable";
      status.textContent = labels.missing;
      status.classList.remove("is-ready");
      caption.textContent = labels.missingCaption;
    }
  }

  $$("[data-document]").forEach((card) => {
    const key = card.getAttribute("data-document");
    applyDocumentState(card, key, documents[key]);
  });

  const heroCv = $("[data-hero-cv]");
  if (heroCv) {
    const cv = documents.cv;
    const status = $("[data-cv-status]", heroCv);

    if (isDocumentAvailable(cv)) {
      heroCv.setAttribute("href", cv.path);
      heroCv.setAttribute("download", cv.fileName || cv.path.split("/").pop() || "cv.pdf");
      heroCv.classList.remove("is-disabled");
      heroCv.removeAttribute("aria-disabled");
      heroCv.removeAttribute("title");
      if (status) status.remove();
    } else {
      heroCv.removeAttribute("href");
      heroCv.removeAttribute("download");
      heroCv.classList.add("is-disabled");
      heroCv.setAttribute("aria-disabled", "true");
      heroCv.setAttribute("title", "The CV has not been added yet.");
    }
  }

  /* ---------- Projects ---------- */

  function renderProjects() {
    const grid = document.getElementById("projects-grid");
    if (!grid) return;

    const projects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];

    if (!projects.length) {
      grid.append(
        createElement(
          "p",
          "noscript-panel",
          "No projects have been added yet. Add entries in js/projects.js."
        )
      );
      return;
    }

    const allowedIcons = ["repeat", "dumbbell", "search", "code", "clipboard", "monitor"];
    const allowedTones = ["forest", "sage", "deep"];
    const fragment = document.createDocumentFragment();

    projects.forEach((project, index) => {
      const title = String(project.title || "Untitled project");
      const description = String(project.description || "");
      const tech = Array.isArray(project.tech) ? project.tech : [];
      const icon = allowedIcons.includes(project.icon) ? project.icon : "code";
      const tone = allowedTones.includes(project.tone) ? project.tone : "forest";

      const card = createElement("article", "project-card");
      card.setAttribute("data-reveal", "");

      const visual = createElement("div", `project-visual project-visual--${tone}`);
      const placeholder = createElement("div", "project-placeholder");
      const iconBox = createElement("span", "project-visual-icon");
      iconBox.append(createIcon(icon));
      placeholder.append(iconBox, createElement("span", "project-visual-label", "Preview coming soon"));
      visual.append(placeholder);

      if (typeof project.image === "string" && project.image.trim()) {
        const image = createElement("img");
        image.src = project.image;
        image.alt = String(project.imageAlt || `Screenshot of ${title}`);
        image.loading = "lazy";
        image.decoding = "async";
        image.addEventListener(
          "error",
          function handleProjectImageError() {
            image.removeEventListener("error", handleProjectImageError);
            image.classList.add("is-missing");
            visual.classList.remove("has-image");
          },
          { once: true }
        );
        visual.classList.add("has-image");
        visual.append(image);
      }

      if (project.sample !== false) {
        visual.append(createElement("span", "project-badge", "Sample entry"));
      }

      visual.append(
        createElement("span", "project-number", String(index + 1).padStart(2, "0"))
      );

      const body = createElement("div", "project-body");
      body.append(createElement("h3", "", title));
      if (description) body.append(createElement("p", "", description));

      if (tech.length) {
        const tags = createElement("ul", "project-tags");
        tags.setAttribute("aria-label", `${title} technologies`);
        tech.forEach((item) => tags.append(createElement("li", "", String(item))));
        body.append(tags);
      }

      const footer = createElement("div", "project-footer");
      const repoUrl = normalizeHttpUrl(project.repo);

      if (repoUrl) {
        const repoLink = createElement("a", "project-link");
        repoLink.href = repoUrl;
        repoLink.target = "_blank";
        repoLink.rel = "noopener noreferrer";
        repoLink.setAttribute("title", `${title} repository on GitHub (opens in a new tab)`);
        const repoScreenReader = createElement(
          "span",
          "sr-only",
          `: ${title} repository (opens in a new tab)`
        );
        repoLink.append(
          document.createTextNode("GitHub"),
          createIcon("arrow-up-right"),
          repoScreenReader
        );
        footer.append(repoLink);
      } else {
        const repoPlaceholder = createElement("span", "project-link project-link--muted");
        repoPlaceholder.append(createIcon("info"), document.createTextNode("Repository not added"));
        footer.append(repoPlaceholder);
      }

      const demoUrl = normalizeHttpUrl(project.demo);
      if (demoUrl) {
        const demoLink = createElement("a", "project-link");
        demoLink.href = demoUrl;
        demoLink.target = "_blank";
        demoLink.rel = "noopener noreferrer";
        demoLink.setAttribute("title", `${title} live demo (opens in a new tab)`);
        const demoScreenReader = createElement(
          "span",
          "sr-only",
          `: ${title} live demo (opens in a new tab)`
        );
        demoLink.append(
          document.createTextNode("Live demo"),
          createIcon("arrow-up-right"),
          demoScreenReader
        );
        footer.append(demoLink);
      }

      body.append(footer);
      card.append(visual, body);
      fragment.append(card);
    });

    grid.append(fragment);
  }

  try {
    renderProjects();
  } catch (error) {
    const grid = document.getElementById("projects-grid");
    if (grid) {
      grid.append(
        createElement(
          "p",
          "noscript-panel",
          "Projects could not be loaded. Please check js/projects.js."
        )
      );
    }
  }

  /* ---------- Year ---------- */

  $$("[data-current-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  /* ---------- Header & mobile navigation ---------- */

  const header = document.getElementById("site-header");
  const nav = document.getElementById("site-nav");
  const menuToggle = $(".menu-toggle");
  const desktopQuery = window.matchMedia("(min-width: 981px)");

  function updateHeaderState() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  function setMenu(open, returnFocus) {
    if (!nav || !menuToggle) return;

    nav.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);

    if (!open && returnFocus) menuToggle.focus();
  }

  if (nav && menuToggle) {
    menuToggle.addEventListener("click", () => {
      setMenu(menuToggle.getAttribute("aria-expanded") !== "true", false);
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenu(false, false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setMenu(false, true);
      }
    });

    document.addEventListener("click", (event) => {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || menuToggle.contains(event.target)) return;
      setMenu(false, false);
    });

    const handleDesktopChange = (event) => {
      if (event.matches) setMenu(false, false);
    };

    if (typeof desktopQuery.addEventListener === "function") {
      desktopQuery.addEventListener("change", handleDesktopChange);
    } else if (typeof desktopQuery.addListener === "function") {
      desktopQuery.addListener(handleDesktopChange);
    }
  }

  /* ---------- Active navigation section ---------- */

  const sectionElements = $$("main section[id]");
  const navLinks = $$(".nav-link");

  function setActiveSection(id) {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function updateActiveSection() {
    if (!sectionElements.length || !navLinks.length) return;

    const headerOffset = (header ? header.offsetHeight : 0) + 110;
    const marker = window.scrollY + headerOffset;
    let activeId = sectionElements[0].id;

    sectionElements.forEach((section) => {
      if (section.offsetTop <= marker) activeId = section.id;
    });

    const atPageBottom =
      Math.ceil(window.scrollY + window.innerHeight) >=
      document.documentElement.scrollHeight - 2;

    if (atPageBottom) {
      activeId = sectionElements[sectionElements.length - 1].id;
    }

    setActiveSection(activeId);
  }

  let scrollFrame = 0;
  function handleScroll() {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
      updateHeaderState();
      updateActiveSection();
      scrollFrame = 0;
    });
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleScroll, { passive: true });
  window.addEventListener("load", handleScroll);

  updateHeaderState();
  updateActiveSection();

  /* ---------- Scroll reveals ---------- */

  function initReveals() {
    const revealElements = $$("[data-reveal]");
    if (!revealElements.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const supportsObserver = "IntersectionObserver" in window;

    // Content stays fully visible if animations are reduced or unsupported.
    if (prefersReducedMotion || !supportsObserver) return;

    revealElements.forEach((element) => {
      element.classList.add("reveal-ready");

      const parent = element.parentElement;
      if (parent && parent.hasAttribute("data-stagger")) {
        const siblings = Array.from(parent.children).filter((child) =>
          child.hasAttribute("data-reveal")
        );
        const index = siblings.indexOf(element);
        const delay = Math.min(Math.max(index, 0), 6) * 70;
        element.style.setProperty("--reveal-delay", `${delay}ms`);
      }
    });

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }
    );

    revealElements.forEach((element) => observer.observe(element));
  }

  initReveals();
})();
