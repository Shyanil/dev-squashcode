"use client";

import { Suspense, type ReactNode } from "react";
import { View } from "@react-three/drei";

export function SceneView({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <View className={className}>
      <Suspense fallback={null}>{children}</Suspense>
    </View>
  );
}
