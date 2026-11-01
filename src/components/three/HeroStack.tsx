"use client";

import { Suspense, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Sparkles, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { scrollState } from "@/lib/scroll-state";
import { GlassSheet } from "./GlassSheet";
import { StudioLights } from "./Lights";

function LogoPlane() {
  const tex = useTexture("/brand/mark.png", (t) => {
    (Array.isArray(t) ? t[0] : t).colorSpace = THREE.SRGBColorSpace;
  });
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
  });
  return (
    <mesh ref={ref} position={[-0.95, -0.15, 0.06]} renderOrder={14}>
      <planeGeometry args={[1.05, 1.05]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} depthWrite={false} />
    </mesh>
  );
}

function Sheet({ i, total }: { i: number; total: number }) {
  const t = total > 1 ? i / (total - 1) : 0;
  const position: [number, number, number] = [0.35 - t * 1.1, -1.05 + t * 2.3, 1.0 - t * 4.6];
  const rotation: [number, number, number] = [-0.22 + t * 0.05, -0.38 + t * 0.12, -0.05];
  return (
    <Float speed={1.1 + t * 0.7} rotationIntensity={0.14} floatIntensity={0.4} floatingRange={[-0.07, 0.07]}>
      <group position={position} rotation={rotation}>
        <GlassSheet depth={t} highlight={i < 4}>
          {i === 0 && (
            <Suspense fallback={null}>
              <LogoPlane />
            </Suspense>
          )}
          {i === 0 && (
            <>
              <mesh position={[0.55, -0.15, 0.04]} renderOrder={14}>
                <planeGeometry args={[1.5, 0.09]} />
                <meshBasicMaterial color="#f4f3f7" transparent opacity={0.22} toneMapped={false} depthWrite={false} />
              </mesh>
              <mesh position={[0.3, -0.42, 0.04]} renderOrder={14}>
                <planeGeometry args={[1.0, 0.09]} />
                <meshBasicMaterial color="#f4f3f7" transparent opacity={0.14} toneMapped={false} depthWrite={false} />
              </mesh>
            </>
          )}
        </GlassSheet>
      </group>
    </Float>
  );
}

/**
 * The hero centrepiece: a receding stack of smoky glass sheets with pink rim light,
 * parallaxed by the pointer and swept away by scroll.
 */
export function HeroStack({ sheets = 7, sparkles = true, size = 0.84 }: { sheets?: number; sparkles?: boolean; size?: number }) {
  const group = useRef<THREE.Group>(null);
  const intro = useRef(0);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const k = Math.min(1, dt * 4);
    const p = scrollState.pointer;
    const s = scrollState.hero;
    if (scrollState.ready) intro.current += (1 - intro.current) * Math.min(1, dt * 1.6);
    const ease = intro.current * intro.current * (3 - 2 * intro.current);

    g.rotation.y += (p.x * 0.14 + s * 0.9 - g.rotation.y) * k;
    g.rotation.x += (0.08 - p.y * 0.07 + s * 0.3 - g.rotation.x) * k;
    g.position.y += (-0.3 + s * 2.6 - 0.6 * (1 - ease) - g.position.y) * k;
    g.position.z += (-s * 4 - g.position.z) * k;
    const sc = size * (0.9 + 0.1 * ease);
    g.scale.setScalar(sc);
  });

  return (
    <>
      <PerspectiveCamera makeDefault fov={30} position={[0, 0.3, 11]} />
      <StudioLights />
      <group ref={group} position={[-0.1, -0.3, 0]} scale={0.8}>
        {Array.from({ length: sheets }, (_, i) => (
          <Sheet key={i} i={i} total={sheets} />
        ))}
        {sparkles && (
          <Sparkles count={48} scale={[8, 6, 5]} size={2.6} speed={0.25} opacity={0.55} color="#ff7fab" position={[0, 0.4, -1.5]} noise={0.6} />
        )}
      </group>
    </>
  );
}
