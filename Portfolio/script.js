/* =========================================================
   SIH PORTFOLIO — INTERACTIONS
   Mobile navigation, scroll reveals, active section, footer year
   ========================================================= */

(() => {
  "use strict";

  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const siteHeader = document.querySelector(".site-header");
  const scrollProgress = document.querySelector(".scroll-progress");
  const navItems = navLinks ? navLinks.querySelectorAll('a[href^="#"]') : [];

  const revealItems = document.querySelectorAll(".reveal");
  const yearElement = document.querySelector("#current-year");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Automatically update the copyright year.
  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }

  // Keep the sticky navigation tactile and show reading progress.
  let scrollFrame = 0;
  const updateScrollState = () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;

      if (siteHeader) siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
      if (scrollProgress) scrollProgress.style.width = `${Math.min(progress, 1) * 100}%`;
      document.documentElement.style.setProperty(
        "--gold-drift",
        `${window.scrollY * -0.075}px`,
      );
    });
  };

  window.addEventListener("scroll", updateScrollState, { passive: true });
  window.addEventListener("resize", updateScrollState, { passive: true });
  updateScrollState();

  // ========================================
  // MOBILE NAVIGATION
  // ========================================

  const closeMenu = () => {
    if (!menuToggle || !navLinks) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    navLinks.classList.remove("open");
    document.body.classList.remove("menu-open");
  };

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isOpen));

      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Open navigation menu" : "Close navigation menu",
      );

      navLinks.classList.toggle("open", !isOpen);

      document.body.classList.toggle("menu-open", !isOpen);
    });

    // Close the menu after clicking a navigation link.
    navItems.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close the menu using the Escape key.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        const wasOpen = menuToggle.getAttribute("aria-expanded") === "true";

        closeMenu();

        if (wasOpen) {
          menuToggle.focus();
        }
      }
    });

    // Close the menu when clicking outside it.
    document.addEventListener("click", (event) => {
      if (
        navLinks.classList.contains("open") &&
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    // Reset mobile navigation when returning to desktop width.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }

  // ========================================
  // SCROLL REVEAL ANIMATIONS
  // ========================================

  // Respect reduced-motion preferences and support browsers
  // without IntersectionObserver.
  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");

            // Animate an element only once.
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -28px 0px",
      },
    );

    revealItems.forEach((item, index) => {
      // Add a subtle stagger to nearby elements.
      item.style.transitionDelay = `${Math.min(index % 4, 3) * 65}ms`;

      revealObserver.observe(item);
    });
  } else {
    // Keep all content visible if animations are unavailable
    // or the visitor prefers reduced motion.
    revealItems.forEach((item) => {
      item.classList.add("is-visible");
    });
  }

  // ========================================
  // ACTIVE NAVIGATION SECTION
  // ========================================

  const sections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window && sections.length && navItems.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const activeHref = `#${entry.target.id}`;

          navItems.forEach((link) => {
            if (link.getAttribute("href") === activeHref) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      {
        rootMargin: "-30% 0px -60% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }
})();
