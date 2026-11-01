"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, PerspectiveCamera, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { scrollState } from "@/lib/scroll-state";

/* ------------------------------------------------------------------ */
/* Intro panel scene: the three disciplines as candy-gloss objects.   */
/*  - Creativity: a glossy four-point sparkle                         */
/*  - Technology: a pearl tile with an extruded </> on its face        */
/*  - Strategy:   a target that an arrow keeps hitting                 */
/* Same material language as the hero (HeroBloom).                    */
/* ------------------------------------------------------------------ */

type Pal = { pearl: string; pink: string; pink2: string; violet: string; shadow: string; shadowOpacity: number; ambient: number };
const LIGHT: Pal = { pearl: "#ffffff", pink: "#e82862", pink2: "#ff7aa6", violet: "#8b6bff", shadow: "#c2185b", shadowOpacity: 0.3, ambient: 0.6 };
const DARK: Pal = { pearl: "#2a2233", pink: "#ff3d7f", pink2: "#ff86b0", violet: "#9d83ff", shadow: "#000000", shadowOpacity: 0.55, ambient: 0.35 };

function Studio({ ambient }: { ambient: number }) {
  return (
    <>
      <ambientLight intensity={ambient} />
      <directionalLight position={[3, 6, 6]} intensity={1.3} />
      <directionalLight position={[-5, 2, 3]} intensity={0.5} color="#ffd1e1" />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 5, 3]} scale={[8, 2, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2.2} color="#ff8fb5" position={[5, 1, 1]} scale={[3, 4, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.8} color="#a993ff" position={[-5, -1, 2]} scale={[3, 4, 1]} target={[0, 0, 0]} />
        <Lightformer form="circle" intensity={2.4} color="#ffffff" position={[0, 0, 7]} scale={3} target={[0, 0, 0]} />
      </Environment>
    </>
  );
}

function Gloss({ color, iridescence = 0 }: { color: string; iridescence?: number }) {
  return <meshPhysicalMaterial color={color} roughness={0.22} metalness={0.05} clearcoat={1} clearcoatRoughness={0.12} iridescence={iridescence} iridescenceIOR={1.3} />;
}

/** Four-point sparkle with concave sides. */
function useSparkle(outer: number, inner: number) {
  return useMemo(() => {
    const s = new THREE.Shape();
    const pts = [0, 1, 2, 3].map((i) => {
      const a = (i * Math.PI) / 2 + Math.PI / 2;
      return new THREE.Vector2(Math.cos(a) * outer, Math.sin(a) * outer);
    });
    s.moveTo(pts[0].x, pts[0].y);
    for (let i = 0; i < 4; i++) {
      const b = pts[(i + 1) % 4];
      const mid = (i * Math.PI) / 2 + Math.PI / 2 + Math.PI / 4;
      s.quadraticCurveTo(Math.cos(mid) * inner, Math.sin(mid) * inner, b.x, b.y);
    }
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.16, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 6, curveSegments: 24 });
    g.center();
    return g;
  }, [outer, inner]);
}

function Sparkle({ pal }: { pal: Pal }) {
  const big = useSparkle(0.62, 0.12);
  const small = useSparkle(0.24, 0.05);
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.9) * 0.6;
  });
  return (
    <group ref={ref}>
      <mesh geometry={big} castShadow>
        <Gloss color={pal.pink} iridescence={0.3} />
      </mesh>
      <mesh geometry={small} position={[0.6, 0.55, 0.15]} rotation={[0, 0, 0.3]}>
        <Gloss color={pal.pink2} />
      </mesh>
    </group>
  );
}

/** Pearl tile with an extruded </> that gently pulses. */
function CodeTile({ pal }: { pal: Pal }) {
  const glyph = useRef<THREE.Group>(null);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (glyph.current) glyph.current.position.z = 0.27 + Math.max(0, Math.sin(t * 1.6)) * 0.05;
  });
  const bar = (len: number) => [len, 0.13, 0.12] as [number, number, number];
  return (
    <group>
      <RoundedBox args={[2.1, 1.6, 0.36]} radius={0.16} smoothness={6} castShadow>
        <Gloss color={pal.pearl} iridescence={0.55} />
      </RoundedBox>
      <group ref={glyph} position={[0, 0, 0.27]}>
        {/* < */}
        <RoundedBox args={bar(0.42)} radius={0.05} position={[-0.52, 0.12, 0]} rotation={[0, 0, 0.72]}>
          <Gloss color={pal.pink} />
        </RoundedBox>
        <RoundedBox args={bar(0.42)} radius={0.05} position={[-0.52, -0.12, 0]} rotation={[0, 0, -0.72]}>
          <Gloss color={pal.pink} />
        </RoundedBox>
        {/* / */}
        <RoundedBox args={bar(0.72)} radius={0.05} rotation={[0, 0, 1.15]}>
          <Gloss color={pal.violet} />
        </RoundedBox>
        {/* > */}
        <RoundedBox args={bar(0.42)} radius={0.05} position={[0.52, 0.12, 0]} rotation={[0, 0, -0.72]}>
          <Gloss color={pal.pink} />
        </RoundedBox>
        <RoundedBox args={bar(0.42)} radius={0.05} position={[0.52, -0.12, 0]} rotation={[0, 0, 0.72]}>
          <Gloss color={pal.pink} />
        </RoundedBox>
      </group>
    </group>
  );
}

/** Target with an arrow that flies in and lands, on a loop. */
function Target({ pal }: { pal: Pal }) {
  const arrow = useRef<THREE.Group>(null);
  const board = useRef<THREE.Group>(null);
  useFrame((s) => {
    const c = s.clock.elapsedTime % 4.2;
    const a = arrow.current;
    if (!a || !board.current) return;
    // fly in over 0.6s, then stay; fade back out at the end of the cycle
    const k = Math.min(1, c / 0.6);
    const e = 1 - Math.pow(1 - k, 3);
    a.position.set(THREE.MathUtils.lerp(2.4, 0.42, e), THREE.MathUtils.lerp(1.4, 0.26, e), THREE.MathUtils.lerp(1.6, 0.5, e));
    a.scale.setScalar(c > 3.9 ? Math.max(0.001, 1 - (c - 3.9) / 0.3) : 1);
    // board wobbles on impact
    const hit = c - 0.6;
    board.current.rotation.y = hit > 0 ? Math.sin(hit * 18) * Math.exp(-hit * 5) * 0.25 : 0;
  });
  return (
    <group>
      <group ref={board}>
        <mesh castShadow>
          <torusGeometry args={[0.62, 0.1, 24, 64]} />
          <Gloss color={pal.pink} />
        </mesh>
        <mesh>
          <torusGeometry args={[0.34, 0.085, 24, 56]} />
          <Gloss color={pal.pearl} iridescence={0.5} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.13, 32, 32]} />
          <Gloss color={pal.pink} />
        </mesh>
      </group>
      {/* arrow points from its tail (+x,+y,+z) toward the bullseye */}
      <group ref={arrow}>
        <group rotation={[0, -0.95, 0.55]}>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0.32, 0, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.75, 16]} />
            <Gloss color={pal.violet} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.08, 0, 0]}>
            <coneGeometry args={[0.09, 0.22, 20]} />
            <Gloss color={pal.violet} />
          </mesh>
          <mesh position={[0.66, 0, 0]} rotation={[Math.PI / 4, 0, 0]}>
            <boxGeometry args={[0.18, 0.2, 0.02]} />
            <Gloss color={pal.pink2} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export function IntroTrio({ dark = false }: { dark?: boolean }) {
  const pal = dark ? DARK : LIGHT;
  const rig = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const g = rig.current;
    if (!g) return;
    const k = Math.min(1, dt * 3);
    g.rotation.y += (scrollState.pointer.x * 0.3 - g.rotation.y) * k;
    g.rotation.x += (-scrollState.pointer.y * 0.15 - g.rotation.x) * k;
  });

  return (
    <>
      <PerspectiveCamera makeDefault fov={30} position={[0, 0.15, 7.4]} />
      <Studio ambient={pal.ambient} />
      <group ref={rig}>
        <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.7}>
          <group position={[-2.05, 0.6, 0.3]} scale={0.95}>
            <Sparkle pal={pal} />
          </group>
        </Float>
        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.45}>
          <group position={[0, 0.05, 0]} rotation={[0.06, -0.22, -0.05]}>
            <CodeTile pal={pal} />
          </group>
        </Float>
        <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
          <group position={[2.1, -0.35, 0.4]} rotation={[0.05, -0.45, 0]}>
            <Target pal={pal} />
          </group>
        </Float>
      </group>
      <ContactShadows position={[0, -1.45, 0]} scale={9} blur={2.6} far={3} opacity={pal.shadowOpacity} color={pal.shadow} />
    </>
  );
}
