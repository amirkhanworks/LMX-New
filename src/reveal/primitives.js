import { gsap, ScrollTrigger, durS, durL, stagger } from "../core/tokens.js";

function setInitial(key, el) {
  if (key === "a") gsap.set(el, { autoAlpha: 0, x: 160, rotateX: 90 });
  else if (key === "h") gsap.set(el, { autoAlpha: 0, yPercent: 50, rotateY: 90 });
  else if (key === "p") gsap.set(el, { autoAlpha: 0, yPercent: 110 });
  else if (key === "ctn") gsap.set(el, { autoAlpha: 0, y: "3.33rem" });
  else if (key === "line") gsap.set(el, { clipPath: "inset(0 0 100% 0)" });
  else if (key === "slide") gsap.set(el, { clipPath: "polygon(100% 0,100% 0,100% 100%,100% 100%)" });
}

function setFinal(key, el) {
  const vars = { autoAlpha: 1, x: 0, y: 0, xPercent: 0, yPercent: 0, rotateX: 0, rotateY: 0 };
  if (key === "line") vars.clipPath = "inset(0)";
  if (key === "slide") vars.clipPath = "polygon(0 0,100% 0,100% 100%,0 100%)";
  gsap.set(el, vars);
}

export function run(key, elements, state = "reveal", delay = 0) {
  const els = Array.from(elements || []);
  els.forEach((el, i) => {
    if (state === "initial") return setInitial(key, el);
    if (state === "final") return setFinal(key, el);

    if (state === "reveal") {
      const vars = {
        autoAlpha: 1, x: 0, y: 0, xPercent: 0, yPercent: 0,
        rotateX: 0, rotateY: 0,
        duration: durL, ease: "Out", delay: delay + i * stagger,
      };
      if (key === "line") vars.clipPath = "inset(0)";
      if (key === "slide") vars.clipPath = "polygon(0 0,100% 0,100% 100%,0 100%)";
      gsap.to(el, vars);
    }

    if (state === "hide") {
      const vars = { autoAlpha: 0, duration: durS, ease: "In" };
      if (key === "a") Object.assign(vars, { x: -160, rotateX: -90 });
      if (key === "h") Object.assign(vars, { yPercent: -50, rotateY: -90 });
      if (key === "p") vars.yPercent = -110;
      gsap.to(el, vars);
    }
  });
}

export function initReveals({ reduced }) {
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    if (el.dataset.reveal === "w") return;
    const key = el.dataset.reveal;
    if (reduced) {
      setFinal(key, el);
      return;
    }
    setInitial(key, el);
    const wrap = el.closest('[data-reveal="w"]') || el;
    ScrollTrigger.create({
      trigger: wrap,
      start: wrap.dataset.revealStart || "top 85%",
      onEnter: () => run(key, el, "reveal"),
      onLeaveBack: () => {
        if (el.classList.contains("display") || wrap !== el) run(key, el, "hide");
      },
    });
  });
}
