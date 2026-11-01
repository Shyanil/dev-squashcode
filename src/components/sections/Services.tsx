"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollState } from "@/lib/scroll-state";
import { services } from "@/lib/content";
import { useIsLarge } from "@/lib/hooks";
import { useLenis } from "@/components/providers/SmoothScroll";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { glyphs, Plus } from "@/components/ui/Icons";
import { Scene } from "@/components/three/Scene";
import { cn } from "@/lib/utils";

const ServicesOrbit = dynamic(() => import("@/components/three/ServicesOrbit").then((m) => m.ServicesOrbit), { ssr: false });

const COUNT = services.length;

function ServiceCard({ index }: { index: number }) {
  const s = services[index];
  const Glyph = glyphs[s.id as keyof typeof glyphs];
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.fromTo(
        ref.current.children,
        { opacity: 0, y: 18, filter: "blur(4px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, stagger: 0.06, ease: "power3.out", clearProps: "filter" },
      );
    },
    { scope: ref, dependencies: [index] },
  );

  return (
    <div ref={ref} className="glass relative rounded-[1.6rem] p-6 lg:p-7" style={{ ["--hue" as string]: s.hue }}>
      <div className="flex items-center justify-between">
        <span className="grid size-11 place-items-center rounded-full border border-fg/10 bg-fg/[0.04] text-pink-2" style={{ color: `hsl(${s.hue} 90% 68%)` }}>
          <Glyph className="size-5" />
        </span>
        <span className="font-mono text-xs tracking-[0.2em] text-ink-3">
          {s.index} / {String(COUNT).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-5 font-display text-2xl font-medium tracking-[-0.02em] lg:text-[1.9rem]">{s.title}</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{s.description}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {s.deliverables.map((d) => (
          <li key={d} className="rounded-full border border-fg/10 px-3 py-1 text-xs text-ink-2">
            {d}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DesktopStage() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const lenis = useLenis();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      let last = -1;
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const idx = self.progress * (COUNT - 1);
          scrollState.services = idx;
          scrollState.servicesProgress = self.progress;
          const r = Math.round(idx);
          if (r !== last) {
            last = r;
            setActive(r);
          }
        },
      });
      return () => st.kill();
    },
    { scope: root },
  );

  const jump = useCallback(
    (i: number) => {
      const el = root.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const span = el.offsetHeight - window.innerHeight;
      const y = top + (span * i) / (COUNT - 1) + 2;
      if (lenis?.current) lenis.current.scrollTo(y, { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
      else window.scrollTo({ top: y, behavior: "smooth" });
    },
    [lenis],
  );

  return (
    <section id="services" ref={root} className="relative" style={{ height: `${COUNT * 68}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="container-x grid w-full grid-cols-12 items-center gap-8">
          <div className="col-span-5 xl:col-span-4">
            <Reveal>
              <Eyebrow index="02">Our Services</Eyebrow>
            </Reveal>
            <SplitHeading as="h2" className="display-md mt-5">
              Everything a growing brand needs, under one roof.
            </SplitHeading>
            <ol className="mt-8 flex flex-col border-t border-line">
              {services.map((s, i) => {
                const on = i === active;
                return (
                  <li key={s.id} className="border-b border-line">
                    <button
                      type="button"
                      onClick={() => jump(i)}
                      aria-current={on ? "true" : undefined}
                      className={cn(
                        "group flex w-full items-center gap-4 py-[0.62rem] text-left transition-colors duration-300",
                        on ? "text-ink" : "text-ink-3 hover:text-ink-2",
                      )}
                    >
                      <span className={cn("font-mono text-[11px] tracking-[0.2em] transition-colors", on ? "text-pink-2" : "text-ink-3")}>{s.index}</span>
                      <span className="font-display text-[1.05rem] font-medium tracking-[-0.01em] xl:text-[1.15rem]">{s.title}</span>
                      <span className={cn("ml-auto h-px bg-pink-2 transition-all duration-700 ease-out-expo", on ? "w-10 opacity-100" : "w-0 opacity-0")} />
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="relative col-span-7 h-[84vh] xl:col-span-8">
            <div aria-hidden className="pointer-events-none absolute left-1/2 top-[38%] size-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(232,40,98,0.16),transparent_70%)] blur-3xl" />
            <Scene className="absolute inset-x-0 top-0 h-[66%]">
              <ServicesOrbit />
            </Scene>
            <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[30rem] xl:max-w-[34rem]">
              <ServiceCard index={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileList() {
  const [open, setOpen] = useState<string>(services[0].id);
  return (
    <section id="services" className="relative py-20">
      <div className="container-x">
        <Reveal>
          <Eyebrow index="02">Our Services</Eyebrow>
        </Reveal>
        <SplitHeading as="h2" className="display-md mt-5">
          Everything a growing brand needs, under one roof.
        </SplitHeading>
        <div className="relative mt-8 h-[46vh] min-h-[280px]">
          <Scene className="absolute inset-0">
            <ServicesOrbit autoplay />
          </Scene>
        </div>
        <ul className="mt-6 flex flex-col border-t border-line">
          {services.map((s) => {
            const Glyph = glyphs[s.id as keyof typeof glyphs];
            const on = open === s.id;
            return (
              <li key={s.id} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setOpen(on ? "" : s.id)}
                  aria-expanded={on}
                  className="flex w-full items-center gap-4 py-4 text-left"
                >
                  <span className="font-mono text-[11px] tracking-[0.2em] text-pink-2">{s.index}</span>
                  <span className="font-display text-xl font-medium tracking-[-0.01em]">{s.title}</span>
                  <Plus className={cn("ml-auto size-5 shrink-0 text-ink-3 transition-transform duration-500 ease-out-expo", on && "rotate-45 text-ink")} />
                </button>
                <div className={cn("grid transition-[grid-template-rows] duration-500 ease-out-expo", on ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden">
                    <div className="flex gap-4 pb-6">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-fg/10" style={{ color: `hsl(${s.hue} 90% 68%)` }}>
                        <Glyph className="size-5" />
                      </span>
                      <div>
                        <p className="text-[15px] leading-relaxed text-ink-2">{s.description}</p>
                        <ul className="mt-4 flex flex-wrap gap-2">
                          {s.deliverables.map((d) => (
                            <li key={d} className="rounded-full border border-fg/10 px-3 py-1 text-xs text-ink-2">
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function Services() {
  const large = useIsLarge();
  // hydrate with the mobile layout, then swap once we know the viewport, so SSR markup is stable
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);
  if (ready && large) return <DesktopStage />;
  return <MobileList />;
}
