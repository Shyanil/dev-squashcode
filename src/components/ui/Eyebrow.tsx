import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Eyebrow({ children, index, className }: { children: ReactNode; index?: string; className?: string }) {
  return (
    <span className={cn("eyebrow", className)}>
      {index ? <span className="text-pink-2">{index}</span> : <span className="size-1.5 rounded-full bg-pink animate-pulse-dot" />}
      <span>{children}</span>
    </span>
  );
}
