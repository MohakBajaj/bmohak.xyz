"use client";

import { Favicon } from "@/components/favicon";
import { Lifeline } from "@/components/lifeline";
import { registerCompanyIcons } from "@/components/lifeline/company-icon";
import { LifelineStatic } from "@/components/lifeline/lifeline-static";
import { mohak } from "@/lib/lifelines/mohak";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** A company mark in its own colour, the same way the About page draws it. */
const mark = (file: string) => {
  const Mark = ({ className }: { className?: string }) => (
    <Favicon
      className={cn("size-3.5", className)}
      icon={`/favicons/${file}.png`}
      label={file}
    />
  );
  return { icon: Mark };
};

/*
  Module scope, and imported by the only thing that renders the timeline —
  the registry has to be populated before the first marker paints or the
  company falls back to its initial. plutosONE has no usable favicon, so it
  keeps the initial on purpose.
*/
registerCompanyIcons({
  cambrianedge: mark("cambrianedge"),
  gutenberg: mark("gutenberg"),
  upes: mark("upes"),
});

export const Timeline = () => (
  <Lifeline
    birthYear={mohak.birthYear}
    fallback={
      /*
        <noscript>, so only readers without JavaScript get it. Sent to
        everyone, it flashed in the middle of the page while scripts loaded
        and then got swapped out from under the intro. Crawlers and agents
        that skip scripts parse it as ordinary HTML.
      */
      <noscript>
        <LifelineStatic
          birthYear={mohak.birthYear}
          lead={site.intro}
          markers={mohak.markers}
        />
      </noscript>
    }
    markers={mohak.markers}
    title={mohak.name}
  />
);
