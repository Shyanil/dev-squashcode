"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion, useWebGL } from "@/lib/hooks";

const Inner = dynamic(() => import("./LocalCanvasInner").then((m) => m.LocalCanvasInner), { ssr: false });

/**
 * A self-contained canvas for 3D moments that sit inside opaque panels
 * (where the shared page canvas cannot show through). Pauses when off screen.
 */
export function LocalCanvas({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const webgl = useWebGL();
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} aria-hidden>
      {webgl && !reduced && <Inner active={inView}>{children}</Inner>}
    </div>
  );
}
