import { gsap, MQ } from "../core/tokens.js";

const CFG = {
  img: { from: { yPercent: -10 }, to: { yPercent: 10 } },
  "img-in": { from: { yPercent: -20 }, to: { yPercent: 0 } },
  "img-out": { from: { yPercent: 0 }, to: { yPercent: 20 } },
};

export function initParallax({ reduced }) {
  if (reduced) return;
  gsap.matchMedia().add({ desk: MQ.desk, mob: MQ.mob }, () => {
    document.querySelectorAll('[data-parallax]:not([data-parallax="w"])').forEach((el) => {
      const c = CFG[el.dataset.parallax];
      if (!c) return;
      gsap.fromTo(el, { ...c.from, z: 10 }, {
        ...c.to, z: 10, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.5 },
      });
    });
  });
}
