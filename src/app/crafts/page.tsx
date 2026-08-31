import type { Metadata } from "next";

import { PointerLink } from "@/components/pointer-link";
import { PageShell } from "@/components/site-shell";
import { crafts } from "@/lib/crafts";

export const metadata: Metadata = {
  alternates: { canonical: "/crafts" },
  description:
    "Small interactive things, built to work out one idea and written up.",
  title: "Crafts",
};

const CRAFTS_INTRO =
  "Small interactive things, each built to work out one idea, each written up.";

const Crafts = () => (
  <PageShell description={CRAFTS_INTRO} title="Crafts">
    <ul className="page-enter grid grid-cols-[minmax(0,1fr)] gap-5 text-sm [--page-enter-base:120ms]">
      {crafts.map((craft) => (
        <li key={craft.slug}>
          <PointerLink href={`/crafts/${craft.slug}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h2 className="font-medium text-balance group-hover:underline group-hover:underline-offset-4">
                {craft.title}
              </h2>
              <span className="text-muted-foreground text-xs tabular-nums">
                {craft.year}
              </span>
            </div>
            <p className="text-muted-foreground mt-1 leading-relaxed text-pretty">
              {craft.tagline}
            </p>
          </PointerLink>
        </li>
      ))}
    </ul>
  </PageShell>
);

export default Crafts;
