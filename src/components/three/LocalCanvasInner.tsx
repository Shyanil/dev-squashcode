"use client";

import { Suspense, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";

export function LocalCanvasInner({ children, active }: { children: ReactNode; active: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      flat
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", stencil: false }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  );
}
