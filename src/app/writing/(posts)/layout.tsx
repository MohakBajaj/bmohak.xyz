import { ArticleToc } from "@/components/article-toc";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { SITE_CONTAINER } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * A post is prose, not a titled index, so it takes the scrolling shell but
 * not PageShell's heading block — the MDX supplies its own h1.
 *
 * Everything renders inside one typeset container; the markdown carries no
 * classes of its own. Width is capped in ems so the measure holds at roughly
 * 70 characters whatever the base size is.
 */
const PostLayout = ({ children }: LayoutProps<"/writing">) => (
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
      <article className="typeset typeset-docs">{children}</article>
    </main>

    <ArticleToc />
    <SiteFooter />
  </div>
);

export default PostLayout;
