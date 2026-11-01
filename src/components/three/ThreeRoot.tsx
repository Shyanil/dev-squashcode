"use client";

import dynamic from "next/dynamic";
import { useRef, type ReactNode } from "react";
import { useWebGL, useReducedMotion } from "@/lib/hooks";

const Canvas3D = dynamic(() => import("./Canvas3D").then((m) => m.Canvas3D), { ssr: false });

/**
 * One shared WebGL context for the whole page. Each 3D moment on the page is a
 * drei <View> that renders into its own DOM box through this single canvas.
 */
export function ThreeRoot({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const webgl = useWebGL();
  const reduced = useReducedMotion();

  return (
    <div ref={ref} className="relative">
      {webgl && !reduced && <Canvas3D eventSource={ref} />}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
