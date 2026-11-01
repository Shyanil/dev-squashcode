"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * The hero's changing word with a paper plane that loops all the way around it.
 * Each cycle: the plane rests beside the word, takes off, dives in front of and
 * under the word, climbs up the left side, passes behind it over the top, and the
 * word melts into the next one as the plane crosses back to its perch.
 *
 * The melt is a blur cross-fade fused by an SVG alpha-threshold filter (gooey),
 * applied only mid-morph so the resting text stays crisp.
 */
export function HeroMorph({ words, layerClassName }: { words: readonly string[]; layerClassName?: string }) {
  const root = useRef<HTMLSpanElement>(null);
  const filterId = `morph-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [size, setSize] = useState({ w: 0, h: 0, em: 0 });

  // rebuild the flight path whenever the word box changes size (font load, resize)
  useEffect(() => {
    const el = root.current?.querySelector<HTMLElement>(".morph-word");
    if (!el) return;
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const em = parseFloat(getComputedStyle(el).fontSize) || 16;
        setSize((s) => (Math.abs(s.w - r.width) < 1 && Math.abs(s.h - r.height) < 1 && s.em === em ? s : { w: r.width, h: r.height, em }));
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      const { w, h, em } = size;
      if (!el || !w) return;
      const layers = gsap.utils.toArray<HTMLElement>("[data-word]", el);
      const wrap = el.querySelector<HTMLElement>(".morph-word")!;
      const plane = el.querySelector<HTMLElement>(".hm-plane")!;
      const body = el.querySelector<HTMLElement>(".hm-plane__body")!;
      const trail = el.querySelector<HTMLElement>(".hm-plane__trail")!;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // resting perch: just right of the word, slightly above its middle
      const rest = { x: w + 0.36 * em, y: h * 0.22 };
      gsap.set(plane, { x: rest.x, y: rest.y, xPercent: -50, yPercent: -50, rotation: 0, scale: 1, zIndex: 3 });
      gsap.set(layers, { opacity: 0, filter: "blur(12px)" });
      gsap.set(layers[0], { opacity: 1, filter: "blur(0px)" });
      if (reduced || layers.length < 2) return;

      // gentle hover while perched
      const bob = gsap.to(body, { y: -0.06 * em, rotation: -6, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: -1 });

      // a full loop around the word (coordinates relative to the word box)
      const path = [
        { x: rest.x, y: rest.y },
        { x: w + 0.5 * em, y: h * 0.82 }, // swoop down the right side
        { x: w * 0.55, y: h + 0.32 * em }, // dive under the word, in front
        { x: -0.42 * em, y: h * 0.62 }, // round the left side
        { x: w * 0.12, y: -0.38 * em }, // climb over the top-left
        { x: w * 0.62, y: -0.48 * em }, // cross behind, over the top
        { x: rest.x, y: rest.y }, // back to the perch
      ];

      const goo = `url(#${filterId})`;
      const tl = gsap.timeline({ repeat: -1, delay: 1.4 });
      const FLIGHT = 2.6;

      layers.forEach((layer, i) => {
        const next = layers[(i + 1) % layers.length];
        const start = `cycle${i}`;
        tl.addLabel(start, i === 0 ? 0 : "+=1.5")
          .add(() => bob.pause(), start)
          .to(body, { y: 0, rotation: 0, duration: 0.25, ease: "power2.out" }, start)
          .to(trail, { opacity: 0, duration: 0.2 }, start)
          // the flight itself
          .to(
            plane,
            {
              motionPath: { path, curviness: 1.25, autoRotate: 43 },
              duration: FLIGHT,
              ease: "power1.inOut",
            },
            start,
          )
          // depth: bigger + in front while under the word, smaller + behind it over the top
          .to(plane, { scale: 1.3, duration: FLIGHT * 0.38, ease: "sine.inOut" }, start)
          .set(plane, { zIndex: -1 }, `${start}+=${FLIGHT * 0.55}`)
          .to(plane, { scale: 0.72, duration: FLIGHT * 0.3, ease: "sine.inOut" }, `${start}+=${FLIGHT * 0.38}`)
          .to(plane, { scale: 1, duration: FLIGHT * 0.32, ease: "sine.inOut" }, `${start}+=${FLIGHT * 0.68}`)
          .set(plane, { zIndex: 3 }, `${start}+=${FLIGHT * 0.86}`)
          // the word melts into the next one as the plane passes back over it
          .set(wrap, { filter: goo }, `${start}+=${FLIGHT * 0.58}`)
          .to(layer, { opacity: 0, filter: "blur(12px)", duration: 0.85, ease: "power2.inOut" }, `${start}+=${FLIGHT * 0.58}`)
          .to(next, { opacity: 1, filter: "blur(0px)", duration: 0.85, ease: "power2.inOut" }, "<")
          .set(wrap, { filter: "none" })
          // landed: settle, show the trail, resume hovering
          .set(plane, { rotation: 0 }, `${start}+=${FLIGHT}`)
          .to(trail, { opacity: 0.55, duration: 0.4 }, `${start}+=${FLIGHT}`)
          .add(() => bob.restart(), `${start}+=${FLIGHT}`);
      });

      return () => {
        tl.kill();
        bob.kill();
      };
    },
    { scope: root, dependencies: [size.w, size.h, size.em] },
  );

  return (
    <span ref={root} className="relative inline-block">
      <span className="sr-only">{words[0]}</span>
      <span className="morph-word" aria-hidden>
        {words.map((w, i) => (
          <span key={w} data-word className={cn("morph-word__layer", layerClassName)} style={{ opacity: i === 0 ? 1 : 0 }}>
            {w}
          </span>
        ))}
      </span>

      <span aria-hidden className="hm-plane">
        <svg className="hm-plane__trail" viewBox="0 0 120 60" fill="none">
          <path d="M2 54C24 52 40 44 52 34C64 24 78 18 100 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 7" />
        </svg>
        <svg className="hm-plane__body" viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id={`${filterId}-top`} x1="6" y1="10" x2="58" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ff7aa6" />
              <stop offset="1" stopColor="#e82862" />
            </linearGradient>
            <linearGradient id={`${filterId}-under`} x1="20" y1="30" x2="40" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="#b9124f" />
              <stop offset="1" stopColor="#8b6bff" />
            </linearGradient>
          </defs>
          <path d="M58 8 6 30l18 7z" fill={`url(#${filterId}-top)`} />
          <path d="M58 8 24 37l4 19 8-12z" fill={`url(#${filterId}-under)`} />
          <path d="M58 8 36 44l14 7z" fill="#ff9dbd" />
        </svg>
      </span>

      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden focusable="false">
        <defs>
          <filter id={filterId} x="-30%" y="-100%" width="160%" height="320%">
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140" />
          </filter>
        </defs>
      </svg>
    </span>
  );
}
