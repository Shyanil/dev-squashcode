"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { nav, site } from "@/lib/content";
import { useLenis, useScrollTo } from "@/components/providers/SmoothScroll";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { socialIcons } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const root = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const scrollTo = useScrollTo();
  const lenis = useLenis();

  // show/hide on scroll direction (Twain's "header away" behaviour)
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        if (!open) {
          if (y > 180 && y - last > 6) setHidden(true);
          else if (last - y > 6 || y < 180) setHidden(false);
        }
        last = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  // entrance after the intro
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const play = () => gsap.fromTo(el, { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: "power3.out", delay: 0.15, clearProps: "transform" });
      if (document.documentElement.dataset.ready === "1") play();
      else window.addEventListener("sq:ready", play, { once: true });
    },
    { scope: root },
  );

  // mobile menu open/close
  useGSAP(
    () => {
      const el = menu.current;
      if (!el) return;
      const items = el.querySelectorAll<HTMLElement>("[data-menu-item]");
      if (open) {
        lenis?.current?.stop();
        document.documentElement.style.overflow = "hidden";
        gsap.set(el, { pointerEvents: "auto" });
        gsap
          .timeline()
          .to(el, { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "expo.inOut" })
          .fromTo(items, { y: 40, opacity: 0, filter: "blur(6px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, stagger: 0.06, ease: "power3.out" }, "-=0.35");
      } else {
        lenis?.current?.start();
        document.documentElement.style.overflow = "";
        gsap.set(el, { pointerEvents: "none" });
        gsap.to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.6, ease: "expo.inOut" });
      }
    },
    { dependencies: [open, lenis] },
  );

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    setOpen(false);
    requestAnimationFrame(() => scrollTo(href));
  };

  return (
    <header ref={root} className="fixed inset-x-0 top-0 z-[60] opacity-0">
      <div
        className={cn(
          "container-x transition-transform duration-500 ease-out-expo",
          hidden ? "-translate-y-[120%]" : "translate-y-0",
        )}
      >
        <div
          className={cn(
            "mt-4 flex h-[60px] items-center justify-between rounded-full border pl-5 pr-2.5 transition-[background-color,border-color,backdrop-filter,box-shadow] duration-500 ease-out-cubic lg:mt-5 lg:h-16",
            scrolled || open
              ? "border-fg/[0.08] bg-bg/70 shadow-[0_10px_40px_-20px_rgba(20,10,30,0.45)] backdrop-blur-xl"
              : "border-transparent bg-transparent",
          )}
        >
          <a href="#home" onClick={(e) => go(e, "#home")} aria-label="SquashCode home" className="relative z-[70] flex shrink-0 items-center" data-cursor="link">
            <Image src="/brand/logo-ink.png" alt="SquashCode" width={154} height={30} priority className="h-[26px] w-auto lg:h-[30px] dark:hidden" />
            <Image src="/brand/logo.png" alt="SquashCode" width={154} height={30} priority className="hidden h-[26px] w-auto lg:h-[30px] dark:block" />
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {nav.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => go(e, l.href)}
                target={"external" in l && l.external ? "_blank" : undefined}
                rel={"external" in l && l.external ? "noopener noreferrer" : undefined}
                className="group relative px-3.5 py-2 text-[14px] font-medium text-ink-2 transition-colors duration-300 hover:text-ink"
              >
                {l.label}
                <span className="absolute inset-x-3.5 -bottom-px h-px origin-left scale-x-0 bg-pink-2 transition-transform duration-500 ease-out-expo group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle className="relative z-[70]" />
            <span className="hidden sm:block">
              <Button href={site.calendly} size="md" icon="none" className="h-11 px-5">
                Get Started
              </Button>
            </span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative z-[70] grid size-11 place-items-center rounded-full border border-fg/10 lg:hidden"
            >
              <span className={cn("absolute h-px w-5 bg-ink transition-transform duration-500 ease-out-expo", open ? "rotate-45" : "-translate-y-[3.5px]")} />
              <span className={cn("absolute h-px w-5 bg-ink transition-transform duration-500 ease-out-expo", open ? "-rotate-45" : "translate-y-[3.5px]")} />
            </button>
          </div>
        </div>
      </div>

      {/* mobile overlay */}
      <div
        id="mobile-menu"
        ref={menu}
        className="pointer-events-none fixed inset-0 z-[65] flex flex-col bg-bg px-6 pb-10 pt-28 lg:hidden"
        style={{ clipPath: "inset(0 0 100% 0)" }}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile" className="flex flex-col gap-1">
          {nav.map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              onClick={(e) => go(e, l.href)}
              data-menu-item
              tabIndex={open ? 0 : -1}
              className="flex items-baseline gap-4 border-b border-line py-4 font-display text-[2.4rem] leading-none tracking-[-0.03em] text-ink"
            >
              <span className="font-mono text-xs text-pink-2">0{i + 1}</span>
              {l.label}
            </a>
          ))}
        </nav>
        <div data-menu-item className="mt-8 flex flex-col gap-4">
          <Button href={site.calendly} size="lg" className="w-full justify-center">
            Get Started
          </Button>
          <a href={`mailto:${site.email}`} className="text-ink-2">
            {site.email}
          </a>
          <div className="flex gap-3">
            {site.socials.map((s) => {
              const Icon = socialIcons[s.icon];
              return (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="grid size-11 place-items-center rounded-full border border-fg/10 text-ink-2">
                  <Icon className="size-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
