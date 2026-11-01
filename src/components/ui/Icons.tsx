import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...p,
});

export const ArrowUpRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
);
export const ArrowRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);
export const ArrowDown = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14" />
    <path d="m6 13 6 6 6-6" />
  </svg>
);
export const Plus = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

/* ---- service glyphs ---- */
export const GlyphSeo = (p: P) => (
  <svg {...base(p)}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m20 20-4.4-4.4" />
    <path d="M7.5 12.5v-2M10.5 12.5v-4M13.5 12.5v-6" />
  </svg>
);
export const GlyphPpc = (p: P) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7.5" />
    <circle cx="11" cy="11" r="3" />
    <path d="M11 1.5v3M11 17.5v3M1.5 11h3M17.5 11h3" />
    <path d="m14 14 6.5 2.3-2.6 1.2-1.2 2.6z" fill="currentColor" stroke="none" />
  </svg>
);
export const GlyphSocial = (p: P) => (
  <svg {...base(p)}>
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="6" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
    <path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6" />
  </svg>
);
export const GlyphEmail = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="6" width="18" height="13" rx="2.5" />
    <path d="m3.5 7.5 8.5 6 8.5-6" />
    <path d="M7 3.5h10" opacity=".5" />
  </svg>
);
export const GlyphWeb = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <path d="M3 9h18" />
    <path d="M6.5 6.5h.01M9 6.5h.01" />
    <path d="M7 13h4v4H7zM14 13h3M14 16h3" />
  </svg>
);
export const GlyphApp = (p: P) => (
  <svg {...base(p)}>
    <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
    <path d="M10.5 18.5h3" />
    <path d="M12 8v4M10 10h4" />
  </svg>
);
export const GlyphBrand = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 20c0-5 3-9 8-12l8-4-4 8c-3 5-7 8-12 8z" />
    <path d="M9.5 14.5 4 20" />
    <circle cx="14" cy="10" r="1" fill="currentColor" stroke="none" />
  </svg>
);
export const GlyphB2b = (p: P) => (
  <svg {...base(p)}>
    <path d="M3.5 4.5h17l-6.5 8v6l-4 2v-8z" />
    <path d="M7 8h10" opacity=".5" />
  </svg>
);

export const glyphs = {
  seo: GlyphSeo,
  ppc: GlyphPpc,
  social: GlyphSocial,
  email: GlyphEmail,
  web: GlyphWeb,
  app: GlyphApp,
  brand: GlyphBrand,
  b2b: GlyphB2b,
} as const;

/* ---- social ---- */
export const LinkedIn = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M6.5 8.5A1.5 1.5 0 1 1 6.5 5.5a1.5 1.5 0 0 1 0 3ZM5.2 10h2.6v9H5.2v-9Zm4.4 0h2.5v1.3c.4-.7 1.3-1.5 2.8-1.5 2.9 0 3.5 1.9 3.5 4.4V19h-2.6v-4.2c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2V19H9.6v-9Z" />
  </svg>
);
export const Instagram = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17" cy="7" r=".9" fill="currentColor" stroke="none" />
  </svg>
);
export const Facebook = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.3-1.5 1.5-1.5h1.5V5.1c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H8v3h2.6v7h2.9Z" />
  </svg>
);
export const socialIcons = { linkedin: LinkedIn, instagram: Instagram, facebook: Facebook } as const;
