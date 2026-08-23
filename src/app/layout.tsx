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
import { Haptics } from "@/components/haptics";
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
  description: site.description,
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
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
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
        enableSystem
      >
        <TooltipProvider>
          <ViewTransition>{children}</ViewTransition>
        </TooltipProvider>
        <Haptics />
        <RouteCue />
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
