"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { approach } from "@/lib/content";
import { useIsLarge } from "@/lib/hooks";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { cn } from "@/lib/utils";

const PATH = "M 40 300 C 230 300 290 70 480 110 C 650 146 700 330 860 250 C 1000 180 1040 60 1160 80";
const N = approach.stages.length;

function StagePanel({ index }: { index: number }) {
  const s = approach.stages[index];
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.fromTo(ref.current.children, { opacity: 0, y: 16, filter: "blur(4px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, stagger: 0.07, ease: "power3.out", clearProps: "filter" });
    },
    { scope: ref, dependencies: [index] },
  );
  return (
    <div ref={ref} className="glass rounded-[1.6rem] p-6 lg:p-7">
      <span className="font-mono text-xs tracking-[0.2em] text-pink-2">
        Stage {s.index} / 0{N}
      </span>
      <h3 className="mt-3 font-display text-3xl font-medium tracking-[-0.02em]">{s.title}</h3>
      <p className="mt-2 text-ink-2">{s.text}</p>
      <ul className="mt-5 flex flex-col gap-2 text-[15px] text-ink-2">
        {s.points.map((p) => (
          <li key={p} className="flex items-center gap-3">
            <span className="size-1.5 rounded-full bg-pink-2" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Desktop() {
  const root = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const el = root.current;
      const s = svg.current;
      if (!el || !s) return;
      const path = s.querySelector<SVGPathElement>(".trail");
      const dot = s.querySelector<SVGGElement>(".dot");
      const nodes = s.querySelectorAll<SVGGElement>(".node");
      if (!path || !dot) return;

      // place nodes along the path
      const len = path.getTotalLength();
      nodes.forEach((n, i) => {
        const p = path.getPointAtLength((len * i) / (N - 1));
        gsap.set(n, { x: p.x, y: p.y });
      });

      gsap.set(dot, { x: 40, y: 300 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: (self) => {
            const r = Math.min(N - 1, Math.floor(self.progress * N));
            setActive((prev) => (prev === r ? prev : r));
            nodes.forEach((n, i) => {
              n.dataset.on = self.progress >= i / (N - 1) - 0.02 ? "1" : "0";
            });
          },
        },
      });
      tl.fromTo(path, { drawSVG: "0%" }, { drawSVG: "100%", ease: "none" }, 0).to(
        dot,
        { motionPath: { path, align: path, alignOrigin: [0.5, 0.5] }, ease: "none" },
        0,
      );
      ScrollTrigger.refresh();
    },
    { scope: root },
  );

  return (
    <section id="approach" ref={root} className="relative" style={{ height: `${N * 70}vh` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="container-x">
          <div className="flex items-end justify-between gap-10">
            <div className="max-w-xl">
              <Reveal>
                <Eyebrow index="03">How we work</Eyebrow>
              </Reveal>
              <SplitHeading as="h2" className="display-lg mt-5">
                {approach.title}
              </SplitHeading>
            </div>
            <Reveal className="max-w-sm pb-2">
              <p className="lead text-base">{approach.text}</p>
            </Reveal>
          </div>

          <div className="relative mt-4 grid h-[54vh] grid-cols-12 items-center gap-8">
            <svg ref={svg} viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid meet" className="col-span-8 h-full w-full overflow-visible" aria-hidden>
              <defs>
                <linearGradient id="trail-grad" x1="0" x2="1">
                  <stop offset="0" stopColor="#ff4d8a" />
                  <stop offset="1" stopColor="#8b6bff" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path d={PATH} fill="none" style={{ stroke: "rgb(var(--fg-rgb) / 0.12)" }} strokeWidth="2" strokeDasharray="4 8" />
              <path className="trail" d={PATH} fill="none" stroke="url(#trail-grad)" strokeWidth="2.5" strokeLinecap="round" filter="url(#glow)" />
              {approach.stages.map((s, i) => (
                <g key={s.index} className="node" data-on="0">
                  <circle r="26" className="fill-bg stroke-fg/10 transition-[stroke] duration-500 [.node[data-on='1']_&]:stroke-pink-2" strokeWidth="1" />
                  <circle r="5" className="fill-ink-3 transition-[fill,transform] duration-500 [.node[data-on='1']_&]:fill-pink-2" />
                  <text
                    y={i % 2 === 0 ? 58 : -42}
                    textAnchor="middle"
                    className="fill-ink-3 font-display text-[22px] font-medium tracking-[-0.02em] transition-[fill] duration-500 [.node[data-on='1']_&]:fill-ink"
                  >
                    {s.title}
                  </text>
                  <text y={i % 2 === 0 ? 80 : -64} textAnchor="middle" className="fill-ink-3 font-mono text-[11px] tracking-[0.2em]">
                    {s.index}
                  </text>
                </g>
              ))}
              <g className="dot">
                <circle r="22" className="fill-pink/25" filter="url(#glow)" />
                <circle r="7" className="fill-fg" />
              </g>
            </svg>

            <div className="col-span-4">
              <StagePanel index={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Mobile() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      gsap.fromTo(
        ".rail-fill",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".rail", start: "top 70%", end: "bottom 60%", scrub: true } },
      );
      const items = el.querySelectorAll<HTMLElement>(".stage");
      items.forEach((it) => {
        ScrollTrigger.create({
          trigger: it,
          start: "top 65%",
          onEnter: () => (it.dataset.on = "1"),
          onLeaveBack: () => (it.dataset.on = "0"),
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="approach" ref={root} className="relative py-20">
      <div className="container-x">
        <Reveal>
          <Eyebrow index="03">How we work</Eyebrow>
        </Reveal>
        <SplitHeading as="h2" className="display-lg mt-5">
          {approach.title}
        </SplitHeading>
        <Reveal>
          <p className="lead mt-5">{approach.text}</p>
        </Reveal>
        <div className="rail relative mt-12 pl-10">
          <div className="absolute bottom-6 left-[11px] top-2 w-px bg-fg/10">
            <div className="rail-fill absolute inset-0 origin-top bg-gradient-to-b from-pink-2 to-violet" />
          </div>
          <ol className="flex flex-col gap-10">
            {approach.stages.map((s) => (
              <li key={s.index} className="stage group relative" data-on="0">
                <span className={cn("absolute -left-10 top-1 grid size-6 place-items-center rounded-full border border-fg/15 bg-bg transition-colors duration-500 group-data-[on=1]:border-pink-2")}>
                  <span className="size-1.5 rounded-full bg-ink-3 transition-colors duration-500 group-data-[on=1]:bg-pink-2" />
                </span>
                <span className="font-mono text-xs tracking-[0.2em] text-pink-2">{s.index}</span>
                <h3 className="mt-2 font-display text-3xl font-medium tracking-[-0.02em]">{s.title}</h3>
                <p className="mt-2 text-ink-2">{s.text}</p>
                <ul className="mt-4 flex flex-col gap-1.5 text-[15px] text-ink-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-3">
                      <span className="size-1.5 rounded-full bg-pink-2/70" />
                      {p}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function Approach() {
  const large = useIsLarge();
  return large ? <Desktop /> : <Mobile />;
}
