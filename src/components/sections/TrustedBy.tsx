import Image from "next/image";
import { clients } from "@/lib/content";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";

export function TrustedBy() {
  return (
    <section aria-label="Trusted by" className="relative pt-6 pb-12 lg:pt-6 lg:pb-16">
      <div className="container-x">
        <Reveal className="flex items-center gap-6">
          <Eyebrow>Trusted by brands and institutions</Eyebrow>
          <span className="h-px flex-1 bg-line" />
        </Reveal>
      </div>
      <Reveal delay={0.15} className="mt-8 lg:mt-10">
        <Marquee>
          {clients.map((c) => (
            <div key={c.name} className="group mx-9 flex h-12 items-center lg:mx-14" title={c.name}>
              <Image
                src={c.src}
                alt={c.name}
                width={c.w}
                height={c.h}
                className="h-7 w-auto brightness-0 opacity-45 transition-[opacity,transform] duration-500 ease-out-cubic group-hover:scale-[1.04] group-hover:opacity-90 lg:h-8 dark:invert dark:opacity-50 dark:group-hover:opacity-100"
              />
            </div>
          ))}
        </Marquee>
      </Reveal>
    </section>
  );
}
