export interface Craft {
  slug: string;
  title: string;
  /** One line, under the title. The idea, not the implementation. */
  tagline: string;
  year: number;
}

/**
 * Add the MDX file under src/app/crafts/(crafts)/<slug>/page.mdx, add the row
 * here. Same deal as writing.ts: no filesystem glob, one list to read, and the
 * order on the page is the order here.
 */
export const crafts: Craft[] = [
  {
    slug: "step-grid",
    tagline: "Sixteen steps, four voices, one sample.",
    title: "Step Grid",
    year: 2026,
  },
];

export const craftNavItems = crafts.map((craft) => ({
  href: `/crafts/${craft.slug}`,
  title: craft.title,
}));
