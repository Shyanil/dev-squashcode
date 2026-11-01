import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Marquee({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("marquee mask-fade-x overflow-hidden", className)}>
      <div className="marquee-track">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex shrink-0 items-center" aria-hidden={i > 0}>
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
