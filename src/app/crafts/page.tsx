import type { Metadata } from "next";

import { DecodeText } from "@/components/decode-text";
import { CraftGallery } from "@/components/registry/craft-gallery";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { SITE_CONTAINER } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  alternates: { canonical: "/crafts" },
  description:
    "Small interactive things, each built to work out one idea. Also a shadcn registry.",
  title: "Crafts",
};

const Crafts = () => (
  <div className="flex min-h-dvh flex-col bg-white text-black antialiased transition-colors duration-300 dark:bg-black dark:text-white">
    <SiteNav />

    <main
      className={cn(
        SITE_CONTAINER,
        "max-w-2xl flex-1 pt-[calc(6rem+env(safe-area-inset-top,0px))] pb-16"
      )}
      id="content"
      tabIndex={-1}
    >
      <h1 className="font-heading page-enter-self text-sm font-medium tracking-tight text-balance">
        <DecodeText text="Crafts" trigger="mount" />
      </h1>
      <p className="text-muted-foreground page-enter-self mt-2 text-sm leading-relaxed text-pretty [animation-delay:80ms]">
        Small interactive things, each built to work out one idea. They&apos;re{" "}
        <code className="font-mono text-[12px]">@bmohak</code> on the shadcn
        registry.
      </p>

      <div className="page-enter mt-10 [--page-enter-base:120ms]">
        <CraftGallery />
      </div>
    </main>

    <SiteFooter />
  </div>
);

export default Crafts;
