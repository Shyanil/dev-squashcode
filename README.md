# SquashCode — Homepage

Premium, 3D-driven homepage for [SquashCode](https://www.squashcode.com), a Kolkata-based growth marketing, creative and technology agency. Visual and motion direction is inspired by twain.ai; brand, content and assets are SquashCode's own.

## Stack

- **Next.js 16** (App Router, Turbopack, Cache Components) · **React 19** · **TypeScript**
- **Tailwind CSS 4** (design tokens in `src/app/globals.css`)
- **Three.js r187** via **React Three Fiber 9** + **drei 10** — one shared WebGL canvas, each 3D moment is a drei `View`
- **GSAP 3.15** (ScrollTrigger, SplitText, MotionPath, DrawSVG) + **Lenis** smooth scroll
- Fonts: Clash Display (display), Satoshi (body), DM Mono (labels) — self-hosted in `src/fonts`

## Scripts

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the build
npm run lint
```

## Structure

```
src/app/            layout (fonts, metadata, JSON-LD), page, global styles, favicons
src/lib/content.ts  ALL site copy, services, projects, stats, testimonials, contact details
src/lib/gsap.ts     GSAP plugin registration + easing/entrance vocabulary
src/components/
  providers/        Lenis smooth scroll + GSAP ticker
  ui/               Button (magnetic), SplitHeading, Reveal, Cursor, StageDots, Marquee, Counter, Icons
  three/            Canvas3D (shared context), HeroStack, LogoSheet, ServicesOrbit, Aurora, GlassSheet, Lights
  sections/         Preloader, Nav, Hero, TrustedBy, Intro, Services, Approach, Work, Why, Results, Testimonials, FinalCta, Footer
public/brand/       transparent logo, wordmark, swirl mark, icons
public/clients/     client logos (white, transparent)
public/work/        screenshots of live client websites
public/testimonials client photos
```

## Content

Everything editable lives in `src/lib/content.ts`. Statistics, testimonials, client logos, awards and contact details were taken from the live squashcode.com site; featured projects are live sites built by SquashCode (linked directly).

## Notes

- Reduced-motion users get static content with no WebGL or scroll animations.
- WebGL is loaded after hydration (dynamic imports) and only renders scenes that are on screen.
- Mobile uses a lighter 3D setup (fewer sheets, no sparkles, dpr 1) and purpose-built layouts for services, approach and the stacked value cards.

# dev-squashcode
