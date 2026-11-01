import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin, DrawSVGPlugin, ScrollToPlugin);
  gsap.defaults({ ease: "power2.out", duration: 1.1 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** Twain-style easing vocabulary */
export const EASE = {
  out: "power2.out",
  outCubic: "power3.out",
  expo: "expo.out",
  back: "back.out(1.5)",
  inOut: "power3.inOut",
} as const;

/** Twain-style entrance: blur + rise, 1.1s, 0.16s stagger */
export const ENTRANCE = {
  from: { opacity: 0, y: 24, filter: "blur(6px)" },
  to: { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1, ease: "power2.out" },
  stagger: 0.16,
} as const;

export { gsap, ScrollTrigger, SplitText, MotionPathPlugin, DrawSVGPlugin, ScrollToPlugin };
