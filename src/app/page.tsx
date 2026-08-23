import type { Metadata } from "next";

import { HomeShell } from "@/components/site-shell";
import { Timeline } from "@/components/timeline";
import { site } from "@/lib/site";

/*
  No wrapper and no fixed height around the Lifeline: it is a direct child of
  the shell's <main>, which is `min-h-0 flex-1` inside an `h-dvh` column. That
  chain is definite all the way down, so the timeline's own `h-full` resolves
  and it centres itself in whatever is left between the nav and the footer.

  `mode` is left at its default. It measures, and inside a shell that owns the
  viewport with nothing behind it to scroll, that resolves to page mode — the
  rail takes the wheel on desktop, <main> scrolls the vertical layout below md.

  The heading is visually hidden: a page with no h1 is a real defect for
  screen readers even when the design calls for no visible title.
*/
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

const Home = () => (
  <HomeShell>
    <header className="sr-only">
      <h1>{site.name}</h1>
      <p>{site.intro}</p>
    </header>

    <Timeline />
  </HomeShell>
);

export default Home;
