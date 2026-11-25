import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { CompanyIcon } from "./company-icon";
import { getLifelineEventKey, LifelineEventText } from "./lifeline-event";
import { hasMarkerContent } from "./lifeline-utils";
import type { LifelineMarker } from "./types";

/*
  The timeline with nothing but HTML and CSS, for readers without JavaScript.
  Same grid as the vertical layout (age | rail | content) so it reads as the
  same object, not a different page. Two choices differ on purpose:

  - Newest first. There is no intro sweep to carry the reader to the present,
    and the top of a list is where people actually read.
  - Empty years are dropped. The interactive rail keeps them as spacing; a
    static list just makes you scroll past them.

  Year headings are `position: sticky`, so a year stays named while its
  months scroll under it, the same behaviour the interactive rail has.
*/

const GRID = "grid grid-cols-[2.5rem_1rem_1fr] gap-x-3";
const RAIL_LEFT = "calc(2.5rem + 0.75rem + 0.5rem)";

interface YearGroup {
  marker: LifelineMarker;
  months: LifelineMarker[];
}

const groupByYear = (markers: LifelineMarker[]) => {
  const years: YearGroup[] = [];
  for (const marker of markers) {
    if (Number.isInteger(marker.year)) {
      years.push({ marker, months: [] });
    } else if (hasMarkerContent(marker)) {
      years.at(-1)?.months.push(marker);
    }
  }
  return years
    .filter((year) => hasMarkerContent(year.marker) || year.months.length > 0)
    .toReversed()
    .map((year) => ({ ...year, months: year.months.toReversed() }));
};

const Events = ({ marker }: { marker: LifelineMarker }) => (
  <div className="min-w-0 space-y-3 pt-3 pb-8">
    {marker.companies && marker.companies.length > 0 && (
      <div className="flex items-center gap-1.5 text-zinc-500">
        {marker.companies.map((company) => (
          <CompanyIcon key={company.id} id={company.id} label={company.name} />
        ))}
      </div>
    )}
    {marker.events.map((event, index) => (
      <p
        key={getLifelineEventKey(event, index)}
        className="max-w-[60ch] text-[14px] leading-[1.6] tracking-[-0.01em] text-pretty text-zinc-600 dark:text-zinc-400"
      >
        <LifelineEventText event={event} />
      </p>
    ))}
  </div>
);

export const LifelineStatic = ({
  markers,
  birthYear,
  lead,
}: {
  markers: LifelineMarker[];
  birthYear: number;
  /** A sentence or two above the rail: who this is, in plain words. */
  lead?: ReactNode;
}) => {
  const years = groupByYear(markers);

  return (
    <section
      aria-label="Timeline"
      className="lifeline-typeset mx-auto w-full max-w-xl px-5 pt-8 pb-20 md:pt-14"
    >
      <header className="mb-10 space-y-4">
        <p className="flex items-center gap-2 text-[11px] leading-4 font-medium tracking-[0.08em] text-zinc-500 uppercase">
          <span>Timeline</span>
          <span
            aria-hidden="true"
            className="h-px w-6 bg-zinc-300 dark:bg-zinc-700"
          />
          <span className="tracking-normal normal-case">
            Plain view, JavaScript is off
          </span>
        </p>
        {lead && (
          <div className="text-[17px] leading-[1.55] tracking-[-0.015em] text-pretty text-zinc-800 dark:text-zinc-200">
            {lead}
          </div>
        )}
      </header>

      <div className={cn(GRID, "mb-4")}>
        <p className="text-right text-[11px] leading-4 font-medium tracking-[0.08em] text-zinc-500 uppercase dark:text-zinc-600">
          Age
        </p>
        <div />
        <p className="text-[11px] leading-4 font-medium tracking-[0.08em] text-zinc-500 uppercase dark:text-zinc-600">
          Year
        </p>
      </div>

      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute top-0 bottom-0 w-px -translate-x-1/2 border-l border-dashed border-zinc-300 dark:border-zinc-800"
          style={{ left: RAIL_LEFT }}
        />

        <ol>
          {years.map(({ marker, months }, index) => (
            <li key={marker.id} aria-label={`${marker.year}`}>
              {/* Sticky within its own <li>, so the next year pushes it out. */}
              <div
                className={cn(
                  GRID,
                  "sticky top-0 z-10 items-center bg-white py-2 dark:bg-black"
                )}
              >
                <p className="text-right text-[11px] leading-4 font-medium text-zinc-500 tabular-nums dark:text-zinc-600">
                  {marker.age ?? marker.year - birthYear}
                </p>
                <div className="flex items-center justify-center">
                  {index === 0 ? (
                    // The newest year carries the same pulse as the live rail.
                    <span
                      aria-hidden="true"
                      className="lifeline-now-node-vertical text-emerald-500"
                    >
                      <span className="lifeline-now-core" />
                      <span className="lifeline-now-ring" />
                    </span>
                  ) : (
                    <span
                      aria-hidden="true"
                      className="block h-px w-[10px] bg-zinc-400 dark:bg-zinc-700"
                    />
                  )}
                </div>
                <h2
                  className={cn(
                    "text-[15px] leading-5 font-medium tabular-nums",
                    index === 0
                      ? "text-zinc-900 dark:text-zinc-100"
                      : "text-zinc-500 dark:text-zinc-400"
                  )}
                >
                  {marker.year}
                </h2>
              </div>

              {hasMarkerContent(marker) && (
                <div className={GRID}>
                  <div />
                  <div />
                  <Events marker={marker} />
                </div>
              )}

              {months.map((month) => (
                <div key={month.id} className={GRID}>
                  <div />
                  <div className="flex justify-center pt-[9px]">
                    <span
                      aria-hidden="true"
                      className="block h-px w-[6px] bg-zinc-400 dark:bg-zinc-700"
                    />
                  </div>
                  <div>
                    <h3 className="text-[12px] leading-5 font-medium tracking-[0.04em] text-zinc-500 uppercase">
                      {month.label}
                    </h3>
                    <Events marker={month} />
                  </div>
                </div>
              ))}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
