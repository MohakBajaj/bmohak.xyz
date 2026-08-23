"use client";

import { VolumeHighIcon, VolumeOffIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useSyncExternalStore } from "react";

import { cue, SOUND_KEY } from "@/lib/ui-sound";

/*
  A two-line store rather than a context: the preference is a single boolean,
  read by a handful of components, and it has to survive a reload. localStorage
  is the source of truth and `storage` keeps other tabs in step.
*/
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
};

const read = () => {
  try {
    return localStorage.getItem(SOUND_KEY) === "on";
  } catch {
    return false;
  }
};

const writePreference = (on: boolean) => {
  try {
    localStorage.setItem(SOUND_KEY, on ? "on" : "off");
  } catch {
    // Nothing to persist to; the toggle simply will not stick.
  }
};

export const useSoundPreference = () => {
  const enabled = useSyncExternalStore(subscribe, read, () => false);

  const toggle = useCallback(() => {
    const next = !enabled;

    /*
      Order matters both ways. Turning on: write first, so the confirming cue
      passes the preference check — and that click is also the user gesture
      that unlocks the AudioContext, so it is the first thing that can make a
      sound at all. Turning off: play first, or the last thing you did would
      be the only thing you never heard.
    */
    if (next) {
      writePreference(next);
      cue("toggle-on");
    } else {
      cue("toggle-off");
      writePreference(next);
    }

    for (const listener of listeners) {
      listener();
    }
  }, [enabled]);

  return { enabled, toggle };
};

/** Stacked, so the two states cross-fade instead of one replacing the other. */
const ICON =
  "absolute size-3.5 scale-25 opacity-0 blur-[4px] transition-[opacity,scale,filter] duration-200 ease-[cubic-bezier(0.2,0,0,1)]";

export const SoundToggle = () => {
  const { enabled, toggle } = useSoundPreference();

  return (
    <button
      aria-label={enabled ? "Mute interface sounds" : "Unmute interface sounds"}
      aria-pressed={enabled}
      className="text-muted-foreground hover:text-foreground group relative -my-2 inline-flex size-10 items-center justify-center transition-[color,scale] duration-300 active:scale-[0.96]"
      onClick={toggle}
      type="button"
    >
      {/* Both mounted and cross-faded off aria-pressed, so the icon has an
          exit as well as an enter. Same curve and values as the theme icon. */}
      <HugeiconsIcon
        className={`${ICON} group-aria-pressed:scale-100 group-aria-pressed:opacity-100 group-aria-pressed:blur-none`}
        icon={VolumeHighIcon}
        strokeWidth={1.75}
      />
      <HugeiconsIcon
        className={`${ICON} scale-100 opacity-100 blur-none group-aria-pressed:scale-25 group-aria-pressed:opacity-0 group-aria-pressed:blur-[4px]`}
        icon={VolumeOffIcon}
        strokeWidth={1.75}
      />
    </button>
  );
};
