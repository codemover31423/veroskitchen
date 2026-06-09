const revealItems = document.querySelectorAll("[data-reveal]");
const siteImages = document.querySelectorAll(".photo-card img, .moment-card img");
const header = document.querySelector(".site-header");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const motionAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

siteImages.forEach((image) => {
  if (image.complete && image.naturalWidth === 0) {
    image.closest("figure")?.classList.add("is-missing");
  }

  image.addEventListener("error", () => {
    image.closest("figure")?.classList.add("is-missing");
  });
});

const updatePageChrome = () => {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? scrollTop / scrollable : 0;

  document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(4));
  header?.classList.toggle("is-scrolled", scrollTop > 18);
};

updatePageChrome();
window.addEventListener("scroll", updatePageChrome, { passive: true });
window.addEventListener("resize", updatePageChrome);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-42% 0px -48% 0px", threshold: 0 }
);

sections.forEach((section) => sectionObserver.observe(section));

if (motionAllowed && window.matchMedia("(pointer: fine)").matches) {
  const tiltCards = document.querySelectorAll(".photo-card, .moment-card");

  tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      card.style.setProperty("--rotate-y", `${(x * 5).toFixed(2)}deg`);
      card.style.setProperty("--rotate-x", `${(-y * 5).toFixed(2)}deg`);
      card.style.setProperty("--tilt-x", `${(x * 4).toFixed(2)}px`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rotate-y", "0deg");
      card.style.setProperty("--rotate-x", "0deg");
      card.style.setProperty("--tilt-x", "0px");
    });
  });
}
