/**
 * A tiny mutable store read by the WebGL scenes inside useFrame.
 * ScrollTrigger / pointer listeners write to it; nothing re-renders.
 */
export const scrollState = {
  /** 0 at page top → 1 when hero has scrolled away */
  hero: 0,
  /** fractional active service index 0..7 */
  services: 0,
  /** 0..1 through the services pin */
  servicesProgress: 0,
  /** 0..1 progress through the CTA section */
  cta: 0,
  /** normalised pointer -1..1 */
  pointer: { x: 0, y: 0 },
  /** page scroll velocity (px/frame-ish) from Lenis */
  velocity: 0,
  /** true once the intro overlay finished */
  ready: false,
};

export type ScrollState = typeof scrollState;
