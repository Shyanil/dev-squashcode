"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

export const THEME_KEY = "sc-theme";

/**
 * Runs in <head> before paint. Every new visit lands in light mode; a dark choice
 * only lasts for the current tab session (so reloads don't flash back to white).
 */
export const themeInitScript = `try{localStorage.removeItem("${THEME_KEY}");if(sessionStorage.getItem("${THEME_KEY}")==="dark")document.documentElement.setAttribute("data-theme","dark")}catch(e){}`;

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const isDark = () => document.documentElement.dataset.theme === "dark";

export function ThemeToggle({ className }: { className?: string }) {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);

  const toggle = () => {
    const html = document.documentElement;
    const next = dark ? "light" : "dark";
    html.classList.add("theme-anim");
    if (next === "dark") html.setAttribute("data-theme", "dark");
    else html.removeAttribute("data-theme");
    try {
      sessionStorage.setItem(THEME_KEY, next);
    } catch {}
    window.setTimeout(() => html.classList.remove("theme-anim"), 500);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      data-cursor="link"
      className={cn(
        "relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-full border border-fg/10 text-ink transition-colors duration-300 hover:border-pink hover:text-pink-2",
        className,
      )}
    >
      {/* sun */}
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className={cn("absolute size-[18px] transition-all duration-500 ease-out-expo", dark ? "translate-y-6 rotate-90 opacity-0" : "translate-y-0 rotate-0 opacity-100")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
      </svg>
      {/* moon */}
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className={cn("absolute size-[18px] transition-all duration-500 ease-out-expo", dark ? "translate-y-0 rotate-0 opacity-100" : "-translate-y-6 -rotate-90 opacity-0")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" />
      </svg>
    </button>
  );
}
