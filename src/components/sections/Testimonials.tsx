"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { testimonials } from "@/lib/content";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { cn } from "@/lib/utils";

const tints: Record<string, { bg: string; border: string; chip: string; accent: string }> = {
  rose: { bg: "linear-gradient(180deg, hsl(340 42% var(--tint-top)), hsl(340 40% var(--tint-bot)))", border: "hsl(340 60% 40% / 0.35)", chip: "hsl(340 70% var(--tint-chip))", accent: "hsl(340 85% 62%)" },
  violet: { bg: "linear-gradient(180deg, hsl(255 42% var(--tint-top)), hsl(255 40% var(--tint-bot)))", border: "hsl(255 60% 50% / 0.35)", chip: "hsl(255 70% var(--tint-chip))", accent: "hsl(255 85% 70%)" },
  teal: { bg: "linear-gradient(180deg, hsl(172 40% var(--tint-top)), hsl(172 38% var(--tint-bot)))", border: "hsl(172 60% 40% / 0.35)", chip: "hsl(172 60% var(--tint-chip))", accent: "hsl(172 70% 55%)" },
};

function QuoteMark({ className, color }: { className?: string; color: string }) {
  return (
    <svg viewBox="0 0 48 40" className={className} fill={color} aria-hidden>
      <path d="M0 40V22.4C0 9.6 6.6 2.2 19.8 0l2.6 6c-6.6 1.6-10 5.3-10.2 11H21v23H0Zm27 0V22.4C27 9.6 33.6 2.2 46.8 0l1.2 6c-6.6 1.6-10 5.3-10.2 11H48v23H27Z" />
    </svg>
  );
}

function Card({ t, i }: { t: (typeof testimonials)[number]; i: number }) {
  const [flipped, setFlipped] = useState(false);
  const tint = tints[t.tint];
  return (
    <li
      className="flip h-[27rem] [perspective:1400px] lg:h-[29rem]"
      data-flipped={flipped ? "1" : "0"}
      style={{ ["--i" as string]: i }}
    >
      <button
        type="button"
        onClick={() => setFlipped((v) => !v)}
        aria-pressed={flipped}
        aria-label={`Testimonial from ${t.name}. Activate to flip the card.`}
        className="flip-inner relative block h-full w-full text-left [transform-style:preserve-3d]"
      >
        {/* front */}
        <div
          className="flip-face absolute inset-0 flex flex-col rounded-[1.75rem] border p-7 lg:p-8"
          style={{ background: tint.bg, borderColor: tint.border, boxShadow: "inset 0 1px 0 rgb(var(--fg-rgb) / 0.06)" }}
        >
          <div className="flex items-center justify-between">
            <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ background: "rgb(var(--fg-rgb) / 0.07)", color: tint.chip }}>
              {t.chip}
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-fg/40">FLIP</span>
          </div>
          <QuoteMark className="mt-7 h-7 w-auto" color={tint.accent} />
          <p className="mt-5 font-display text-[1.25rem] font-medium leading-[1.35] tracking-[-0.01em] text-ink lg:text-[1.35rem]">{t.quote}</p>
          <div className="mt-auto flex items-center gap-3 pt-6">
            <Image src={t.image} alt="" width={40} height={40} className="size-10 rounded-full object-cover" />
            <div>
              <p className="text-sm font-medium text-ink">{t.name}</p>
              <p className="text-xs text-fg/55">{t.role}</p>
            </div>
          </div>
        </div>
        {/* back */}
        <div
          className="flip-face flip-back absolute inset-0 flex flex-col items-center justify-center rounded-[1.75rem] border p-7 text-center lg:p-8"
          style={{ background: tint.bg, borderColor: tint.border }}
        >
          <div className="relative size-36 overflow-hidden rounded-full ring-1 ring-fg/15 lg:size-40">
            <Image src={t.image} alt={t.name} fill sizes="160px" className="object-cover" />
          </div>
          <p className="mt-6 font-display text-2xl font-medium tracking-[-0.02em]">{t.name}</p>
          <p className="mt-1 text-sm text-fg/60">{t.role}</p>
          <span className="mt-6 rounded-full px-3 py-1 text-xs font-medium" style={{ background: "rgb(var(--fg-rgb) / 0.07)", color: tint.chip }}>
            {t.chip}
          </span>
          <p className="mt-8 font-mono text-[10px] tracking-[0.2em] text-fg/40">VERIFIED CLIENT REVIEW</p>
        </div>
      </button>
    </li>
  );
}

export function Testimonials() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (!root.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".flip", {
        y: 80,
        opacity: 0,
        rotate: (i: number) => (i - 1) * 4,
        transformOrigin: "50% 100%",
        duration: 1.3,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".flip", start: "top 85%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section id="testimonials" ref={root} className="relative overflow-x-clip py-24 lg:py-36">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow index="07">Client testimonials</Eyebrow>
            </Reveal>
            <SplitHeading as="h2" className="display-lg mt-5">
              Don’t Just Take Our Word for It.
            </SplitHeading>
          </div>
          <Reveal className="lg:col-span-5 lg:pb-2">
            <p className="lead">Real words from the people we work with. Hover or tap a card to meet them.</p>
          </Reveal>
        </div>
        <ul className={cn("mt-14 grid gap-6 md:grid-cols-3 lg:mt-20 lg:gap-8")}>
          {testimonials.map((t, i) => (
            <Card key={t.name} t={t} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
