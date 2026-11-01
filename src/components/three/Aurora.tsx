"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scroll-state";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uPointer;
  uniform float uLight;
  varying vec2 vUv;

  // 2D simplex noise (Ashima / Ian McEwan)
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * snoise(p); p = p * 2.03 + 11.7; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.06;
    vec2 q = uv * vec2(1.6, 1.0);
    float n1 = fbm(q * 1.4 + vec2(t, -t * 0.7) + uPointer * 0.08);
    float n2 = fbm(q * 2.6 - vec2(t * 0.8, t * 0.5) + n1 * 0.6);

    // base follows the site theme: near-black in dark mode, white in light mode
    vec3 base   = mix(vec3(0.027, 0.027, 0.043), vec3(1.0, 1.0, 1.0), uLight);
    vec3 pink   = vec3(0.910, 0.157, 0.384);
    vec3 violet = vec3(0.431, 0.357, 1.000);
    vec3 hot    = vec3(1.000, 0.302, 0.541);

    float band = smoothstep(0.15, 0.85, n1 * 0.6 + 0.5 + (uv.y - 0.55) * 0.9 + uScroll * 0.25);
    float wisp = smoothstep(0.45, 0.95, n2 * 0.5 + 0.5);

    vec3 col = mix(base, pink, band * 0.48);
    col = mix(col, violet, wisp * 0.34 * band);
    col += hot * pow(max(n2, 0.0), 3.0) * 0.22 * band;

    float vig = 1.0 - smoothstep(0.35, 1.05, length((uv - 0.5) * vec2(1.25, 1.6)));
    col = mix(base, col, vig);

    // subtle grain
    float g = fract(sin(dot(uv * 900.0 + uTime, vec2(12.9898, 78.233))) * 43758.5453);
    col += (g - 0.5) * mix(0.025, 0.012, uLight);

    gl_FragColor = vec4(col, 1.0);
  }
`;

/** Fluid aurora background for the final CTA — a single fullscreen quad, 4-octave noise. */
export function Aurora() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uScroll: { value: 0 }, uPointer: { value: new THREE.Vector2() }, uLight: { value: 1 } }),
    [],
  );
  useFrame((state) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    const light = document.documentElement.dataset.theme === "dark" ? 0 : 1;
    mat.current.uniforms.uLight.value += (light - mat.current.uniforms.uLight.value) * 0.1;
    mat.current.uniforms.uScroll.value += (scrollState.cta - mat.current.uniforms.uScroll.value) * 0.08;
    const p = mat.current.uniforms.uPointer.value as THREE.Vector2;
    p.lerp(new THREE.Vector2(scrollState.pointer.x, scrollState.pointer.y), 0.05);
  });
  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} depthWrite={false} />
    </mesh>
  );
}
