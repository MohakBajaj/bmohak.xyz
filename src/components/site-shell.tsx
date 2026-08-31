import type { ReactNode } from "react";

import { DecodeText } from "@/components/decode-text";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { SITE_CONTAINER } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Two shells, because the two page shapes want opposite height rules — the
 * same split haydenbleasel.com makes between its home layout and its page
 * layout.
 *
 * The surfaces are literal white/black rather than the background token so
 * they line up exactly with lifeline's own hard-coded `bg-white dark:bg-black`
 * sticky label column. Same reason the theme fade is a plain `transition-
 * colors` everywhere: legacy sRGB on one curve.
 */
const SURFACE =
  "bg-white text-black antialiased transition-colors duration-300 dark:bg-black dark:text-white";

/**
 * The timeline owns the viewport. `h-dvh` is a definite height, which is the
 * whole point: `min-h-*` leaves every descendant height indefinite, so the
 * lifeline's `height: 100%` resolves to nothing and it collapses to its
 * content. Scrolling belongs to <main> on small screens and to the rail's own
 * horizontal scrub from `md` up, which is why the scroller is dropped there.
 */
export const HomeShell = ({ children }: { children: ReactNode }) => (
  <div className={cn("flex h-dvh flex-col overflow-hidden", SURFACE)}>
    <SiteNav />
    {/* scroll-fade masks the edge of the one real scroller here: below
        md the vertical timeline scrolls in this box. Above md the scroller
        is dropped and the mask has nothing to key off, which is correct. */}
    <main
      className="scroll-fade min-h-0 flex-1 overflow-y-auto pt-[calc(3rem+env(safe-area-inset-top,0px))] md:overflow-hidden"
      id="content"
      tabIndex={-1}
    >
      {children}
    </main>
    <SiteFooter floating />
  </div>
);

/**
 * Everything else is ordinary prose that scrolls the document. `min-h-dvh`
 * keeps the footer at the bottom on a short page without pinning it.
 * `pt-24` clears the fixed nav.
 */
export const PageShell = ({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title: string;
  description: string;
}) => (
  <div className={cn("flex min-h-dvh flex-col", SURFACE)}>
    <SiteNav />

    <main
      className={cn(
        SITE_CONTAINER,
        "max-w-xl flex-1 pt-[calc(6rem+env(safe-area-inset-top,0px))] pb-16"
      )}
      id="content"
      tabIndex={-1}
    >
      {/* The one place the 12/14 rule is relaxed, matching
          haydenbleasel.com: a page needs a title that reads as one, and at
          14px it was indistinguishable from the prose under it. Meta and
          chrome stay on the two-step scale. */}
      <h1 className="font-heading page-enter-self text-sm font-medium tracking-tight text-balance">
        <DecodeText text={title} trigger="mount" />
      </h1>
      <p className="text-muted-foreground page-enter-self mt-2 text-sm leading-relaxed text-pretty [animation-delay:80ms]">
        {description}
      </p>

      <div className="mt-10">{children}</div>
    </main>

    <SiteFooter />
  </div>
);
