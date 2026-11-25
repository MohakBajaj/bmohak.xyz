"use client";

import { useMemo, type CSSProperties } from "react";

import { LIFELINE_CURRENT_YEAR } from "@/lib/lifeline-data";
import { cn } from "@/lib/utils";

import { getLifelineEventImage } from "./lifeline-event";
import { LifelineHoverImageProvider } from "./lifeline-hover-image";
import {
  LifelineStickyLabels,
  LIFELINE_STICKY_SHIELD_WIDTH,
} from "./lifeline-labels";
import { LifelineMarkerColumn } from "./lifeline-marker";
import { LifelineFloatingPhotos } from "./lifeline-photos";
import { getLifelineYearGroups, getMarkerWidth } from "./lifeline-utils";
import type { LifelineEventImage, LifelineProps } from "./types";
import { useLifelineIntro } from "./use-lifeline-intro";
import { useLifelineScroll } from "./use-lifeline-scroll";

export function LifelineDesktop({
  markers,
  birthYear,
  className,
  title = "Lifeline",
  mode = "auto",
}: LifelineProps) {
  const widths = useMemo(
    () =>
      markers.map((marker, index) =>
        getMarkerWidth(marker, markers[index + 1]?.year)
      ),
    [markers]
  );

  // Left edge of each marker's slot within the track — anchors for the
  // floating photo cards.
  const offsets = useMemo(() => {
    const result: number[] = [];
    let sum = 0;
    for (const width of widths) {
      result.push(sum);
      sum += width;
    }
    return result;
  }, [widths]);

  const yearGroups = useMemo(() => getLifelineYearGroups(markers), [markers]);

  const hoverImages = useMemo(() => {
    const images: LifelineEventImage[] = [];
    for (const marker of markers) {
      for (const event of marker.events) {
        const image = getLifelineEventImage(event);
        if (image) images.push(image);
      }
    }
    return images;
  }, [markers]);

  const intro = useLifelineIntro(widths);
  const isIntroAnimating = intro.shouldPlay && intro.isPlaying;

  const {
    sectionRef,
    trackRef,
    labelsRef,
    setMarkerRef,
    isLayoutReady,
    isEmbed,
    introArmed,
  } = useLifelineScroll(markers.length, {
    mode,
    introLocked: isIntroAnimating,
    introAnimating: isIntroAnimating,
    introSkipped: !intro.shouldPlay,
    introRailMs: intro.railDuration,
    introGetTrackProgress: intro.getTrackProgressAtTime,
    onIntroScrollStart: intro.startIntroTimer,
    onIntroSettleComplete: intro.completeIntro,
  });

  // Embedded, the open waits for the module to come into view: the marker
  // fades are CSS animations that start the moment their class lands, so
  // applying it early would spend them below the fold.
  const introWaitingInView = isEmbed && intro.shouldPlay && !introArmed;
  const showIntro = isIntroAnimating && isLayoutReady && !introWaitingInView;

  const trackWidth =
    LIFELINE_STICKY_SHIELD_WIDTH +
    widths.reduce((sum, width) => sum + width, 0);

  const introStyle = {
    "--lifeline-labels-ms": `${intro.labelsDuration}ms`,
    "--lifeline-rail-ms": `${intro.railDuration}ms`,
  } as CSSProperties;

  return (
    <section
      ref={sectionRef}
      data-lifeline=""
      data-lifeline-mode={isEmbed ? "embed" : "page"}
      // Embedded, the module needs a tab stop to be operable at all — a
      // page-mode lifeline is reached just by scrolling to it.
      tabIndex={isEmbed ? 0 : undefined}
      className={cn(
        "relative h-full min-h-0 overflow-hidden select-none [&_a]:cursor-pointer",
        // `pan-y` lets the browser start a vertical page scroll on the
        // first frame instead of waiting on the JS axis lock; horizontal
        // panning stays ours.
        isEmbed &&
          "focus-visible:outline-ring touch-pan-y focus-visible:outline-2 focus-visible:outline-offset-2",
        // Hold it blank rather than showing a settled timeline that then
        // resets itself to play the intro. Below the fold there is nothing
        // to see anyway, and the arming margin means it fills in before it
        // reaches the reader.
        (!isLayoutReady || introWaitingInView) && "invisible",
        className
      )}
      aria-label={title}
      style={showIntro ? introStyle : undefined}
    >
      <LifelineHoverImageProvider preload={hoverImages}>
        {/*
        Centered — but `safe center` where the browser understands it, which
        matters once the height is the consumer's to choose. A track taller
        than its box would otherwise overflow equally top and bottom, and
        since the section clips, the first thing lost is the row nearest the
        top: the Age/Years label column and the year labels. `safe` falls
        back to start-alignment exactly in that case, so the labels and the
        rail stay put and only the tail of a long column clips. Declared
        inline so browsers without it simply keep the `items-center` class.
      */}
        <div
          className="flex h-full items-center overflow-hidden"
          style={isEmbed ? { alignItems: "safe center" } : undefined}
        >
          <div
            ref={trackRef}
            className="relative flex w-max items-start will-change-transform [--lifeline-people-top:calc(14.5rem+40px)] [--lifeline-rail:5rem]"
            style={{ width: trackWidth }}
          >
            {/*
            LIFELINE_STICKY_SHIELD_WIDTH reserves this column at the head of
            the track, and the column has to actually paint it: once the
            track scrolls, marker text passes underneath and would otherwise
            read straight through "Age" and "Years".

            `bg-white dark:bg-black` to match the framing the shell puts
            around this — reframe the page on a different surface and this
            wants overriding with it. The transition is not decoration
            either: without it the shield snaps between the two while the
            page behind it is still crossfading, which flashes a hard box
            for the length of a theme switch. 300ms on the default curve is
            what `LifelineShell` fades on, so the two move as one.
          */}
            <div
              ref={labelsRef}
              className="lifeline-labels shrink-0 bg-white transition-colors duration-300 will-change-transform dark:bg-black"
              style={{ width: LIFELINE_STICKY_SHIELD_WIDTH }}
            >
              <div className={cn(showIntro && "lifeline-labels-intro")}>
                <LifelineStickyLabels />
              </div>
            </div>

            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-[var(--lifeline-rail)] h-px overflow-hidden"
              >
                <div
                  className={cn(
                    "h-px w-full border-t border-dashed border-zinc-300 transition-colors duration-300 dark:border-zinc-800",
                    showIntro && "lifeline-rail-intro"
                  )}
                />
              </div>

              <div className="relative flex items-start">
                {markers.map((marker, index) => (
                  <LifelineMarkerColumn
                    key={marker.id}
                    ref={(node) => setMarkerRef(index, node)}
                    marker={marker}
                    birthYear={birthYear}
                    minWidth={widths[index]}
                    animateIntro={showIntro}
                    introDelay={intro.getMarkerDelay(index)}
                    introDuration={intro.getMarkerFadeDuration(index)}
                    hideLabel={yearGroups.some(([start]) => start === index)}
                    isNow={
                      index === markers.length - 1 &&
                      Math.floor(marker.year) === LIFELINE_CURRENT_YEAR
                    }
                  />
                ))}
              </div>

              {/* A year with months keeps its label pinned beside the Age/Years
                column while its months scroll past. useLifelineScroll moves
                these; data-start/data-end bound the slide in track px. */}
              {yearGroups.map(([start, end]) => (
                // Two layers on purpose. The outer one is positioned by
                // useLifelineScroll's inline transform; the inner one runs
                // the intro fade-and-rise. The intro keyframes animate
                // transform with fill: forwards, so on one element they would
                // override the pin until the intro ended.
                <div
                  key={markers[start].id}
                  aria-hidden="true"
                  data-lifeline-sticky-year=""
                  data-start={offsets[start]}
                  data-end={offsets[end] + widths[end]}
                  className="absolute top-9 z-10 will-change-transform"
                  style={{ left: offsets[start] }}
                >
                  <p
                    className={cn(
                      "h-5 bg-white pr-4 text-[15px] leading-5 font-medium whitespace-nowrap tabular-nums transition-colors duration-300 dark:bg-black",
                      Math.floor(markers[end].year) === LIFELINE_CURRENT_YEAR
                        ? "text-zinc-800 dark:text-zinc-200"
                        : "text-zinc-500 dark:text-zinc-600",
                      showIntro && "lifeline-marker-intro"
                    )}
                    style={
                      showIntro
                        ? ({
                            animationDelay: `${intro.getMarkerDelay(start)}ms`,
                            "--lifeline-marker-fade-ms": `${intro.getMarkerFadeDuration(start)}ms`,
                          } as CSSProperties)
                        : undefined
                    }
                  >
                    {markers[start].label ?? markers[start].year}
                  </p>
                </div>
              ))}

              <LifelineFloatingPhotos
                markers={markers}
                offsets={offsets}
                widths={widths}
                animateIntro={showIntro}
                getIntroDelay={intro.getMarkerDelay}
                getIntroDuration={intro.getMarkerFadeDuration}
              />
            </div>
          </div>
        </div>
      </LifelineHoverImageProvider>
    </section>
  );
}
