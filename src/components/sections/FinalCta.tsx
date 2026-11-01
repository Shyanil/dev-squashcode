"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "@/lib/gsap";
import { scrollState } from "@/lib/scroll-state";
import { cta, site } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Scene } from "@/components/three/Scene";

const Aurora = dynamic(() => import("@/components/three/Aurora").then((m) => m.Aurora), { ssr: false });

export function FinalCta() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (!root.current) return;
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          scrollState.cta = self.progress;
        },
      });
      return () => st.kill();
    },
    { scope: root },
  );

  return (
    <section id="contact" ref={root} className="relative overflow-hidden">
      <Scene className="absolute inset-0 h-full w-full">
        <Aurora />
      </Scene>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />

      <div className="container-x relative z-10 flex flex-col items-center py-32 text-center lg:py-48">
        <Reveal>
          <Eyebrow>Let’s build together</Eyebrow>
        </Reveal>
        <SplitHeading as="h2" className="display-xl mt-6 max-w-[16ch]">
          {cta.title}
        </SplitHeading>
        <Reveal>
          <p className="lead mt-8 max-w-xl text-ink/80">{cta.text}</p>
        </Reveal>
        <Reveal cascade className="mt-10 flex flex-wrap items-center justify-center gap-3.5">
          <Button href={cta.primary.href} size="lg">
            {cta.primary.label}
          </Button>
          <Button href={cta.secondary.href} size="lg" variant="ghost" icon="external">
            {cta.secondary.label}
          </Button>
        </Reveal>
        <Reveal className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-ink-2">
          <a href={`mailto:${site.email}`} className="transition-colors hover:text-ink">
            {site.email}
          </a>
          {site.phones.map((p) => (
            <a key={p.href} href={p.href} className="transition-colors hover:text-ink">
              {p.label}
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
