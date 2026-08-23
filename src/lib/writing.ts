export interface Post {
  title: string;
  description: string;
  /** Publication year. Posts group by this, newest year first. */
  year: number;
  /** Sort key within a year. ISO date. */
  date: string;
  /** Where it was published. "bmohak.xyz" for posts that live here. */
  source: string;
  /** Internal route for MDX posts, absolute URL for everything else. */
  href: string;
}

/**
 * Both kinds of post live in this one list: entries pointing at pieces
 * published elsewhere, and entries pointing at MDX under
 * src/app/writing/(posts)/<slug>/page.mdx.
 *
 * There is no filesystem glob — add the MDX file, add the row. One place
 * to look, and the year grouping stays under your control.
 *
 * TODO(mohak): one post so far. Add your published pieces (LinkedIn essays,
 * talk write-ups) as external entries with an absolute href.
 */
export const posts: Post[] = [
  {
    date: "2026-08-23",
    description:
      "Why this site is a timeline instead of a hero section, and what it is actually built out of.",
    href: "/writing/hello-world",
    source: "bmohak.xyz",
    title: "Hello, world",
    year: 2026,
  },
];

export const isExternal = (post: Post) => post.href.startsWith("http");

/** Years newest first, posts inside each year newest first. */
export const postsByYear = () => {
  const years = new Map<number, Post[]>();

  for (const post of posts.toSorted((a, b) => b.date.localeCompare(a.date))) {
    const bucket = years.get(post.year);
    if (bucket) {
      bucket.push(post);
    } else {
      years.set(post.year, [post]);
    }
  }

  return [...years.entries()].toSorted(([a], [b]) => b - a);
};
