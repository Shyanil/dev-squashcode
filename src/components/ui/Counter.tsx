"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

export function Counter({ value, suffix = "", duration = 2.2 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.textContent = String(value);
        return;
      }
      const obj = { v: 0 };
      gsap.to(obj, {
        v: value,
        duration,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
        onUpdate: () => {
          el.textContent = Math.round(obj.v).toString();
        },
      });
    },
    { scope: ref },
  );

  return (
    <span className="tabular-nums">
      <span ref={ref}>0</span>
      <span className="text-pink-2">{suffix}</span>
    </span>
  );
}
