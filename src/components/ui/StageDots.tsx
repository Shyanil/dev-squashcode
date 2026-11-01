"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { sections } from "@/lib/content";
import { useScrollTo } from "@/components/providers/SmoothScroll";
import { useIsLarge } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/** Twain's landing-stage-dots: a section progress rail on desktop. */
export function StageDots() {
  const large = useIsLarge();
  const scrollTo = useScrollTo();
  const [active, setActive] = useState("home");
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!large) return;
      const triggers = sections.map((s) =>
        ScrollTrigger.create({
          trigger: `#${s.id}`,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: (self) => {
            if (self.isActive) setActive(s.id);
          },
        }),
      );
      return () => triggers.forEach((t) => t.kill());
    },
    { dependencies: [large] },
  );

  useEffect(() => {
    if (!root.current) return;
    const el = root.current;
    const show = () => gsap.to(el, { opacity: 1, x: 0, duration: 1, ease: "power3.out", delay: 0.4 });
    if (document.documentElement.dataset.ready === "1") show();
    else window.addEventListener("sq:ready", show, { once: true });
    return () => window.removeEventListener("sq:ready", show);
  }, []);

  if (!large) return null;

  return (
    <nav
      ref={root}
      aria-label="Page sections"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 translate-x-3 flex-col items-end gap-2.5 opacity-0 mix-blend-difference lg:flex"
    >
      {sections.map((s) => {
        const on = active === s.id;
        return (
          <button
            key={s.id}
            type="button"
            aria-label={`Go to ${s.label}`}
            aria-current={on ? "true" : undefined}
            onClick={() => scrollTo(`#${s.id}`)}
            className="group flex items-center gap-3 py-0.5"
          >
            <span
              className={cn(
                "font-mono text-[10px] uppercase tracking-[0.2em] text-fg transition-all duration-300",
                on ? "translate-x-0 opacity-80" : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-60",
              )}
            >
              {s.label}
            </span>
            <span
              className={cn(
                "block rounded-full bg-fg transition-all duration-400 ease-out-expo",
                on ? "h-5 w-[3px]" : "h-[3px] w-[3px] opacity-50 group-hover:opacity-100",
              )}
            />
          </button>
        );
      })}
    </nav>
  );
}
