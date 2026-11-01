"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { intro, proof, testimonials } from "@/lib/content";
import { useDarkTheme, useIsLarge } from "@/lib/hooks";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LocalCanvas } from "@/components/three/LocalCanvas";

const IntroTrio = dynamic(() => import("@/components/three/IntroTrio").then((m) => m.IntroTrio), { ssr: false });

/** Wrap the highlighted phrases of a quote in <mark>. */
function Highlighted({ text, phrases }: { text: string; phrases: readonly string[] }) {
  const parts = useMemo(() => {
    const re = new RegExp(`(${phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
    return text.split(re);
  }, [text, phrases]);
  return (
    <>
      {parts.map((p, i) =>
        phrases.some((h) => h.toLowerCase() === p.toLowerCase()) ? (
          <mark key={i} className="proof-card__hl">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

function ProofCard({ card }: { card: (typeof proof)[number] }) {
  const t = testimonials[card.testimonial];
  const [flipped, setFlipped] = useState(false);
  const toggle = () => setFlipped((f) => !f);
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <article
      className="proof-card"
      style={{ ["--h" as string]: card.hue }}
      data-flipped={flipped ? "1" : "0"}
      tabIndex={0}
      role="button"
      aria-pressed={flipped}
      aria-label={`${card.metric}. ${card.caption}. Show what ${t.name} said`}
      onClick={toggle}
      onKeyDown={onKey}
      data-cursor="link"
    >
      <div className="proof-card__in">
        <div className="proof-card__flip">
          <div className="proof-card__face proof-card__front">
            <span className="proof-card__chip proof-bit">{card.chip}</span>
            <div>
              <p className="proof-card__metric proof-bit">{card.metric}</p>
              <p className="proof-card__caption proof-bit">{card.caption}</p>
            </div>
            <div className="proof-card__foot proof-bit">
              <Image src={t.image} alt="" width={28} height={28} className="size-7 rounded-full object-cover" />
              <span className="truncate">{t.name}</span>
              <span className="proof-card__turn" aria-hidden>
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                  <path d="M15.5 8A6 6 0 0 0 4.4 6.5M4.5 12a6 6 0 0 0 11.1 1.5" />
                  <path d="M4 3.5v3.2h3.2M16 16.5v-3.2h-3.2" />
                </svg>
              </span>
            </div>
          </div>

          <div className="proof-card__face proof-card__back" aria-hidden={!flipped}>
            <div>
              <svg viewBox="0 0 32 24" className="proof-card__qmark" aria-hidden>
                <path
                  fill="currentColor"
                  d="M0 24V14C0 6.6 3.7 1.9 11 0l1.6 3.4C8.4 5 6.6 7.6 6.4 11.2H12V24H0Zm19 0V14c0-7.4 3.7-12.1 11-14l1.6 3.4c-4.2 1.6-6 4.2-6.2 7.8H31V24H19Z"
                />
              </svg>
              <p className="proof-card__quote">
                <Highlighted text={t.quote} phrases={card.highlight} />
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Image src={t.image} alt="" width={44} height={44} className="size-11 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="truncate text-[15px] font-medium">{t.name}</p>
                <p className="proof-card__caption truncate">{t.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Twain's "results + the message is the product" sequence:
 * 1. three pastel proof cards rise in (flip on hover / tap for the client's words)
 * 2. on scroll a rounded panel slides up over them while they fan out and sink
 * 3. the panel title starts on one line, breaks into a staircase, then settles left
 * 4. a paper plane cuts through the title, knocking letters, and the paragraph is
 *    "read" word by word as you keep scrolling. Pinned on desktop only.
 */
export function Intro() {
  const root = useRef<HTMLElement>(null);
  const large = useIsLarge();
  const dark = useDarkTheme();
  const paragraphs = useMemo(() => intro.paragraphs.map((p) => p.split(" ")), []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const cards = gsap.utils.toArray<HTMLElement>(".proof-card", el);
      const words = gsap.utils.toArray<HTMLElement>(".read-word", el);

      // 1. card entrance (inner wrapper, so it never fights the scroll transforms)
      if (!reduced) {
        const ins = cards.map((c) => c.querySelector(".proof-card__in")!);
        gsap.set(ins, { opacity: 0, y: 44, scaleX: 0.988, scaleY: 1.03, filter: "blur(6px)", transformOrigin: "50% 100%" });
        gsap.set(el.querySelectorAll(".proof-bit"), { opacity: 0, y: 14 });
        const enter = gsap.timeline({ paused: true });
        enter.to(ins, { opacity: 1, y: 0, scaleX: 1, scaleY: 1, filter: "blur(0px)", duration: 1.1, ease: "power2.out", stagger: 0.12 });
        cards.forEach((c, i) => enter.to(c.querySelectorAll(".proof-bit"), { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.08 }, 0.25 + i * 0.12));
        ScrollTrigger.create({ trigger: el.querySelector(".proof-row"), start: "top 85%", once: true, onEnter: () => enter.play() });
      }

      // word-by-word reading, driven by a 0..1 progress
      let lastOn = -1;
      const read = (p: number) => {
        const n = words.length;
        const on = Math.min(n, Math.floor(p * (n + 4)));
        if (on === lastOn) return;
        for (let i = 0; i < n; i++) words[i].dataset.on = i < on ? "1" : "0";
        lastOn = on;
      };

      if (!large) {
        const st = ScrollTrigger.create({
          trigger: el.querySelector(".intro-read"),
          start: "top 78%",
          end: "bottom 55%",
          scrub: true,
          onUpdate: (s) => read(s.progress),
        });
        return () => st.kill();
      }

      // ---------- desktop: pinned, scrubbed sequence ----------
      const stage = el.querySelector<HTMLElement>(".intro-stage")!;
      const panel = el.querySelector<HTMLElement>(".intro-panel")!;
      const title = el.querySelector<HTMLElement>(".intro-title")!;
      const lines = gsap.utils.toArray<HTMLElement>(".intro-line", title);
      const side = el.querySelectorAll<HTMLElement>(".intro-fade");
      const plane = el.querySelector<HTMLElement>(".intro-plane")!;

      // one-line layout: put every line after the previous one on the first row
      const avail = panel.querySelector<HTMLElement>(".intro-grid")!.clientWidth;
      const lh = lines[0].offsetHeight;
      const gap = parseFloat(getComputedStyle(title).fontSize) * 0.28;
      const widths = lines.map((l) => l.scrollWidth);
      const total = widths.reduce((a, b) => a + b, 0) + gap * (lines.length - 1);
      const fit = Math.min(1, (avail * 0.98) / total);
      let acc = 0;
      const oneLine = lines.map((_, i) => {
        const pos = { x: acc, y: -i * lh };
        acc += widths[i] + gap;
        return pos;
      });
      const step = Math.min(avail * 0.16, (avail - Math.max(...widths)) / Math.max(1, lines.length - 1));

      gsap.set(title, { scale: fit, transformOrigin: "0% 0%" });
      lines.forEach((l, i) => gsap.set(l, { x: oneLine[i].x, y: oneLine[i].y }));
      gsap.set(side, { opacity: 0, y: 24 });
      gsap.set(panel, { y: stage.clientHeight - panel.parentElement!.offsetTop + 24 });
      gsap.set(plane, { opacity: 0 });
      read(0);

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: false },
      });

      // 2. panel rises, cards fan out and sink behind it
      const fan = [
        { x: 50, y: 70, rotation: -7 },
        { x: 0, y: -10, rotation: -1.5 },
        { x: -40, y: -70, rotation: 6 },
      ];
      tl.to(panel, { y: 0, duration: 2, ease: "power1.inOut" }, 0);
      cards.forEach((c, i) => tl.to(c, { ...fan[i % 3], duration: 1.4, ease: "power1.out" }, 0));
      tl.to(cards, { y: "-=120", scale: 0.9, opacity: 0, filter: "blur(4px)", duration: 0.8, stagger: 0.06 }, 1.3);

      // 3. one line -> staircase -> stacked left
      tl.to(title, { scale: 1, duration: 1, ease: "power2.inOut" }, 2.2);
      lines.forEach((l, i) => tl.to(l, { x: i * step, y: 0, duration: 1, ease: "power2.inOut" }, 2.2 + i * 0.08));
      tl.to(lines, { x: 0, duration: 1, ease: "power2.inOut", stagger: 0.06 }, 3.6);
      tl.to(side, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power2.out" }, 4.1);

      // 4. paper plane cuts through the first two lines, knocking letters
      if (!reduced) {
        const split = new SplitText(lines.slice(0, 2), { type: "chars", charsClass: "intro-char" });
        const em = parseFloat(getComputedStyle(title).fontSize);
        const tw = Math.max(...widths);
        const path = [
          { x: -1.2 * em, y: lh * 1.55 },
          { x: tw * 0.35, y: lh * 1.0 },
          { x: tw * 0.7, y: lh * 0.45 },
          { x: tw + 2.2 * em, y: -0.4 * lh },
        ];
        const T0 = 4.6;
        const FL = 1.6;
        tl.set(plane, { opacity: 1, x: path[0].x, y: path[0].y }, T0);
        tl.to(plane, { motionPath: { path, curviness: 1.1, autoRotate: 43 }, duration: FL, ease: "power1.inOut" }, T0);
        tl.to(plane, { opacity: 0, duration: 0.2 }, T0 + FL - 0.2);
        // final title layout is x=0 for every line, so measure chars after the timeline's end state
        const pathY = (x: number) => {
          for (let k = 0; k < path.length - 1; k++) {
            const a = path[k], b = path[k + 1];
            if (x >= a.x && x <= b.x) return a.y + ((x - a.x) / (b.x - a.x)) * (b.y - a.y);
          }
          return path[path.length - 1].y;
        };
        split.chars.forEach((ch, idx) => {
          const c = ch as HTMLElement;
          const lineIdx = lines[0].contains(c) ? 0 : 1;
          const cx = c.offsetLeft + c.offsetWidth / 2;
          const cy = lineIdx * lh + lh / 2;
          const d = Math.abs(pathY(cx) - cy) / lh;
          if (d > 0.75) return;
          const power = 1 - d / 0.75;
          const at = T0 + Math.min(1, Math.max(0, (cx + 1.2 * em) / (tw + 3.4 * em))) * FL;
          const dir = idx % 2 ? 1 : -1;
          tl.to(c, { y: -0.32 * em * power, x: 0.08 * em * power * dir, rotation: 28 * power * dir, duration: 0.18, ease: "power2.out" }, at - 0.05)
            .to(c, { y: 0, x: 0, rotation: 0, duration: 0.55, ease: "back.out(2.2)" }, at + 0.13);
        });
      }

      // 5. read the paragraph
      const proxy = { p: 0 };
      tl.to(proxy, { p: 1, duration: 3.4, onUpdate: () => read(proxy.p) }, 5.2);
      tl.to({}, { duration: 0.4 });
    },
    { scope: root, dependencies: [large], revertOnUpdate: true },
  );

  return (
    <section id="about" ref={root} aria-label="Introducing SquashCode" className="relative lg:h-[520vh]">
      <div className="intro-stage relative lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden">
        {/* proof cards */}
        <div className="pt-6 pb-10 lg:absolute lg:inset-x-0 lg:top-[14vh] lg:pt-0 lg:pb-0">
          <div className="proof-row">
            {proof.map((c) => (
              <ProofCard key={c.metric} card={c} />
            ))}
          </div>
        </div>

        {/* the panel */}
        <div className="container-x lg:pointer-events-none lg:absolute lg:inset-x-0 lg:top-[92px] lg:bottom-6">
          <div className="intro-panel panel noise pointer-events-auto relative h-full overflow-hidden px-6 py-14 sm:px-10 lg:px-14 lg:py-14 xl:px-20">
            <div aria-hidden className="pointer-events-none absolute -left-32 -top-32 size-[28rem] rounded-full bg-[radial-gradient(closest-side,rgba(232,40,98,0.18),transparent_70%)] blur-2xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-40 right-0 size-[30rem] rounded-full bg-[radial-gradient(closest-side,rgba(110,91,255,0.14),transparent_70%)] blur-2xl" />

            <div className="intro-grid relative grid gap-12 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-5">
                <div className="intro-fade">
                  <Eyebrow index="01">Introducing SquashCode</Eyebrow>
                </div>
                <h2 className="intro-title display-md relative mt-6 whitespace-nowrap max-lg:whitespace-normal">
                  {intro.title.map((line, i) => (
                    <span key={line} className={`intro-line block w-fit${i >= 2 ? " text-gradient" : ""}`}>
                      {line}
                    </span>
                  ))}
                  <span aria-hidden className="intro-plane">
                    <svg viewBox="0 0 64 64" fill="none" className="size-full">
                      <path d="M58 8 6 30l18 7z" fill="#ff5c8f" />
                      <path d="M58 8 24 37l4 19 8-12z" fill="#b9124f" />
                      <path d="M58 8 36 44l14 7z" fill="#ff9dbd" />
                    </svg>
                  </span>
                </h2>
                <div className="intro-fade relative mt-10 h-56 sm:h-64 lg:h-[32vh] lg:min-h-[240px]">
                  <LocalCanvas className="absolute inset-0 lg:-left-[6%] lg:w-[112%]">
                    <IntroTrio dark={dark} />
                  </LocalCanvas>
                </div>
              </div>

              <div className="intro-read intro-fade lg:col-span-7 lg:pl-6 xl:pl-12">
                <div className="flex flex-col gap-6 font-medium text-[clamp(1.3rem,1rem+1.25vw,1.95rem)] leading-[1.32] tracking-[-0.01em] lg:gap-7">
                  {paragraphs.map((words, pi) => (
                    <p key={pi}>
                      {words.map((w, wi) => (
                        <span key={wi} className="read-word" data-on="0">
                          {w}{" "}
                        </span>
                      ))}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
