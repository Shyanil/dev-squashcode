"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, PerspectiveCamera, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { scrollState } from "@/lib/scroll-state";

/* ------------------------------------------------------------------ */
/* Light-mode hero: a glossy pearl dashboard tile whose trend line    */
/* draws itself upward, a growth chart beside it, and candy-gloss shapes */
/* orbiting through the scene, grounded by a soft contact shadow.      */
/* ------------------------------------------------------------------ */

type Palette = { tile: string; sheen: string; face: string; grid: string; plinth: string; shadow: string; shadowOpacity: number; ambient: number };
const LIGHT: Palette = { tile: "#ffffff", sheen: "#ffc2d6", face: "#fff1f6", grid: "#f5c9d9", plinth: "#ffffff", shadow: "#c2185b", shadowOpacity: 0.32, ambient: 0.55 };
const DARK: Palette = { tile: "#1d1826", sheen: "#ff4d8a", face: "#170f1a", grid: "#3d1b2e", plinth: "#241d2e", shadow: "#000000", shadowOpacity: 0.6, ambient: 0.3 };

function BrightStudio({ ambient }: { ambient: number }) {
  return (
    <>
      <ambientLight intensity={ambient} />
      <directionalLight position={[3, 6, 6]} intensity={1.4} color="#ffffff" />
      <directionalLight position={[-5, 2, 3]} intensity={0.6} color="#ffd1e1" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 5, 3]} scale={[8, 2, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2.4} color="#ff8fb5" position={[5, 1, 1]} scale={[3, 4, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2} color="#a993ff" position={[-5, -1, 2]} scale={[3, 4, 1]} target={[0, 0, 0]} />
        <Lightformer form="circle" intensity={2.5} color="#ffffff" position={[0, 0, 7]} scale={3} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.2} color="#fff4f8" position={[0, 0, -6]} scale={[12, 8, 1]} target={[0, 0, 0]} />
      </Environment>
    </>
  );
}

const TREND = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(-0.8, -0.5, 0),
    new THREE.Vector3(-0.38, -0.08, 0),
    new THREE.Vector3(0.0, -0.3, 0),
    new THREE.Vector3(0.38, 0.12, 0),
    new THREE.Vector3(0.72, 0.52, 0),
  ],
  false,
  "catmullrom",
  0.2,
);
const TREND_MARKS = [0, 0.27, 0.52, 0.76];

/** Pearl dashboard tile with a glossy trend line that draws itself upward, on a loop. */
function TrendTile({ pal }: { pal: Palette }) {
  const tube = useMemo(() => new THREE.TubeGeometry(TREND, 160, 0.065, 16, false), []);
  const total = tube.index ? tube.index.count : 0;
  const head = useRef<THREE.Group>(null);
  const marks = useRef<(THREE.Mesh | null)[]>([]);
  const tmp = useMemo(() => ({ p: new THREE.Vector3(), t: new THREE.Vector3(), up: new THREE.Vector3(0, 1, 0) }), []);

  useFrame((s) => {
    // 0 → 1 draw (1.8s), hold (1.7s), quick fade-reset
    const cycle = s.clock.elapsedTime % 3.8;
    const k = Math.min(1, cycle / 1.8);
    const e = 1 - Math.pow(1 - k, 3);
    const drawn = Math.max(0.02, e);
    // round to whole triangles so the tube never shows a half-quad
    tube.setDrawRange(0, Math.floor((total * drawn) / 6) * 6);
    TREND.getPointAt(drawn, tmp.p);
    TREND.getTangentAt(drawn, tmp.t);
    if (head.current) {
      head.current.position.copy(tmp.p);
      head.current.quaternion.setFromUnitVectors(tmp.up, tmp.t.normalize());
      const fade = cycle > 3.55 ? 1 - (cycle - 3.55) / 0.25 : 1;
      head.current.scale.setScalar(fade);
    }
    marks.current.forEach((m, i) => {
      if (!m) return;
      const target = drawn >= TREND_MARKS[i] + 0.02 ? 1 : 0;
      const sc = m.scale.x + (target - m.scale.x) * 0.2;
      m.scale.setScalar(sc);
    });
  });

  const pink = <meshPhysicalMaterial color="#e82862" roughness={0.18} clearcoat={1} clearcoatRoughness={0.05} envMapIntensity={1.2} />;

  return (
    <group>
      <RoundedBox args={[2.5, 2.1, 0.5]} radius={0.42} smoothness={8}>
        <meshPhysicalMaterial
          color={pal.tile}
          roughness={0.18}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.08}
          iridescence={0.55}
          iridescenceIOR={1.35}
          sheen={0.3}
          sheenColor={pal.sheen}
          envMapIntensity={1.15}
        />
      </RoundedBox>
      {/* face: soft pink panel with faint grid */}
      <mesh position={[0, 0, 0.255]}>
        <planeGeometry args={[2.0, 1.6]} />
        <meshBasicMaterial color={pal.face} toneMapped={false} />
      </mesh>
      {[-0.45, 0, 0.45].map((y) => (
        <mesh key={y} position={[0, y, 0.258]}>
          <planeGeometry args={[1.8, 0.012]} />
          <meshBasicMaterial color={pal.grid} toneMapped={false} />
        </mesh>
      ))}
      <group position={[0, -0.02, 0.32]}>
        <mesh geometry={tube}>{pink}</mesh>
        {TREND_MARKS.map((u, i) => (
          <mesh key={u} position={TREND.getPointAt(u)} scale={0} ref={(el) => { marks.current[i] = el; }}>
            <sphereGeometry args={[0.11, 32, 32]} />
            <meshPhysicalMaterial color="#ffffff" roughness={0.15} clearcoat={1} envMapIntensity={1.2} />
          </mesh>
        ))}
        <group ref={head}>
          <mesh position={[0, 0.1, 0]}>
            <coneGeometry args={[0.17, 0.3, 32]} />
            {pink}
          </mesh>
        </group>
      </group>
    </group>
  );
}

/** Three rounded bars that breathe upward: "measurable growth". */
function GrowthBars({ pal }: { pal: Palette }) {
  const bars = useRef<(THREE.Group | null)[]>([]);
  const spec = useMemo(
    () => [
      { h: 0.7, color: "#ffc0d4", x: 0 },
      { h: 1.15, color: "#ff7aa6", x: 0.42 },
      { h: 1.7, color: "#e82862", x: 0.84 },
    ],
    [],
  );
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    bars.current.forEach((g, i) => {
      if (!g) return;
      const k = 0.82 + 0.18 * (0.5 + 0.5 * Math.sin(t * 1.6 - i * 0.7));
      g.scale.y = k;
    });
  });
  return (
    <group>
      {spec.map((b, i) => (
        <group key={i} position={[b.x, 0, 0]} ref={(el) => { bars.current[i] = el; }}>
          <RoundedBox args={[0.32, b.h, 0.32]} radius={0.12} smoothness={5} position={[0, b.h / 2, 0]}>
            <meshPhysicalMaterial color={b.color} roughness={0.22} clearcoat={1} clearcoatRoughness={0.1} envMapIntensity={1.1} />
          </RoundedBox>
        </group>
      ))}
      {/* glass plinth */}
      <RoundedBox args={[1.45, 0.12, 0.62]} radius={0.05} smoothness={4} position={[0.42, -0.06, 0]}>
        <meshPhysicalMaterial color={pal.plinth} roughness={0.15} clearcoat={1} iridescence={0.6} envMapIntensity={1.2} />
      </RoundedBox>
    </group>
  );
}

type Orb = { kind: "torus" | "sphere" | "glass" | "heart" | "ring"; r: number; speed: number; phase: number; y: number; s: number; color: string };

const ORBS: Orb[] = [
  { kind: "torus", r: 2.25, speed: 0.32, phase: 0.6, y: 1.05, s: 0.42, color: "#ff4d8a" },
  { kind: "sphere", r: 2.05, speed: 0.32, phase: 2.4, y: -0.55, s: 0.3, color: "#8b6bff" },
  { kind: "glass", r: 2.45, speed: 0.32, phase: 4.1, y: 0.25, s: 0.34, color: "#ffffff" },
  { kind: "heart", r: 2.6, speed: 0.32, phase: 5.4, y: -1.0, s: 0.3, color: "#ff5c93" },
  { kind: "ring", r: 1.9, speed: 0.32, phase: 3.3, y: 1.35, s: 0.3, color: "#b9a6ff" },
];

/** Social "like" heart: extruded from a bezier outline and centred. */
const HEART = (() => {
  const h = new THREE.Shape();
  h.moveTo(0, -0.9);
  h.bezierCurveTo(-0.2, -0.65, -1.05, -0.2, -1.05, 0.35);
  h.bezierCurveTo(-1.05, 0.85, -0.55, 1.05, -0.28, 1.0);
  h.bezierCurveTo(-0.12, 0.97, 0, 0.82, 0, 0.66);
  h.bezierCurveTo(0, 0.82, 0.12, 0.97, 0.28, 1.0);
  h.bezierCurveTo(0.55, 1.05, 1.05, 0.85, 1.05, 0.35);
  h.bezierCurveTo(1.05, -0.2, 0.2, -0.65, 0, -0.9);
  const g = new THREE.ExtrudeGeometry(h, { depth: 0.35, bevelEnabled: true, bevelThickness: 0.22, bevelSize: 0.2, bevelSegments: 10, curveSegments: 32 });
  g.center();
  return g;
})();

function Orbiter({ o }: { o: Orb }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    const g = ref.current;
    if (!g) return;
    const t = s.clock.elapsedTime;
    const a = o.phase + t * o.speed;
    g.position.set(Math.cos(a) * o.r, o.y + Math.sin(t * 0.9 + o.phase) * 0.14, Math.sin(a) * o.r * 0.55);
    g.rotation.x = t * 0.6 + o.phase;
    g.rotation.y = t * 0.4;
  });
  const glossy = <meshPhysicalMaterial color={o.color} roughness={0.2} clearcoat={1} clearcoatRoughness={0.06} envMapIntensity={1.2} />;
  return (
    <group ref={ref} scale={o.s}>
      {o.kind === "torus" && (
        <mesh>
          <torusGeometry args={[1, 0.42, 32, 72]} />
          {glossy}
        </mesh>
      )}
      {o.kind === "sphere" && (
        <mesh>
          <sphereGeometry args={[1, 48, 48]} />
          {glossy}
        </mesh>
      )}
      {o.kind === "heart" && <mesh geometry={HEART}>{glossy}</mesh>}
      {o.kind === "ring" && (
        <mesh>
          <torusGeometry args={[1, 0.14, 24, 96]} />
          {glossy}
        </mesh>
      )}
      {o.kind === "glass" && (
        <mesh>
          <sphereGeometry args={[1, 48, 48]} />
          <meshPhysicalMaterial color="#ffffff" roughness={0.12} clearcoat={1} clearcoatRoughness={0.05} iridescence={1} iridescenceIOR={1.6} envMapIntensity={1.3} />
        </mesh>
      )}
    </group>
  );
}

export function HeroBloom({ size = 0.84, dark = false }: { size?: number; dark?: boolean }) {
  const pal = dark ? DARK : LIGHT;
  const rig = useRef<THREE.Group>(null);
  const intro = useRef(0);

  useFrame((_, dt) => {
    const g = rig.current;
    if (!g) return;
    const k = Math.min(1, dt * 4);
    const p = scrollState.pointer;
    const s = scrollState.hero;
    if (scrollState.ready) intro.current += (1 - intro.current) * Math.min(1, dt * 1.5);
    const e = intro.current * intro.current * (3 - 2 * intro.current);

    g.rotation.y += (-0.32 + p.x * 0.22 + s * 1.1 + (1 - e) * -0.9 - g.rotation.y) * k;
    g.rotation.x += (0.06 - p.y * 0.1 + s * 0.25 - g.rotation.x) * k;
    g.position.y += (0.1 + s * 2.4 - (1 - e) * 0.8 - g.position.y) * k;
    g.scale.setScalar(size * (0.82 + 0.18 * e));
  });

  return (
    <>
      <PerspectiveCamera makeDefault fov={30} position={[0, 0.35, 11.5]} />
      <BrightStudio ambient={pal.ambient} />
      <group ref={rig}>
        <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.5} floatingRange={[-0.08, 0.08]}>
          <group rotation={[0.04, 0.42, -0.06]}>
            <TrendTile pal={pal} />
          </group>
        </Float>
        <group position={[1.15, -1.45, 1.0]} rotation={[0, -0.35, 0]}>
          <GrowthBars pal={pal} />
        </group>
        {ORBS.map((o, i) => (
          <Orbiter key={i} o={o} />
        ))}
        <ContactShadows position={[0, -1.95, 0]} scale={9} blur={2.6} far={4} opacity={pal.shadowOpacity} color={pal.shadow} resolution={512} frames={Infinity} />
      </group>
    </>
  );
}
