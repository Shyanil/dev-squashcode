"use client";

import { Suspense, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import * as THREE from "three";
import { scrollState } from "@/lib/scroll-state";
import { services } from "@/lib/content";
import { StudioLights } from "./Lights";

const COUNT = services.length;
const RADIUS = 2.35;

function circularDistance(a: number, b: number, n: number) {
  const d = Math.abs(((a - b) % n) + n) % n;
  return Math.min(d, n - d);
}

function Disc({ index, hue, label, autoplay }: { index: number; hue: number; label: string; autoplay: boolean }) {
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const glow = useRef<THREE.MeshBasicMaterial>(null);
  const color = useMemo(() => new THREE.Color().setHSL(hue / 360, 0.85, 0.62), [hue]);
  const angle = (index / COUNT) * Math.PI * 2;

  useFrame((state, dt) => {
    const g = group.current;
    if (!g || !mat.current || !glow.current) return;
    const idx = autoplay ? (state.clock.elapsedTime * 0.35) % COUNT : scrollState.services;
    const w = Math.max(0, 1 - circularDistance(idx, index, COUNT));
    const k = Math.min(1, dt * 6);
    mat.current.emissiveIntensity += (0.18 + w * 1.4 - mat.current.emissiveIntensity) * k;
    glow.current.opacity += (0.05 + w * 0.45 - glow.current.opacity) * k;
    const sc = 1 + w * 0.4;
    g.scale.x += (sc - g.scale.x) * k;
    g.scale.y = g.scale.z = g.scale.x;
  });

  return (
    <Billboard position={[Math.sin(angle) * RADIUS, 0, Math.cos(angle) * RADIUS]}>
      <group ref={group}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.09, 56]} />
          <meshStandardMaterial ref={mat} color="#16161f" metalness={0.75} roughness={0.3} emissive={color} emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0, 0, -0.08]}>
          <circleGeometry args={[0.72, 48]} />
          <meshBasicMaterial ref={glow} color={color} transparent opacity={0.08} toneMapped={false} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <Text
          position={[0, 0.01, 0.06]}
          font="/fonts/ClashDisplay-Semibold.ttf"
          fontSize={0.34}
          color="#f4f3f7"
          anchorX="center"
          anchorY="middle"
          letterSpacing={-0.02}
        >
          {label}
        </Text>
      </group>
    </Billboard>
  );
}

/**
 * Twain's "deep research" turntable, re-cut for SquashCode: eight service discs on a tilted orbit.
 * Scrolling through the services section rotates the ring so the active service comes to the front.
 */
export function ServicesOrbit({ autoplay = false }: { autoplay?: boolean }) {
  const ring = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    if (!ring.current || !tilt.current) return;
    const idx = autoplay ? (state.clock.elapsedTime * 0.35) % COUNT : scrollState.services;
    const target = -(idx / COUNT) * Math.PI * 2;
    const k = Math.min(1, dt * 5);
    // shortest-path lerp around the circle
    let diff = target - ring.current.rotation.y;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    ring.current.rotation.y += diff * k;
    tilt.current.rotation.x += (0.62 - scrollState.pointer.y * 0.1 - tilt.current.rotation.x) * k;
    tilt.current.rotation.z += (scrollState.pointer.x * 0.08 - tilt.current.rotation.z) * k;
  });

  return (
    <>
      <StudioLights intensity={0.9} />
      <group ref={tilt} rotation={[0.62, 0, 0]} position={[0, 0.1, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[RADIUS, 0.006, 8, 180]} />
          <meshBasicMaterial color="#ff4d8a" transparent opacity={0.4} toneMapped={false} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[RADIUS * 1.35, 0.003, 8, 180]} />
          <meshBasicMaterial color="#8b6bff" transparent opacity={0.18} toneMapped={false} />
        </mesh>
        <group ref={ring}>
          <Suspense fallback={null}>
            {services.map((s, i) => (
              <Disc key={s.id} index={i} hue={s.hue} label={s.index} autoplay={autoplay} />
            ))}
          </Suspense>
        </group>
      </group>
    </>
  );
}
