"use client";

import { Lifeline } from "@/components/lifeline";
import { registerCompanyIcons } from "@/components/lifeline/company-icon";
import { mohak } from "@/lib/lifelines/mohak";
import { cn } from "@/lib/utils";

/**
 * A company mark, drawn the same way the About page draws them: a mask filled
 * with currentColor, so it inherits the rail's own colour and stays on the
 * site's two-tone palette instead of dragging a logo's brand colour onto it.
 */
const mark = (file: string) => {
  const Mark = ({ className }: { className?: string }) => (
    <span
      aria-hidden="true"
      className={cn("size-3.5 shrink-0 bg-current", className)}
      style={{
        maskImage: `url(/favicons/mono/${file}.png)`,
        maskPosition: "center",
        maskRepeat: "no-repeat",
        maskSize: "contain",
      }}
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
    markers={mohak.markers}
    title={mohak.name}
  />
);
