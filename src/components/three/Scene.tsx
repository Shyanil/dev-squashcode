"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const SceneView = dynamic(() => import("./SceneView").then((m) => m.SceneView), { ssr: false });

/**
 * A DOM box that the shared canvas renders into. Content is only drawn while on screen.
 * Loaded after hydration so three.js never blocks the first paint.
 */
export function Scene({ children, className, label }: { children: ReactNode; className?: string; label?: string }) {
  return (
    <SceneView className={cn("block", className)}>
      {label ? <group name={label}>{children}</group> : children}
    </SceneView>
  );
}
