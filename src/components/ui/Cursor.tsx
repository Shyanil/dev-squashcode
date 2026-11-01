"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsDesktop } from "@/lib/hooks";

/** Twain-style cursor: a ring that follows with lag, a dot, and a "View" tooltip over project cards. */
export function Cursor() {
  const desktop = useIsDesktop();
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!desktop || !ring.current || !dot.current || !label.current) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");

    gsap.set([ring.current, dot.current, label.current], { xPercent: -50, yPercent: -50, opacity: 0 });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.42, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.42, ease: "power3" });
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
    const lx = gsap.quickTo(label.current, "x", { duration: 0.3, ease: "power3" });
    const ly = gsap.quickTo(label.current, "y", { duration: 0.3, ease: "power3" });

    let shown = false;
    const onMove = (e: PointerEvent) => {
      rx(e.clientX);
      ry(e.clientY);
      dx(e.clientX);
      dy(e.clientY);
      lx(e.clientX + 18);
      ly(e.clientY + 18);
      if (!shown) {
        shown = true;
        gsap.to([ring.current, dot.current], { opacity: 1, duration: 0.3 });
      }
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const el = t?.closest<HTMLElement>("[data-cursor], a, button, [role=button]");
      const mode = el?.dataset.cursor ?? (el ? "link" : "default");
      if (mode === "view") {
        gsap.to(ring.current, { scale: 0.4, opacity: 0, duration: 0.3 });
        gsap.to(label.current, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.6)" });
      } else if (mode === "link") {
        gsap.to(ring.current, { scale: 1.8, opacity: 0.9, duration: 0.35, ease: "power3.out" });
        gsap.to(label.current, { opacity: 0, scale: 0.6, duration: 0.25 });
      } else if (mode === "hide") {
        gsap.to([ring.current, dot.current], { opacity: 0, duration: 0.25 });
      } else {
        gsap.to(ring.current, { scale: 1, opacity: 1, duration: 0.35, ease: "power3.out" });
        gsap.to(dot.current, { opacity: 1, duration: 0.25 });
        gsap.to(label.current, { opacity: 0, scale: 0.6, duration: 0.25 });
      }
    };
    const onLeave = () => {
      shown = false;
      gsap.to([ring.current, dot.current, label.current], { opacity: 0, duration: 0.3 });
    };
    const onDown = () => gsap.to(ring.current, { scale: 0.8, duration: 0.15 });
    const onUp = () => gsap.to(ring.current, { scale: 1, duration: 0.3, ease: "back.out(2)" });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [desktop]);

  if (!desktop) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[999]">
      <div ref={ring} className="absolute left-0 top-0 size-9 rounded-full border-[1.5px] border-pink/70 will-change-transform dark:border dark:border-white/70 dark:mix-blend-difference" />
      <div ref={dot} className="absolute left-0 top-0 size-1.5 rounded-full bg-pink will-change-transform dark:bg-white dark:mix-blend-difference" />
      <div
        ref={label}
        className="absolute left-0 top-0 rounded-full bg-pink px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white will-change-transform"
      >
        View
      </div>
    </div>
  );
}
