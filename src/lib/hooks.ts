"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

function subscribeMedia(query: string, cb: () => void) {
  const mql = window.matchMedia(query);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
}

/** SSR-safe media query (false on the server). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => subscribeMedia(query, cb),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** Desktop = wide viewport with a fine pointer. */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
}

export function useIsLarge(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}

export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return mounted;
}

/** Simple WebGL capability check, evaluated once on the client. */
export function useWebGL(): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    let supported = false;
    try {
      const c = document.createElement("canvas");
      supported = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      supported = false;
    }
    const id = requestAnimationFrame(() => setOk(supported));
    return () => cancelAnimationFrame(id);
  }, []);
  return ok;
}


function subscribeTheme(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

/** true while the site is in dark mode (data-theme="dark" on <html>). */
export function useDarkTheme(): boolean {
  return useSyncExternalStore(
    subscribeTheme,
    () => document.documentElement.dataset.theme === "dark",
    () => false,
  );
}
