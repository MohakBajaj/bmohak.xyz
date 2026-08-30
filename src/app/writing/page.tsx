import type { Metadata } from "next";
import Link from "next/link";

import { PageShell } from "@/components/site-shell";
import { site } from "@/lib/site";
import { isExternal, postsByYear } from "@/lib/writing";
import type { Post } from "@/lib/writing";

export const metadata: Metadata = {
  alternates: { canonical: "/writing" },
  description: "Postmortems, migrations, and the occasional thing that worked.",
  title: "Writing",
};

const PostRow = ({ post }: { post: Post }) => {
  const external = isExternal(post);

  const body = (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className="text-sm font-medium text-balance group-hover:underline group-hover:underline-offset-4">
          {post.title}
        </h3>
        <span className="text-muted-foreground text-xs">{post.source}</span>
      </div>
      <p className="text-muted-foreground mt-1 text-sm leading-relaxed text-pretty">
        {post.description}
      </p>
    </>
  );

  return (
    <li>
      {external ? (
        <a
          className="group block"
          href={post.href}
          rel="noopener noreferrer"
          target="_blank"
        >
          {body}
        </a>
      ) : (
        <Link className="group block" href={post.href}>
          {body}
        </Link>
      )}
    </li>
  );
};

const WRITING_INTRO =
  "Postmortems, migrations, and the occasional thing that worked.";

const Writing = () => {
  const years = postsByYear();

  return (
    <PageShell description={WRITING_INTRO} title="Writing">
      {years.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Nothing here yet. The shorter stuff goes to{" "}
          <a
            className="text-foreground underline underline-offset-4"
            href={site.socials[1].href}
            rel="noopener noreferrer"
            target="_blank"
          >
            X
          </a>
          .
        </p>
      ) : (
        <div className="page-enter space-y-8 [--page-enter-base:120ms]">
          {years.map(([year, yearPosts]) => (
            <section key={year}>
              <h2 className="text-muted-foreground font-mono text-xs tabular-nums">
                {year}
              </h2>
              <ul className="mt-3 space-y-5">
                {yearPosts.map((post) => (
                  <PostRow key={post.href} post={post} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </PageShell>
  );
};

export default Writing;
