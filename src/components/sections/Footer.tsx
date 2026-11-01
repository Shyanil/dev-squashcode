"use client";

import { useRef, useSyncExternalStore, type MouseEvent } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { nav, services, site } from "@/lib/content";
import { useScrollTo } from "@/components/providers/SmoothScroll";
import { socialIcons } from "@/components/ui/Icons";

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const scrollTo = useScrollTo();

  useGSAP(
    () => {
      const el = root.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(".footer-inner", { yPercent: -18 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 20%", scrub: true } });
      gsap.fromTo(".footer-word", { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, ease: "power3.out", duration: 1.6, scrollTrigger: { trigger: ".footer-word", start: "top 95%", once: true } });
    },
    { scope: root },
  );

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    scrollTo(href);
  };

  const year = useSyncExternalStore(
    () => () => {},
    () => new Date().getFullYear(),
    () => 2026,
  );

  return (
    <footer ref={root} className="relative overflow-hidden border-t border-line bg-bg-2">
      <div className="footer-inner container-x pt-16 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <a href="#home" onClick={(e) => go(e, "#home")} aria-label="SquashCode home" className="inline-block">
              <Image src="/brand/logo-ink.png" alt="SquashCode" width={170} height={33} className="h-8 w-auto dark:hidden" />
              <Image src="/brand/logo.png" alt="SquashCode" width={170} height={33} className="hidden h-8 w-auto dark:block" />
            </a>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink-2">{site.description}</p>
            <div className="mt-7 flex gap-3">
              {site.socials.map((s) => {
                const Icon = socialIcons[s.icon];
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid size-11 place-items-center rounded-full border border-fg/10 text-ink-2 transition-[background-color,color,border-color] duration-300 hover:border-pink hover:bg-pink hover:text-white"
                  >
                    <Icon className="size-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-3">
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3">Navigate</h3>
              <ul className="mt-5 flex flex-col gap-3 text-[15px]">
                {nav.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      onClick={(e) => go(e, l.href)}
                      target={"external" in l && l.external ? "_blank" : undefined}
                      rel={"external" in l && l.external ? "noopener noreferrer" : undefined}
                      className="text-ink-2 transition-colors hover:text-ink"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a href={site.career} target="_blank" rel="noopener noreferrer" className="text-ink-2 transition-colors hover:text-ink">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3">Services</h3>
              <ul className="mt-5 flex flex-col gap-3 text-[15px]">
                {services.map((s) => (
                  <li key={s.id}>
                    <a href="#services" onClick={(e) => go(e, "#services")} className="text-ink-2 transition-colors hover:text-ink">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3">Contact</h3>
              <ul className="mt-5 flex flex-col gap-5 text-[15px] text-ink-2">
                <li>
                  <a href={`mailto:${site.email}`} className="text-ink transition-colors hover:text-pink-2">
                    {site.email}
                  </a>
                </li>
                <li className="flex flex-col gap-1">
                  {site.phones.map((p) => (
                    <a key={p.href} href={p.href} className="transition-colors hover:text-ink">
                      {p.label}
                    </a>
                  ))}
                </li>
                {site.addresses.map((a) => (
                  <li key={a.label}>
                    <p className="text-xs uppercase tracking-[0.14em] text-ink-3">{a.label}</p>
                    <address className="mt-1 not-italic leading-relaxed">
                      {a.lines.map((l) => (
                        <span key={l} className="block">
                          {l}
                        </span>
                      ))}
                    </address>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line py-7 text-sm text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} SquashCode. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {site.legal.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div aria-hidden className="footer-word pointer-events-none select-none overflow-hidden">
        <p className="container-x -mb-[0.26em] text-center font-display text-[14.5vw] font-semibold leading-none tracking-[-0.05em] whitespace-nowrap text-fg/[0.05]">
          SquashCode
        </p>
      </div>
    </footer>
  );
}
