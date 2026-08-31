"use client";

import { clickSoftSound } from "@/lib/click-soft";
import { hoverTickSound } from "@/lib/hover-tick";
import { playSound } from "@/lib/sound-engine";
import { switchOffSound } from "@/lib/switch-off";
import { switchOnSound } from "@/lib/switch-on";

export const SOUND_KEY = "sound";

/**
 * Cues, not clicks. Sound here marks a state change — the theme flipped, a
 * panel swapped, the route is different — so the caller names what happened
 * and this decides how it sounds. Nothing is wired to raw pointer contact:
 * touching a control that does nothing should make no noise.
 */
export type Cue = "toggle-on" | "toggle-off" | "select" | "navigate" | "tick";

const ASSET: Record<Cue, typeof clickSoftSound> = {
  navigate: clickSoftSound,
  select: clickSoftSound,
  tick: hoverTickSound,
  "toggle-off": switchOffSound,
  "toggle-on": switchOnSound,
};

const VOLUME: Record<Cue, number> = {
  navigate: 0.22,
  select: 0.28,
  tick: 0.16,
  "toggle-off": 0.3,
  "toggle-on": 0.3,
};

/**
 * The same sample at the same rate every time is what makes interface sound
 * read as cheap; a few percent of drift is enough to stop it feeling
 * mechanical without ever sounding like a different sound.
 */
const DRIFT = 0.03;
const drift = () => 1 + (Math.random() * 2 - 1) * DRIFT;

/** A tab three along sounds slightly higher than the first. Small on purpose. */
const STEP = 0.035;

const isEnabled = () => {
  try {
    return localStorage.getItem(SOUND_KEY) === "on";
  } catch {
    // Storage blocked or private mode. Silence is the safe default.
    return false;
  }
};

export const cue = async (name: Cue, options: { step?: number } = {}) => {
  if (!isEnabled()) {
    return;
  }

  const step = options.step ?? 0;

  try {
    await playSound(ASSET[name].dataUri, {
      playbackRate: drift() + step * STEP,
      volume: VOLUME[name],
    });
  } catch {
    // Autoplay policy, decode failure, no output device. Never a page error.
  }
};
