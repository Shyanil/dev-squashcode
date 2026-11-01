"use client";

import { useState, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor, Preload, View } from "@react-three/drei";

export function Canvas3D({ eventSource }: { eventSource: RefObject<HTMLDivElement | null> }) {
  const [dpr, setDpr] = useState<number>(() =>
    typeof window === "undefined" ? 1 : Math.min(1.5, window.devicePixelRatio || 1),
  );

  return (
    <Canvas
      eventSource={eventSource as RefObject<HTMLElement | null>}
      eventPrefix="client"
      dpr={dpr}
      flat
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", stencil: false, depth: true }}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
      className="pointer-events-none"
      aria-hidden
    >
      <PerformanceMonitor
        flipflops={2}
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(Math.min(1.75, window.devicePixelRatio || 1))}
      />
      <View.Port />
      <Preload all />
    </Canvas>
  );
}
