"use client";

import { useEffect } from "react";

import { haptic } from "@/lib/haptic";

/**
 * Haptics only, and globally: a tap should be felt at the moment of contact,
 * on anything you can press. That is true of touch in a way it is not of
 * sound — a vibration is silent, local to the hand, and carries no meaning
 * beyond "you hit the thing". Sound is not wired here on purpose; it is
 * attached to the four places where something actually changes. See ui-sound.
 *
 * Delegated rather than a handler per control, so a component added later is
 * covered without anyone remembering. haptic() no-ops on a mouse by itself.
 */
const PRESSABLE = 'a[href], button, [role="tab"], summary';

export const Haptics = () => {
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const element = event.target as Element | null;
      const hit = element?.closest?.(PRESSABLE);
      if (hit && !hit.hasAttribute("disabled")) {
        haptic();
      }
    };

    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return null;
};
