"use client";

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode, type RefObject } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollState } from "@/lib/scroll-state";

type LenisRef = RefObject<Lenis | null>;
const LenisContext = createContext<LenisRef | null>(null);

const HEADER_OFFSET = -88;

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("js");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) html.classList.add("motion-off");

    // pointer for 3D parallax (normalised -1..1)
    const onPointer = (e: PointerEvent) => {
      scrollState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    // refresh ScrollTrigger when fonts are in so pinned sections measure correctly
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    if (reduced) {
      return () => window.removeEventListener("pointermove", onPointer);
    }

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      anchors: false,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", (e: { velocity: number }) => {
      scrollState.velocity = e.velocity;
      ScrollTrigger.update();
    });
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
}

export function useLenis(): LenisRef | null {
  return useContext(LenisContext);
}

/** Smoothly scroll to a hash/element, falling back to native scrolling when Lenis is off. */
export function useScrollTo() {
  const ref = useLenis();
  return useCallback(
    (target: string | HTMLElement, offset: number = HEADER_OFFSET) => {
      const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
      if (!el) return;
      const lenis = ref?.current;
      if (lenis) {
        lenis.scrollTo(el, { offset, duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
      } else {
        const top = el.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    },
    [ref],
  );
}
