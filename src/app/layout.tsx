import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { DM_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/content";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { themeInitScript } from "@/components/ui/ThemeToggle";

const clash = localFont({
  src: [
    { path: "../fonts/ClashDisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/ClashDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/ClashDisplay-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/ClashDisplay-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-clash",
  display: "swap",
});

const satoshi = localFont({
  src: [
    { path: "../fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Satoshi-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

const title = "SquashCode | Growth Marketing, Creative & Technology Agency in Kolkata";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s | SquashCode" },
  description: site.description,
  keywords: [
    "growth marketing agency Kolkata",
    "digital marketing company Kolkata",
    "SEO agency Kolkata",
    "performance marketing",
    "website design and development",
    "app development",
    "branding agency",
    "B2B lead generation",
    "SquashCode",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.name,
    title,
    description: site.description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "SquashCode — Great Marketing Drives Growth" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/brand/logo.png`,
  email: site.email,
  telephone: site.phones[0].label,
  description: site.description,
  sameAs: site.socials.map((s) => s.href),
  address: site.addresses.map((a) => ({
    "@type": "PostalAddress",
    streetAddress: a.lines[0],
    addressLocality: "Kolkata",
    addressRegion: "West Bengal",
    postalCode: a.lines[1].replace(/\D/g, ""),
    addressCountry: "IN",
  })),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${clash.variable} ${satoshi.variable} ${dmMono.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-ink font-sans">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
