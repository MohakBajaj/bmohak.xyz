"use client";

import { PointerLink } from "@/components/pointer-link";
import { StepGridLive } from "@/components/registry/step-grid-stage";
import { crafts } from "@/lib/crafts";

export const CraftGallery = () => (
  <ul className="grid gap-12">
    {crafts.map((craft) => (
      <li className="grid gap-4" key={craft.slug}>
        <PointerLink href={`/crafts/${craft.slug}`}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h2 className="font-medium text-balance group-hover:underline group-hover:underline-offset-4">
              {craft.title}
            </h2>
            <span className="text-muted-foreground text-xs tabular-nums">
              {craft.year}
            </span>
          </div>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed text-pretty">
            {craft.tagline}
          </p>
        </PointerLink>
        {/* ponytail: one craft, one live preview. Map slug -> component when there are more. */}
        {craft.slug === "step-grid" && <StepGridLive />}
      </li>
    ))}
  </ul>
);
