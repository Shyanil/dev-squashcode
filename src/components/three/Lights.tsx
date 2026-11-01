"use client";

import { Environment, Lightformer } from "@react-three/drei";

/** Pink / violet studio: what gives the dark glass its rim light. */
export function StudioLights({ intensity = 1 }: { intensity?: number }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 5]} intensity={1.2 * intensity} color="#ffd9e6" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={6 * intensity} color="#ff4d8a" position={[4, 2.5, -1]} scale={[4, 1.4, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={3.5 * intensity} color="#8b6bff" position={[-5, -1.5, 2]} scale={[2.5, 3.5, 1]} target={[0, 0, 0]} />
        <Lightformer form="circle" intensity={4 * intensity} color="#ffffff" position={[0, 5, 2]} scale={2.2} target={[0, 0, 0]} />
        <Lightformer form="ring" intensity={2 * intensity} color="#e82862" position={[0, -4, 4]} scale={3.5} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.5 * intensity} color="#ffffff" position={[0, 0, -6]} scale={[10, 6, 1]} target={[0, 0, 0]} />
      </Environment>
    </>
  );
}
