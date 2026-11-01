"use client";

import { useRef, type ReactNode, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { scrollState } from "@/lib/scroll-state";
import { cn } from "@/lib/utils";

type Props = {
  as?: "h1" | "h2" | "h3" | "p" | "div";
  children: ReactNode;
  className?: string;
  /** "scroll" = play when scrolled into view, "ready" = play once the intro is done */
  start?: "scroll" | "ready";
  delay?: number;
  stagger?: number;
  id?: string;
};

/**
 * Line-masked split reveal (SplitText 3.13+ autoSplit handles font loading & resize).
 */
export function SplitHeading({ as = "h2", children, className, start = "scroll", delay = 0, stagger = 0.09, id }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(el, { opacity: 1 });
        return;
      }
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit: (self) => {
          gsap.set(el, { opacity: 1 });
          const tween = gsap.from(self.lines, {
            yPercent: 115,
            rotate: 1.5,
            transformOrigin: "0% 100%",
            duration: 1.4,
            ease: "expo.out",
            stagger,
            delay,
            paused: start === "ready" && !scrollState.ready,
            scrollTrigger:
              start === "scroll"
                ? { trigger: el, start: "top 88%", once: true }
                : undefined,
          });
          if (start === "ready" && !scrollState.ready) {
            window.addEventListener("sq:ready", () => tween.play(), { once: true });
          }
          return tween;
        },
      });
      return () => split.revert();
    },
    { scope: ref, dependencies: [start, delay, stagger] },
  );

  const Tag = as as "div";
  return (
    <Tag ref={ref as RefObject<HTMLDivElement>} id={id} className={cn(className, "opacity-0")}>
      {children}
    </Tag>
  );
}
