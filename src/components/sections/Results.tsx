import Image from "next/image";
import { results, site } from "@/lib/content";
import { Counter } from "@/components/ui/Counter";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { ArrowUpRight } from "@/components/ui/Icons";

function Trophy({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
      <path d="M7 6H4.5a1 1 0 0 0-1 1 3.5 3.5 0 0 0 3.5 3.5M17 6h2.5a1 1 0 0 1 1 1 3.5 3.5 0 0 1-3.5 3.5" />
      <path d="M12 13v3M8.5 20h7M10 16.5h4l.5 3.5h-5z" />
    </svg>
  );
}

export function Results() {
  return (
    <section id="results" className="relative overflow-hidden py-24 lg:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-2/60 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[40rem] w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(232,40,98,0.16),transparent_70%)] blur-3xl" />

      <div className="container-x relative">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow index="06">Results & achievements</Eyebrow>
            </Reveal>
            <SplitHeading as="h2" className="display-lg mt-5">
              {results.title}
            </SplitHeading>
          </div>
          <Reveal className="lg:col-span-5 lg:pb-2">
            <p className="lead">{results.text}</p>
          </Reveal>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-line pt-12 lg:mt-20 lg:grid-cols-4 lg:pt-14">
          {results.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} as="div" className="flex flex-col">
              <dd className="display-xl order-1 leading-none">
                <Counter value={s.value} suffix={s.suffix} />
              </dd>
              <dt className="order-2 mt-4 flex items-center gap-3 text-ink-2">
                <span className="h-px w-6 bg-pink-2" />
                {s.label}
              </dt>
            </Reveal>
          ))}
        </dl>

        <Reveal cascade className="mt-16 grid gap-4 md:grid-cols-3 lg:mt-24">
          {results.awards.map((a) => (
            <div key={a.title} className="glass flex flex-col gap-6 rounded-[1.5rem] p-6 lg:p-7">
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-full border border-fg/10 text-pink-2">
                  <Trophy className="size-5" />
                </span>
                <span className="font-mono text-xs tracking-[0.2em] text-ink-3">{a.year}</span>
              </div>
              <div>
                <h3 className="font-display text-xl font-medium leading-snug tracking-[-0.01em]">{a.title}</h3>
                <p className="mt-2 text-sm text-ink-2">{a.by}</p>
              </div>
            </div>
          ))}
          <a
            href={site.googlePartner}
            target="_blank"
            rel="noopener noreferrer"
            className="group glass flex flex-col gap-6 rounded-[1.5rem] p-6 transition-colors hover:border-fg/20 lg:p-7"
          >
            <div className="flex items-center justify-between">
              <Image src="/awards/google-partner.svg" alt="Google Partner badge" width={44} height={42} className="h-11 w-auto" />
              <ArrowUpRight className="size-5 text-ink-3 transition-[color,transform] duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
            </div>
            <div>
              <h3 className="font-display text-xl font-medium leading-snug tracking-[-0.01em]">Google Partner</h3>
              <p className="mt-2 text-sm text-ink-2">Verified agency on the Google Partners directory.</p>
            </div>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
