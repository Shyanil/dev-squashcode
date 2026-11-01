"use client";

import { Suspense, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { scrollState } from "@/lib/scroll-state";
import { GlassSheet } from "./GlassSheet";
import { StudioLights } from "./Lights";

function Mark() {
  const tex = useTexture("/brand/mark.png", (t) => {
    (Array.isArray(t) ? t[0] : t).colorSpace = THREE.SRGBColorSpace;
  });
  return (
    <mesh position={[0, 0, 0.06]} renderOrder={14}>
      <planeGeometry args={[1.6, 1.6]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} depthWrite={false} />
    </mesh>
  );
}

/** Secondary 3D moment (Intro): the SquashCode mark set into a floating glass card. */
export function LogoSheet() {
  const group = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const k = Math.min(1, dt * 3);
    g.rotation.y += (scrollState.pointer.x * 0.35 + Math.sin(state.clock.elapsedTime * 0.3) * 0.18 - g.rotation.y) * k;
    g.rotation.x += (-scrollState.pointer.y * 0.2 - g.rotation.x) * k;
  });
  return (
    <>
      <PerspectiveCamera makeDefault fov={32} position={[0, 0, 8]} />
      <StudioLights intensity={1.1} />
      <group ref={group}>
        <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
          <group rotation={[0.08, -0.25, -0.04]}>
            <GlassSheet width={2.6} height={2.6} highlight={false}>
              <Suspense fallback={null}>
                <Mark />
              </Suspense>
            </GlassSheet>
          </group>
        </Float>
        <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.8}>
          <group position={[-1.6, -1.2, -1.4]} rotation={[0.3, 0.4, 0.2]}>
            <GlassSheet width={1.3} height={0.9} depth={0.55} highlight={false} />
          </group>
        </Float>
        <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.7}>
          <group position={[1.7, 1.2, -1.8]} rotation={[-0.2, -0.5, 0.1]}>
            <GlassSheet width={1.1} height={1.1} depth={0.7} highlight={false} />
          </group>
        </Float>
      </group>
    </>
  );
}
