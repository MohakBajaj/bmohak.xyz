import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  JetBrains_Mono,
  Noto_Sans,
  Outfit,
} from "next/font/google";
import { ViewTransition } from "react";

import "./globals.css";
import { CommandK } from "@/components/command-k";
import { Haptics } from "@/components/haptics";
import { JsonLd } from "@/components/json-ld";
import { Playfield } from "@/components/playfield";
import { RouteCue } from "@/components/route-cue";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const outfitHeading = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

// typeset-docs preset fonts, consumed by .typeset-docs in globals.css
const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  description: site.description,
  /* Every relative URL in this object and in child routes resolves from here,
     so canonicals and OG images come out absolute without repeating the host. */
  metadataBase: new URL(site.url),
  /* No canonical and no og:url here on purpose: both are per-route, and a
     root-level value silently becomes every page's, which tells a crawler the
     whole site is a duplicate of the homepage. */
  openGraph: {
    description: site.description,
    locale: "en_IN",
    siteName: site.name,
    title: site.title,
    type: "profile",
  },
  robots: {
    follow: true,
    googleBot: { follow: true, index: true, "max-image-preview": "large" },
    index: true,
  },
  title: {
    /* Name first: "Mohak Bajaj" is the query this ranks for, and a search
       result truncates the tail, never the head. */
    default: site.title,
    template: `%s, ${site.name}`,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@MohakBajaj5",
    description: site.description,
    title: site.title,
  },
};

const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html
    className={cn(
      "h-full",
      geistSans.variable,
      geistMono.variable,
      notoSans.variable,
      jetbrainsMono.variable,
      outfitHeading.variable
    )}
    lang="en"
    suppressHydrationWarning
  >
    <body className="bg-background text-foreground min-h-dvh -tracking-[0.01em] transition-colors duration-300">
      <JsonLd />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
        enableSystem
      >
        <TooltipProvider>
          {/*
            `default="none"` so this wrapper does not get a view-transition-
            name. A name here snapshots the whole page box — thousands of
            pixels tall on About — and the group morph from that box (scrolled
            to the footer) to a short page is the footer flying. Nav and
            footer carry their own names; the root viewport just fades.
          */}
          <ViewTransition default="none">{children}</ViewTransition>
        </TooltipProvider>
        <Haptics />
        <RouteCue />
        <Playfield />
        <CommandK />
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
