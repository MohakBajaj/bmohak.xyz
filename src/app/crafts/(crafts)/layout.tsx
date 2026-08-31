import Link from "next/link";

import { ArticleToc } from "@/components/article-toc";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { SITE_CONTAINER } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * A craft is a write-up with a live thing at the top, so it takes the
 * scrolling shell and typeset, plus two pieces of chrome the other pages do
 * not need: the line nav for moving between crafts, and the TOC minimap,
 * which parks itself against the right edge on wide viewports only.
 */
const CraftLayout = ({ children }: LayoutProps<"/crafts">) => (
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
      <Link
        className="text-muted-foreground hover:text-foreground inline-flex min-h-10 items-center text-xs transition-colors"
        href="/crafts"
      >
        ← Crafts
      </Link>

      {/* CraftNav is parked, not deleted: with one craft there is nothing to
          navigate between. Put it back beside the article when there are
          three or four. */}
      <div className="mt-6 flex gap-10">
        <article className="typeset typeset-docs min-w-0">{children}</article>
      </div>
    </main>

    <ArticleToc />
    <SiteFooter />
  </div>
);

export default CraftLayout;
