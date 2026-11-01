"use client";

import { useRef, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useIsDesktop } from "@/lib/hooks";
import { useScrollTo } from "@/components/providers/SmoothScroll";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowUpRight } from "./Icons";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "white";
  size?: "md" | "lg";
  className?: string;
  icon?: "arrow" | "external" | "none";
  onClick?: () => void;
};

export function Button({ href, children, variant = "primary", size = "md", className, icon = "arrow", onClick }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const desktop = useIsDesktop();
  const scrollTo = useScrollTo();
  const isHash = href.startsWith("#");
  const isExternal = /^https?:\/\//.test(href);

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (!desktop || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    gsap.to(ref.current, { x: x * 0.22, y: y * 0.3, duration: 0.6, ease: "power3.out" });
  };
  const onLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
  };
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.();
    if (isHash) {
      e.preventDefault();
      scrollTo(href);
    }
  };

  const Icon = icon === "external" ? ArrowUpRight : ArrowRight;

  return (
    <a
      ref={ref}
      href={href}
      onClick={handleClick}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      data-cursor="link"
      className={cn(
        "group relative inline-flex items-center gap-3 rounded-full font-medium tracking-[-0.01em] select-none will-change-transform transition-[background-color,border-color,box-shadow,color] duration-300 ease-out-cubic",
        size === "lg" ? "h-14 px-7 text-[15px]" : "h-12 px-6 text-[14px]",
        variant === "primary" &&
          "bg-pink text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset,0_10px_30px_-10px_rgba(232,40,98,0.7)] hover:bg-pink-2 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.14)_inset,0_16px_40px_-12px_rgba(255,77,138,0.8)]",
        variant === "ghost" &&
          "border border-line-2 text-ink hover:border-fg/40 hover:bg-fg/[0.04]",
        variant === "white" && "bg-ink text-bg hover:bg-pink hover:text-white",
        className,
      )}
    >
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-[110%]">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 block translate-y-[110%] transition-transform duration-500 ease-out-expo group-hover:translate-y-0"
        >
          {children}
        </span>
      </span>
      {icon !== "none" && (
        <span className="relative grid size-6 place-items-center overflow-hidden rounded-full bg-fg/10">
          <Icon className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-[120%]" />
          <Icon className="absolute size-4 -translate-x-[120%] transition-transform duration-500 ease-out-expo group-hover:translate-x-0" />
        </span>
      )}
    </a>
  );
}
