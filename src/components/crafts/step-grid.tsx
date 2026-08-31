"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useSoundPreference } from "@/components/sound-toggle";
import { useSound } from "@/hooks/use-sound";
import { switchOnSound } from "@/lib/switch-on";
import { cn } from "@/lib/utils";

const STEPS = 16;
const VOICES = ["kick", "tick", "blip", "edge"] as const;

/** Each voice detunes the same sample rather than shipping four of them. */
const RATE: Record<(typeof VOICES)[number], number> = {
  blip: 1.6,
  edge: 2.2,
  kick: 0.55,
  tick: 1.1,
};

const emptyGrid = () =>
  VOICES.map(() => Array.from({ length: STEPS }, () => false));

/**
 * Sixteen steps, four voices. The transport is a setInterval rather than
 * anything clever: at 90-160 BPM a step is 90-160ms, and the drift a timer
 * accumulates over a few bars is well under the threshold where anyone hears
 * it. A Web Audio clock would be correct for a real sequencer; here it would
 * be a lookahead scheduler nobody asked for.
 */
export const StepGrid = () => {
  const [grid, setGrid] = useState(emptyGrid);
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);

  const { enabled: soundOn } = useSoundPreference();
  const [playSwitch] = useSound(switchOnSound, {
    soundEnabled: soundOn,
    volume: 0.4,
  });

  // The transport reads the grid, so keep a ref and let the interval stay put
  // instead of tearing down and rebuilding it on every toggle. Synced in an
  // effect, not during render — a ref written mid-render can go stale.
  const gridRef = useRef(grid);
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  /*
    Switching a pad on previews the voice you just added — the pad is the
    sound, so a generic UI click layered on top would be two sounds for one
    tap. Switching off is silent: nothing was added to hear.

    The current value is read from state before the update, not set inside the
    updater: React does not run an updater synchronously, so a flag written in
    there is still false by the time the next line reads it.
  */
  const toggle = useCallback(
    (voice: number, index: number) => {
      const turningOn = !grid[voice][index];

      setGrid((current) =>
        current.map((row, v) =>
          v === voice ? row.map((on, i) => (i === index ? !on : on)) : row
        )
      );

      if (turningOn) {
        playSwitch({ playbackRate: RATE[VOICES[voice]], volume: 0.35 });
      }
    },
    [grid, playSwitch]
  );

  useEffect(() => {
    if (!playing) {
      return;
    }

    const interval = (60 / bpm / 4) * 1000;
    let index = 0;

    const tick = () => {
      setStep(index);
      for (const [voice, row] of gridRef.current.entries()) {
        if (row[index]) {
          playSwitch({ playbackRate: RATE[VOICES[voice]], volume: 0.35 });
        }
      }
      index = (index + 1) % STEPS;
    };

    tick();
    const id = setInterval(tick, interval);
    return () => clearInterval(id);
  }, [playing, bpm, playSwitch]);

  // Derived, not reset in an effect: stopping simply stops highlighting.
  const activeStep = playing ? step : -1;

  /*
    Concentric: the pads are rounded-xs (2px) inset by p-3 (12px), so the
    outer radius is 2 + 12 = 14px. rounded-lg would read as a squarer box
    wrapped around rounder contents.
  */
  return (
    <figure className="border-border grid gap-0 overflow-hidden rounded-[0.875rem] border">
      <div className="grid gap-1.5 p-3">
        {grid.map((row, voice) => (
          <div className="flex gap-1" key={VOICES[voice]}>
            <span className="text-muted-foreground w-9 shrink-0 font-mono text-[10px] leading-5">
              {VOICES[voice]}
            </span>
            {row.map((on, index) => (
              <button
                aria-label={`${VOICES[voice]} step ${index + 1}`}
                aria-pressed={on}
                className={cn(
                  "border-border min-h-8 flex-1 rounded-xs border transition-[background-color,border-color,scale] active:scale-[0.96]",
                  on ? "bg-foreground border-foreground" : "hover:bg-border/60",
                  index === activeStep && "border-foreground"
                )}
                key={`${VOICES[voice]}-${index}`}
                onClick={() => toggle(voice, index)}
                type="button"
              />
            ))}
          </div>
        ))}
      </div>

      <figcaption className="border-border flex items-center justify-between gap-4 border-t px-3 py-2">
        <button
          aria-pressed={playing}
          className="text-muted-foreground hover:text-foreground min-h-8 text-xs transition-[color,scale] active:scale-[0.96]"
          onClick={() => setPlaying((on) => !on)}
          type="button"
        >
          {playing ? "Stop" : "Play"}
        </button>

        <label className="text-muted-foreground flex items-center gap-2 text-xs">
          <span className="tabular-nums">{bpm} BPM</span>
          <input
            aria-label="Tempo"
            className="accent-foreground w-24"
            max={160}
            min={90}
            onChange={(event) => setBpm(Number(event.target.value))}
            type="range"
            value={bpm}
          />
        </label>

        <button
          className="text-muted-foreground hover:text-foreground text-xs transition-[color,scale] active:scale-[0.96]"
          onClick={() => setGrid(emptyGrid())}
          type="button"
        >
          Clear
        </button>
      </figcaption>
    </figure>
  );
};
