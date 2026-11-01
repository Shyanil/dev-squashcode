"use client";

import { useMemo } from "react";
import { Edges, GradientTexture, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

type Props = {
  /** 0 = front sheet, 1 = furthest back; drives blur/roughness & opacity like depth of field */
  depth?: number;
  width?: number;
  height?: number;
  highlight?: boolean;
  children?: React.ReactNode;
};

/**
 * A translucent dark-glass panel — the SquashCode take on Twain's soft stacked sheets.
 * Far sheets are rougher and dimmer, which reads as depth-of-field.
 */
export function GlassSheet({ depth = 0, width = 3.6, height = 2.2, highlight = true, children }: Props) {
  const edgeColor = useMemo(() => new THREE.Color("#ff4d8a").multiplyScalar(1 - depth * 0.55), [depth]);
  return (
    <group>
      <RoundedBox args={[width, height, 0.05]} radius={0.12} smoothness={5} renderOrder={10 - Math.round(depth * 10)}>
        <meshPhysicalMaterial
          color="#141420"
          metalness={0.05}
          roughness={0.16 + depth * 0.45}
          clearcoat={1}
          clearcoatRoughness={0.1 + depth * 0.4}
          envMapIntensity={1.9 - depth * 1.1}
          transparent
          opacity={0.78 - depth * 0.3}
          depthWrite={false}
          side={THREE.FrontSide}
        />
        <Edges threshold={40} color={edgeColor} />
      </RoundedBox>
      <mesh position={[0, 0, 0.03]} renderOrder={12}>
        <planeGeometry args={[width * 0.985, height * 0.975]} />
        <meshBasicMaterial transparent opacity={0.55 - depth * 0.35} toneMapped={false} depthWrite={false}>
          <GradientTexture stops={[0, 0.45, 1]} colors={["#ff3d7f", "#3b1030", "#0b0b14"]} size={256} />
        </meshBasicMaterial>
      </mesh>
      {highlight && (
        <mesh position={[0, height * 0.32, 0.034]} renderOrder={13}>
          <planeGeometry args={[width * 0.72, 0.07]} />
          <meshBasicMaterial color="#ff4d8a" transparent opacity={0.45 - depth * 0.35} toneMapped={false} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      )}
      {children}
    </group>
  );
}
