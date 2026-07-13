(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector(".navbar__toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (toggle && mobileMenu) {
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      mobileMenu.hidden = isOpen;
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        mobileMenu.hidden = true;
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        toggle.setAttribute("aria-expanded", "false");
        mobileMenu.hidden = true;
        toggle.focus();
      }
    });
  }

  /* ---------- Bee artwork fallback ----------
     Every bee PNG loads normally. If assets/images/<file>.png 404s, swap in
     the labeled placeholder that sits right after it instead of faking art. */
  document.querySelectorAll(".bee-media img").forEach((img) => {
    img.addEventListener("error", () => {
      img.hidden = true;
      const placeholder = img.nextElementSibling;
      if (placeholder && placeholder.classList.contains("img-placeholder")) {
        placeholder.hidden = false;
      }
    });
  });

  /* ---------- Hive trail reveal (events.html) ----------
     One orchestrated reveal down the trail, not per-element scroll effects:
     each stop settles into place as it enters the viewport, in document order. */
  const stops = document.querySelectorAll(".trail__stop");

  if (stops.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      stops.forEach((stop) => stop.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
              const stop = entry.target;
              const delay = index * 90;
              setTimeout(() => stop.classList.add("is-visible"), delay);
              observer.unobserve(stop);
            }
          });
        },
        { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
      );

      stops.forEach((stop) => observer.observe(stop));
    }
  }
})();
