import type { MetadataRoute } from "next";

import { crafts } from "@/lib/crafts";
import { site } from "@/lib/site";
import { posts } from "@/lib/writing";

/**
 * Built from the same lists the pages render, so it cannot drift. External
 * writing entries are filtered out: they are somebody else's URL to declare.
 */
const url = (path: string) => new URL(path, site.url).toString();

const sitemap = (): MetadataRoute.Sitemap => [
  { changeFrequency: "monthly", priority: 1, url: url("/") },
  { changeFrequency: "monthly", priority: 0.8, url: url("/about") },
  { changeFrequency: "monthly", priority: 0.6, url: url("/crafts") },
  { changeFrequency: "monthly", priority: 0.6, url: url("/writing") },
  ...crafts.map((craft) => ({
    changeFrequency: "yearly" as const,
    priority: 0.5,
    url: url(`/crafts/${craft.slug}`),
  })),
  ...posts
    .filter((post) => post.href.startsWith("/"))
    .map((post) => ({
      changeFrequency: "yearly" as const,
      lastModified: new Date(post.date),
      priority: 0.5,
      url: url(post.href),
    })),
];

export default sitemap;
