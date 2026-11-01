"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { why } from "@/lib/content";
import { useIsLarge } from "@/lib/hooks";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";

function Motif({ kind }: { kind: string }) {
  const common = "absolute right-6 top-6 size-28 text-pink-2/70 lg:right-8 lg:top-8 lg:size-36";
  switch (kind) {
    case "rings":
      return (
        <svg viewBox="0 0 100 100" className={common} fill="none" stroke="currentColor" aria-hidden>
          {[46, 36, 26, 16].map((r, i) => (
            <circle key={r} cx="50" cy="50" r={r} strokeWidth="1" opacity={0.25 + i * 0.2} />
          ))}
          <circle cx="50" cy="50" r="4" fill="currentColor" stroke="none" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 100 100" className={common + " animate-spin-slow"} fill="none" stroke="currentColor" aria-hidden>
          {Array.from({ length: 12 }, (_, i) => (
            <line key={i} x1="50" y1="8" x2="50" y2={i % 3 === 0 ? 26 : 18} strokeWidth="1.2" transform={`rotate(${i * 30} 50 50)`} opacity={0.4 + (i % 3) * 0.2} />
          ))}
          <circle cx="50" cy="50" r="6" fill="currentColor" stroke="none" />
        </svg>
      );
    case "grid":
      return (
        <svg viewBox="0 0 100 100" className={common} fill="none" stroke="currentColor" aria-hidden>
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <rect key={`${r}${c}`} x={8 + c * 22} y={8 + r * 22} width="18" height="18" rx="3" strokeWidth="1" opacity={(r + c) % 2 ? 0.35 : 0.8} fill={(r + c) % 3 === 0 ? "currentColor" : "none"} fillOpacity={0.25} />
            )),
          )}
        </svg>
      );
    case "path":
      return (
        <svg viewBox="0 0 100 100" className={common} fill="none" stroke="currentColor" aria-hidden>
          <path d="M8 80 C 30 80 30 30 50 30 S 70 70 92 20" strokeWidth="1.5" />
          <path d="M8 60 C 30 60 30 15 50 15" strokeWidth="1" opacity="0.4" strokeDasharray="3 4" />
          <circle cx="92" cy="20" r="4" fill="currentColor" stroke="none" />
        </svg>
      );
    case "waves":
      return (
        <svg viewBox="0 0 100 100" className={common} fill="none" stroke="currentColor" aria-hidden>
          {[20, 35, 50, 65, 80].map((y, i) => (
            <path key={y} d={`M5 ${y} Q 25 ${y - 10} 50 ${y} T 95 ${y}`} strokeWidth="1.2" opacity={0.3 + i * 0.15} />
          ))}
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 100 100" className={common} fill="currentColor" aria-hidden>
          {[30, 48, 40, 62, 74, 90].map((h, i) => (
            <rect key={i} x={8 + i * 15} y={95 - h} width="9" height={h} rx="2" opacity={0.35 + i * 0.12} />
          ))}
        </svg>
      );
  }
}

export function Why() {
  const root = useRef<HTMLElement>(null);
  const large = useIsLarge();

  useGSAP(
    () => {
      if (!large || !root.current) return;
      const cards = gsap.utils.toArray<HTMLElement>(".why-card");
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(card, {
          scale: 0.95,
          opacity: 0.5,
          ease: "none",
          scrollTrigger: { trigger: next, start: "top 70%", end: "top top+=150", scrub: true },
        });
      });
    },
    { scope: root, dependencies: [large] },
  );

  return (
    <section id="why" ref={root} className="relative py-24 lg:py-36">
      <div className="container-x lg:grid lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <Eyebrow index="05">Why SquashCode</Eyebrow>
            </Reveal>
            <SplitHeading as="h2" className="display-lg mt-5">
              {why.title}
            </SplitHeading>
            <Reveal>
              <p className="lead mt-6 max-w-md">{why.text}</p>
            </Reveal>
          </div>
        </div>

        <ul className="mt-14 flex flex-col gap-5 lg:col-span-7 lg:mt-0 lg:gap-0">
          {why.values.map((v, i) => (
            <li key={v.index} className="lg:sticky" style={large ? { top: `calc(7.5rem + ${i * 1.1}rem)` } : undefined}>
              <Reveal>
                <article
                  className="why-card noise relative overflow-hidden rounded-[1.75rem] border border-fg/[0.08] p-7 will-change-transform lg:mb-6 lg:min-h-[21rem] lg:p-10"
                  style={{
                    background: `linear-gradient(145deg, hsl(${330 - i * 14} 30% var(--why-top)), hsl(${330 - i * 14} 26% var(--why-bot)))`,
                    transformOrigin: "50% 0%",
                  }}
                >
                  <Motif kind={v.motif} />
                  <span className="font-mono text-xs tracking-[0.2em] text-pink-2">{v.index}</span>
                  <h3 className="mt-20 max-w-[12ch] font-display text-[2rem] font-medium leading-[1.05] tracking-[-0.025em] lg:mt-24 lg:text-[2.6rem]">{v.title}</h3>
                  <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-2 lg:text-base">{v.text}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
