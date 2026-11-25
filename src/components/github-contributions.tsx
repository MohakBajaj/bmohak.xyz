"use client";

import { format } from "date-fns";
import { use, type CSSProperties } from "react";

import type { Activity } from "@/components/contribution-graph";
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/components/contribution-graph";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const label = (activity: Activity) =>
  `${activity.count} contribution${activity.count > 1 ? "s" : ""} on ${format(new Date(activity.date), "dd.MM.yyyy")}`;

/*
  Anchor each tooltip to a box computed from the <svg>'s own CSS box plus the
  cell's x/y attributes, not to the <g> trigger. Firefox measures an SVG <g>
  inside the sideways-scrolled calendar off by the scroll distance, so the
  tooltip landed hundreds of pixels from its cell. The <svg> box is plain CSS
  layout and every engine agrees on it. viewBox is 1:1 with width/height, so
  attribute units are pixels.
*/
const cellAnchor = (date: string) => {
  const cell = () =>
    document.querySelector<SVGRectElement>(`rect[data-date="${date}"]`);
  return {
    get contextElement() {
      return cell()?.ownerSVGElement ?? undefined;
    },
    getBoundingClientRect() {
      const rect = cell();
      const svg = rect?.ownerSVGElement?.getBoundingClientRect();
      if (!rect || !svg) {
        return new DOMRect();
      }
      return new DOMRect(
        svg.left + rect.x.baseVal.value,
        svg.top + rect.y.baseVal.value,
        rect.width.baseVal.value,
        rect.height.baseVal.value
      );
    },
  };
};

export function GitHubContributions({
  contributions,
  githubProfileUrl,
  className,
}: {
  contributions: Promise<Activity[]>;
  githubProfileUrl: string;
  className?: string;
}) {
  const data = use(contributions);

  return (
    <ContributionGraph
      className={cn("mx-auto py-2", className)}
      data={data}
      blockSize={11}
      blockMargin={3}
      blockRadius={2}
    >
      <ContributionGraphCalendar
        aria-label="GitHub contributions"
        className="no-scrollbar px-2"
        title=""
      >
        {({ activity, dayIndex, weekIndex }) => (
          <Tooltip>
            <TooltipTrigger aria-label={label(activity)} render={<g />}>
              <ContributionGraphBlock
                activity={activity}
                className="contribution-in"
                dayIndex={dayIndex}
                style={
                  {
                    "--d": dayIndex,
                    "--w": weekIndex,
                  } as CSSProperties
                }
                weekIndex={weekIndex}
              />
            </TooltipTrigger>
            <TooltipContent
              anchor={cellAnchor(activity.date)}
              className="font-sans"
            >
              <p>{label(activity)}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </ContributionGraphCalendar>

      <ContributionGraphFooter className="px-2">
        <ContributionGraphTotalCount>
          {({ totalCount, year }) => (
            <div className="text-muted-foreground">
              {totalCount.toLocaleString("en")} contributions in {year} on{" "}
              <a
                className="text-foreground link-underline"
                href={githubProfileUrl}
                target="_blank"
                rel="noopener"
              >
                GitHub
              </a>
              .
            </div>
          )}
        </ContributionGraphTotalCount>

        <ContributionGraphLegend />
      </ContributionGraphFooter>
    </ContributionGraph>
  );
}

export function GitHubContributionsFallback() {
  return (
    <div className="flex h-40.5 w-full items-center justify-center">
      <Spinner className="text-muted-foreground" />
    </div>
  );
}
