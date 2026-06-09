import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Draft Studio — Precision Web Studio",
    template: "%s — Draft Studio",
  },
  description:
    "Precision web design & development for established brands and companies ready for world-class results. Based in Mexico, working globally.",
  keywords: [
    "web design", "web development", "diseño web", "desarrollo web",
    "branding", "SEO", "Next.js", "Mexico", "Draft Studio",
  ],
  authors:  [{ name: "Draft Studio", url: "https://draftstudio.mx" }],
  creator:  "Draft Studio",
  metadataBase: new URL("https://draftstudio.mx"),
  openGraph: {
    type:            "website",
    locale:          "es_MX",
    alternateLocale: "en_US",
    url:             "https://draftstudio.mx",
    siteName:        "Draft Studio",
    title:           "Draft Studio — Precision Web Studio",
    description:     "Precision web design & development for established brands. Based in Mexico, working globally.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Draft Studio" }],
  },
  twitter: {
    card:        "summary_large_image",
    site:        "@draftstudio_mx",
    creator:     "@draftstudio_mx",
    title:       "Draft Studio — Precision Web Studio",
    description: "Precision web design & development for established brands. Based in Mexico, working globally.",
    images:      ["/og-image.jpg"],
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

/**
 * Root layout — provides <html>, <body>, and a base NextIntlClientProvider.
 * The [locale]/layout.tsx adds its own scoped provider on top (nested providers are fine).
 * suppressHydrationWarning allows [locale]/layout to set lang dynamically.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Base provider so top-level routes (app/page.tsx, app/contact/page.tsx, etc.)
  // can use next-intl hooks without their own layout wrapper.
  const messages = await getMessages();

  return (
    <html suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Performance: preconnect to Sanity CDN */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        {/* Theme color — light / dark */}
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#F1EEE5" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)"  content="#0E0E12" />
      </head>
      <body className="min-h-screen antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
