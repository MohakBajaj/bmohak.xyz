"use client";

import { format } from "date-fns";
import { use, useState, type CSSProperties } from "react";

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
  createTooltipController,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const label = (activity: Activity) =>
  `${activity.count} contribution${activity.count > 1 ? "s" : ""} on ${format(new Date(activity.date), "dd.MM.yyyy")}`;

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
  const [tooltip] = useState(() => createTooltipController<Activity>());

  return (
    <ContributionGraph
      className={cn("mx-auto py-2", className)}
      data={data}
      blockSize={11}
      blockMargin={3}
      blockRadius={2}
    >
      <ContributionGraphCalendar
        className="no-scrollbar px-2"
        title="GitHub Contributions"
      >
        {({ activity, dayIndex, weekIndex }) => (
          <TooltipTrigger
            aria-label={label(activity)}
            controller={tooltip}
            payload={activity}
            render={<g />}
          >
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
        )}
      </ContributionGraphCalendar>

      {/* ponytail: one shared tooltip for every block. It must sit outside
          the <svg>, since ui-sdk renders popups in place, not in a portal. */}
      <Tooltip controller={tooltip}>
        <TooltipContent<Activity> className="font-sans">
          {({ payload }) => payload && <p>{label(payload)}</p>}
        </TooltipContent>
      </Tooltip>

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
