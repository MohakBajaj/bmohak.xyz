"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export const STEPS = 16;
export const VOICES = ["kick", "tick", "blip", "edge"] as const;
export type Voice = (typeof VOICES)[number];

/** Each voice detunes the same sample rather than shipping four of them. */
export const VOICE_RATE: Record<Voice, number> = {
  blip: 1.6,
  edge: 2.2,
  kick: 0.55,
  tick: 1.1,
};

export interface StepGridState {
  bpm: number;
  grid: boolean[][];
  playing: boolean;
  step: number;
}

export interface StepGridActions {
  clear: () => void;
  setBpm: (bpm: number) => void;
  toggle: (voice: number, index: number) => void;
  togglePlay: () => void;
}

export interface StepGridMeta {
  steps: number;
  voices: readonly Voice[];
}

export interface StepGridContextValue {
  actions: StepGridActions;
  meta: StepGridMeta;
  state: StepGridState;
}

const StepGridContext = createContext<StepGridContextValue | null>(null);

export const useStepGrid = () => {
  const value = use(StepGridContext);

  if (!value) {
    throw new Error("StepGrid used outside StepGrid.Provider");
  }

  return value;
};

const emptyGrid = () =>
  VOICES.map(() => Array.from({ length: STEPS }, () => false));

/**
 * Sixteen steps, four voices. The transport is a setInterval rather than
 * anything clever: at 90-160 BPM a step is 90-160ms, and the drift a timer
 * accumulates over a few bars is well under the threshold where anyone hears
 * it. A Web Audio clock would be correct for a real sequencer; here it would
 * be a lookahead scheduler nobody asked for.
 *
 * Sound is not a prop. Pass onHit and play whatever you want.
 */
const Provider = ({
  children,
  defaultBpm = 120,
  onHit,
}: {
  children: ReactNode;
  defaultBpm?: number;
  onHit?: (voice: Voice, step: number) => void;
}) => {
  const [grid, setGrid] = useState(emptyGrid);
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState(defaultBpm);

  const gridRef = useRef(grid);
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  const hitRef = useRef(onHit);
  useEffect(() => {
    hitRef.current = onHit;
  }, [onHit]);

  const toggle = useCallback((voice: number, index: number) => {
    const turningOn = !gridRef.current[voice][index];

    setGrid((current) =>
      current.map((row, v) =>
        v === voice ? row.map((on, i) => (i === index ? !on : on)) : row
      )
    );

    if (turningOn) {
      hitRef.current?.(VOICES[voice], index);
    }
  }, []);

  const clear = useCallback(() => {
    setGrid(emptyGrid());
  }, []);

  const togglePlay = useCallback(() => {
    setPlaying((on) => !on);
  }, []);

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
          hitRef.current?.(VOICES[voice], index);
        }
      }
      index = (index + 1) % STEPS;
    };

    tick();
    const id = setInterval(tick, interval);
    return () => clearInterval(id);
  }, [playing, bpm]);

  const activeStep = playing ? step : -1;
  const state = useMemo(
    () => ({ bpm, grid, playing, step: activeStep }),
    [activeStep, bpm, grid, playing]
  );
  const actions = useMemo(
    () => ({ clear, setBpm, toggle, togglePlay }),
    [clear, toggle, togglePlay]
  );
  const meta = useMemo(() => ({ steps: STEPS, voices: VOICES }), []);
  const value = useMemo(
    () => ({ actions, meta, state }),
    [actions, meta, state]
  );

  return <StepGridContext value={value}>{children}</StepGridContext>;
};

const Frame = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <figure
    className={cn(
      "border-border grid gap-0 overflow-hidden rounded-[0.875rem] border",
      className
    )}
  >
    {children}
  </figure>
);

const Caption = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <figcaption
    className={cn(
      "border-border flex items-center justify-between gap-4 border-t px-3 py-2",
      className
    )}
  >
    {children}
  </figcaption>
);

const Pads = ({ className }: { className?: string }) => {
  const { actions, meta, state } = useStepGrid();

  return (
    <div className={cn("grid gap-1.5 p-3", className)}>
      {state.grid.map((row, voice) => (
        <div className="flex gap-1" key={meta.voices[voice]}>
          <span className="text-muted-foreground w-9 shrink-0 font-mono text-[10px] leading-5">
            {meta.voices[voice]}
          </span>
          {row.map((on, index) => (
            <button
              aria-label={`${meta.voices[voice]} step ${index + 1}`}
              aria-pressed={on}
              className={cn(
                "border-border min-h-8 flex-1 rounded-xs border transition-[background-color,border-color,scale] active:scale-[0.96]",
                on
                  ? "bg-foreground border-foreground"
                  : "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-border",
                index === state.step && "border-foreground",
                index === state.step && !on && "bg-border/50",
                index > 0 && index % 4 === 0 && "ml-1.5"
              )}
              key={`${meta.voices[voice]}-${index}`}
              onClick={() => actions.toggle(voice, index)}
              type="button"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const Play = ({ className }: { className?: string }) => {
  const { actions, state } = useStepGrid();

  return (
    <button
      aria-pressed={state.playing}
      className={cn(
        "text-muted-foreground hover:text-foreground min-h-8 text-xs transition-[color,scale] active:scale-[0.96]",
        className
      )}
      onClick={() => {
        actions.togglePlay();
      }}
      type="button"
    >
      {state.playing ? "Stop" : "Play"}
    </button>
  );
};

const Tempo = ({ className }: { className?: string }) => {
  const { actions, state } = useStepGrid();

  return (
    <label
      className={cn(
        "text-muted-foreground flex items-center gap-2 text-xs",
        className
      )}
    >
      <span className="tabular-nums">{state.bpm} BPM</span>
      <input
        aria-label="Tempo"
        className="accent-foreground w-24"
        max={160}
        min={90}
        onChange={(event) => actions.setBpm(Number(event.target.value))}
        type="range"
        value={state.bpm}
      />
    </label>
  );
};

const Clear = ({ className }: { className?: string }) => {
  const { actions } = useStepGrid();

  return (
    <button
      className={cn(
        "text-muted-foreground hover:text-foreground text-xs transition-[color,scale] active:scale-[0.96]",
        className
      )}
      onClick={() => {
        actions.clear();
      }}
      type="button"
    >
      Clear
    </button>
  );
};

const Preview = () => (
  <Frame>
    <Pads />
    <Caption>
      <Play />
      <Tempo />
      <Clear />
    </Caption>
  </Frame>
);

export const StepGrid = {
  Caption,
  Clear,
  Context: StepGridContext,
  Frame,
  Pads,
  Play,
  Preview,
  Provider,
  Tempo,
};
