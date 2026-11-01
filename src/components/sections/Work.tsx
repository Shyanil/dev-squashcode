"use client";

import { useRef, type PointerEvent } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { projects, type Project } from "@/lib/content";
import { useIsDesktop } from "@/lib/hooks";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { ArrowUpRight } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

function ProjectCard({ p }: { p: Project }) {
  const card = useRef<HTMLAnchorElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const desktop = useIsDesktop();

  useGSAP(
    () => {
      const f = frame.current;
      if (!f) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(f, { clipPath: "inset(0 0 0% 0 round 1.75rem)" });
        return;
      }
      gsap.fromTo(
        f,
        { clipPath: "inset(0 0 100% 0 round 1.75rem)" },
        { clipPath: "inset(0 0 0% 0 round 1.75rem)", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: f, start: "top 85%", once: true } },
      );
      gsap.fromTo(".shot", { scale: 1.18, yPercent: -4 }, { scale: 1, yPercent: 4, ease: "none", scrollTrigger: { trigger: f, start: "top bottom", end: "bottom top", scrub: true } });
    },
    { scope: card },
  );

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (!desktop || !frame.current) return;
    const r = frame.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(frame.current, { rotateY: x * 7, rotateX: -y * 7, transformPerspective: 1200, duration: 0.6, ease: "power3.out" });
  };
  const onLeave = () => {
    if (!frame.current) return;
    gsap.to(frame.current, { rotateX: 0, rotateY: 0, duration: 0.9, ease: "power3.out" });
  };

  return (
    <a
      ref={card}
      href={p.href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="view"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="group block"
    >
      <div
        ref={frame}
        className={cn(
          "relative overflow-hidden rounded-[1.75rem] border border-line bg-bg-2 [transform-style:preserve-3d]",
          p.size === "wide" ? "aspect-[4/3] sm:aspect-[16/9]" : "aspect-[4/3]",
        )}
      >
        <div className="absolute inset-x-0 top-0 z-10 flex h-9 items-center gap-2 border-b border-fg/[0.06] bg-bg/70 px-4 backdrop-blur-md">
          <span className="size-2 rounded-full bg-fg/15" />
          <span className="size-2 rounded-full bg-fg/15" />
          <span className="size-2 rounded-full bg-fg/15" />
          <span className="ml-3 truncate font-mono text-[10px] tracking-[0.12em] text-ink-3">{p.href.replace("https://", "")}</span>
        </div>
        <Image
          src={p.image}
          alt={`${p.title} website`}
          fill
          sizes={p.size === "wide" ? "(min-width: 1024px) 1400px, 100vw" : "(min-width: 1024px) 700px, 100vw"}
          className="shot object-cover object-top will-change-transform"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-60" />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-fg/[0.06]" />
      </div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <h3 className="font-display text-2xl font-medium tracking-[-0.02em] transition-colors duration-300 group-hover:text-pink-2 lg:text-[1.65rem]">{p.title}</h3>
          <p className="mt-1.5 text-sm text-ink-3">
            {p.category} <span className="mx-2 text-ink-3/60">·</span> {p.sector}
          </p>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-2">{p.description}</p>
        </div>
        <span className="mt-1 grid size-11 shrink-0 place-items-center rounded-full border border-fg/10 text-ink-2 transition-[background-color,color,transform] duration-500 ease-out-expo group-hover:-rotate-12 group-hover:bg-pink group-hover:text-white">
          <ArrowUpRight className="size-5" />
        </span>
      </div>
    </a>
  );
}

export function Work() {
  return (
    <section id="work" className="relative py-24 lg:py-36">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow index="04">Featured projects</Eyebrow>
            </Reveal>
            <SplitHeading as="h2" className="display-lg mt-5">
              Work That Speaks for Itself.
            </SplitHeading>
          </div>
          <Reveal className="lg:col-span-5 lg:pb-2">
            <p className="lead">Live websites we have designed and built for real estate developers, advisors and brands. Every one of them is in production today.</p>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-16">
          {projects.map((p, i) => (
            <li key={p.slug} className={cn(p.size === "wide" && "lg:col-span-2", i % 2 === 1 && p.size !== "wide" && "lg:mt-16")}>
              <ProjectCard p={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
