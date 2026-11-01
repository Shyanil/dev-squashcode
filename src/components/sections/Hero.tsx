"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollState } from "@/lib/scroll-state";
import { hero, site } from "@/lib/content";
import { useDarkTheme, useIsLarge } from "@/lib/hooks";
import { HeroLeadForm } from "@/components/ui/HeroLeadForm";
import { HeroMorph } from "@/components/ui/HeroMorph";
import { Reveal } from "@/components/ui/Reveal";
import { Scene } from "@/components/three/Scene";

const HeroBloom = dynamic(() => import("@/components/three/HeroBloom").then((m) => m.HeroBloom), { ssr: false });

/** Google "G" mark (brand colours). */
function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const large = useIsLarge();
  const dark = useDarkTheme();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          scrollState.hero = self.progress;
        },
      });
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.to(".hero-copy", {
          yPercent: -14,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
      }
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const play = () => {
        gsap.fromTo(stage.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.6, ease: "power2.out", delay: 0.1 });
        // Twain-style headline entrance: each line rises out of a blur
        const lines = root.current ? Array.from(root.current.querySelectorAll<HTMLElement>(".hero-line")) : [];
        if (!lines.length) return;
        if (reduced) gsap.set(lines, { opacity: 1 });
        else
          gsap.fromTo(
            lines,
            { opacity: 0, y: 34, filter: "blur(10px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1, ease: "power3.out", stagger: 0.14, delay: 0.05, clearProps: "filter" },
          );
      };
      if (scrollState.ready) play();
      else window.addEventListener("sq:ready", play, { once: true });
    },
    { scope: root },
  );

  return (
    <section id="home" ref={root} className="relative flex flex-col justify-center overflow-x-clip pt-28 pb-4 lg:min-h-[640px] lg:pt-28 lg:pb-2">
      {/* ambient light */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-[-12%] top-[-8%] size-[70vh] rounded-full bg-[radial-gradient(closest-side,rgba(232,40,98,0.30),transparent_72%)] blur-3xl" />
        <div className="absolute bottom-[-25%] left-[-15%] size-[65vh] rounded-full bg-[radial-gradient(closest-side,rgba(110,91,255,0.20),transparent_72%)] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgb(var(--fg-rgb)/.5)_1px,transparent_1px),linear-gradient(90deg,rgb(var(--fg-rgb)/.5)_1px,transparent_1px)] [background-size:88px_88px] [mask-image:radial-gradient(ellipse_at_60%_40%,black_20%,transparent_70%)]" />
      </div>

      <div className="container-x grid items-center gap-10 lg:grid-cols-12 lg:gap-4">
        <div className="hero-copy relative z-10 lg:col-span-7">
          <h1 className="hero-headline">
            <span className="hero-line block whitespace-nowrap">{hero.headline[0]}</span>
            <span className="hero-line relative block w-fit whitespace-nowrap">
              {hero.headline[1]} <HeroMorph words={hero.morph} layerClassName="text-gradient" />
            </span>
          </h1>
          <Reveal trigger="ready" delay={0.6} className="mt-10 lg:mt-12">
            <HeroLeadForm className="max-w-[32rem]" />
          </Reveal>
          <Reveal trigger="ready" delay={0.9} className="mt-7 flex flex-wrap items-center gap-2.5">
            <a href={site.googlePartner} target="_blank" rel="noopener noreferrer" className="hero-pill group" data-cursor="link">
              <GoogleG className="size-[18px]" />
              <span className="font-medium text-ink">Google Partner</span>
              <svg viewBox="0 0 20 20" className="size-4 text-[#1a73e8]" aria-hidden>
                <path fill="currentColor" d="M10 1.5 12.2 3l2.6-.1.8 2.5 2.1 1.6-.9 2.5.9 2.5-2.1 1.6-.8 2.5-2.6-.1L10 18.5 7.8 17l-2.6.1-.8-2.5-2.1-1.6.9-2.5-.9-2.5 2.1-1.6.8-2.5 2.6.1z" />
                <path d="m6.8 10.2 2.2 2.1 4.3-4.6" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <span className="hero-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-[18px] text-pink-2" aria-hidden>
                <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
                <circle cx="12" cy="10" r="2.4" />
              </svg>
              <span><span className="font-medium text-ink">Kolkata, India</span> · Working worldwide</span>
            </span>
          </Reveal>
        </div>

        <div ref={stage} className="relative -mt-4 h-[34vh] min-h-[250px] opacity-0 lg:mt-0 lg:col-span-5 lg:h-[64vh] lg:max-h-[620px]">
          <div aria-hidden className="absolute left-1/2 top-1/2 size-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(232,40,98,0.22),transparent)] blur-2xl" />
          <Scene className="absolute inset-y-0 left-0 right-0 lg:-right-[22%] lg:left-[-12%]">
            <HeroBloom size={large ? 1 : 0.72} dark={dark} />
          </Scene>
        </div>
      </div>

    </section>
  );
}
