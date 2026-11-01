"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { scrollState } from "@/lib/scroll-state";

function markReady() {
  if (scrollState.ready) return;
  scrollState.ready = true;
  document.documentElement.dataset.ready = "1";
  window.dispatchEvent(new Event("sq:ready"));
}

const WORDS = ["Strategy", "Creativity", "Technology", "Growth"];
const COLS = 6;
const R = 64;
const CIRC = 2 * Math.PI * R;

/**
 * Brand intro (~3s):
 * 1. the swirl mark spins in out of a blur inside a glowing pink orb
 * 2. a gradient ring sweeps around it while a giant counter runs 0 → 100
 *    and the discipline words flip underneath
 * 3. at 100 the mark punches forward, then the screen opens as six shutters:
 *    the page-coloured panels lift first, revealing a pink layer that follows them up
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        el.remove();
        markReady();
        return;
      }
      const html = document.documentElement;
      html.style.overflow = "hidden";

      const count = el.querySelector<HTMLElement>(".pre-count")!;
      const ring = el.querySelector<SVGCircleElement>(".pre-ring")!;
      const words = gsap.utils.toArray<HTMLElement>(".pre-wordx", el);
      const prog = { v: 0 };

      gsap.set(words, { yPercent: 110, opacity: 0 });
      gsap.set(ring, { strokeDasharray: CIRC, strokeDashoffset: CIRC });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          html.style.overflow = "";
          el.remove();
        },
      });

      tl.fromTo(".pre-orb", { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.1, ease: "expo.out" }, 0)
        .fromTo(".pre-mark", { scale: 0.4, rotate: -220, opacity: 0, filter: "blur(14px)" }, { scale: 1, rotate: 0, opacity: 1, filter: "blur(0px)", duration: 1.1, ease: "expo.out" }, 0.05)
        .fromTo(".pre-meta", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.2)
        // progress: counter + ring
        .to(
          prog,
          {
            v: 100,
            duration: 1.9,
            ease: "power2.inOut",
            onUpdate: () => {
              count.textContent = String(Math.round(prog.v)).padStart(3, "0");
              ring.style.strokeDashoffset = String(CIRC * (1 - prog.v / 100));
            },
          },
          0.2,
        );

      // discipline words flip in sync with the count
      words.forEach((w, i) => {
        const at = 0.25 + i * 0.46;
        tl.to(w, { yPercent: 0, opacity: 1, duration: 0.32, ease: "power3.out" }, at);
        if (i < words.length - 1) tl.to(w, { yPercent: -110, opacity: 0, duration: 0.3, ease: "power3.in" }, at + 0.36);
      });

      // finale: punch, then shutters
      tl.to(".pre-mark", { scale: 1.25, duration: 0.18, ease: "power2.out" }, 2.12)
        .to(".pre-mark", { scale: 0.9, duration: 0.25, ease: "power2.in" }, 2.3)
        .to(".pre-ringwrap", { scale: 1.6, opacity: 0, duration: 0.5, ease: "power2.out" }, 2.12)
        .to(".pre-inner", { opacity: 0, scale: 0.94, filter: "blur(10px)", duration: 0.4, ease: "power2.in" }, 2.3)
        .add(markReady, 2.45)
        .set(".pre-base", { autoAlpha: 0 }, 2.45)
        .to(".pre-col-a", { yPercent: -100, duration: 0.8, ease: "expo.inOut", stagger: { each: 0.06, from: "center" } }, 2.45)
        .to(".pre-col-b", { yPercent: -100, duration: 0.8, ease: "expo.inOut", stagger: { each: 0.06, from: "center" } }, 2.6);
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className="fixed inset-0 z-[1000] overflow-hidden">
      {/* shutters: pink layer behind, page-coloured layer on top */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: COLS }, (_, i) => (
          <div key={i} className="relative h-full flex-1">
            <div className="pre-col-b absolute inset-y-0 -inset-x-px bg-gradient-to-b from-pink to-[#8b6bff]" />
            <div className="pre-col-a absolute inset-y-0 -inset-x-[2px] bg-bg" />
          </div>
        ))}
      </div>
      {/* solid cover so the shutter seams never show while loading */}
      <div className="pre-base absolute inset-0 bg-bg" />

      <div className="pre-inner absolute inset-0">
        {/* faint grid + glow */}
        <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgb(var(--fg-rgb)/0.04)_1px,transparent_1px),linear-gradient(90deg,rgb(var(--fg-rgb)/0.04)_1px,transparent_1px)] [background-size:88px_88px]" />

        <div className="absolute inset-0 grid place-items-center">
          <div className="relative grid place-items-center">
            <div className="pre-orb absolute size-[26rem] sm:size-[34rem] rounded-full bg-[radial-gradient(closest-side,rgba(232,40,98,0.32),rgba(139,107,255,0.16)_55%,transparent_75%)] blur-2xl" />
            <div className="pre-ringwrap relative grid size-52 sm:size-60 place-items-center">
              <svg viewBox="0 0 160 160" className="absolute inset-0 size-full -rotate-90">
                <defs>
                  <linearGradient id="pre-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#ff7aa6" />
                    <stop offset="0.5" stopColor="#e82862" />
                    <stop offset="1" stopColor="#8b6bff" />
                  </linearGradient>
                </defs>
                <circle cx="80" cy="80" r={R} fill="none" stroke="rgb(var(--fg-rgb) / 0.08)" strokeWidth="2" />
                <circle className="pre-ring" cx="80" cy="80" r={R} fill="none" stroke="url(#pre-grad)" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <Image src="/brand/mark.png" alt="" width={72} height={72} priority className="pre-mark size-[88px] sm:size-[104px] drop-shadow-[0_10px_24px_rgba(232,40,98,0.45)]" />
            </div>
          </div>
        </div>

        {/* bottom row: wordmark + flipping word, giant counter */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 px-5 pb-6 sm:px-10 sm:pb-8 lg:px-16 lg:pb-10">
          <div className="pre-meta flex flex-col gap-3">
            <Image src="/brand/wordmark-ink.png" alt="SquashCode" width={173} height={27} priority className="h-5 w-auto lg:h-6 dark:hidden" />
            <Image src="/brand/wordmark.png" alt="" width={173} height={27} priority className="hidden h-5 w-auto lg:h-6 dark:block" />
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3">
              <span className="size-1.5 rounded-full bg-pink" />
              <span>Building</span>
              <span className="relative inline-block h-[1.3em] w-[14ch] overflow-hidden">
                {WORDS.map((w) => (
                  <span key={w} className="pre-wordx absolute left-0 top-0 text-ink">
                    {w}
                  </span>
                ))}
              </span>
            </div>
          </div>
          <div className="pre-meta flex items-start font-display leading-[0.8] tracking-[-0.05em] text-ink">
            <span className="pre-count text-[clamp(5rem,3rem+10vw,13rem)] font-medium tabular-nums">000</span>
            <span className="mt-[0.4em] text-[clamp(1.4rem,1rem+1.5vw,2.6rem)] text-gradient font-medium">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
