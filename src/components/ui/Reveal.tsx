"use client";

import { useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ENTRANCE } from "@/lib/gsap";
import { scrollState } from "@/lib/scroll-state";

type Props = {
  as?: "div" | "section" | "span" | "li" | "ul" | "p" | "figure" | "header";
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  y?: number;
  blur?: boolean;
  /** animate direct children with a stagger instead of the wrapper */
  cascade?: boolean;
  stagger?: number;
  start?: string;
  /** "scroll" (default) or "ready" (after intro) */
  trigger?: "scroll" | "ready";
};

/**
 * Twain-style entrance: opacity 0 → 1, y 24 → 0, blur 6 → 0, 1.1s power2.out.
 */
export function Reveal({
  as = "div",
  children,
  className,
  style,
  delay = 0,
  y = 24,
  blur = true,
  cascade = false,
  stagger = ENTRANCE.stagger,
  start = "top 88%",
  trigger = "scroll",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(el, { opacity: 1 });
        return;
      }
      const targets: gsap.TweenTarget = cascade ? Array.from(el.children) : el;
      if (cascade) gsap.set(el, { opacity: 1 });
      const tween = gsap.fromTo(
        targets,
        { opacity: 0, y, filter: blur ? "blur(6px)" : "blur(0px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: ENTRANCE.to.duration,
          ease: ENTRANCE.to.ease,
          delay,
          stagger: cascade ? stagger : 0,
          clearProps: "filter",
          paused: trigger === "ready" && !scrollState.ready,
          scrollTrigger: trigger === "scroll" ? { trigger: el, start, once: true } : undefined,
        },
      );
      if (trigger === "ready" && !scrollState.ready) {
        const play = () => tween.play();
        window.addEventListener("sq:ready", play, { once: true });
        return () => window.removeEventListener("sq:ready", play);
      }
    },
    { scope: ref, dependencies: [cascade, delay, trigger] },
  );

  const Tag = as as "div";
  return (
    <Tag ref={ref as RefObject<HTMLDivElement>} className={className} style={style} data-reveal="">
      {children}
    </Tag>
  );
}
