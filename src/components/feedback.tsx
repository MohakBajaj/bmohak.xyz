"use client";

import { useEffect } from "react";

import { haptic } from "@/lib/haptic";
import { cue } from "@/lib/ui-sound";

/**
 * Feedback for every press, delegated from one listener, so a control added
 * later is covered without anyone remembering.
 *
 * On `click`, not `pointerdown`. A touch pointerdown is not a user activation,
 * so iOS ignores the switch-haptic trick and Android drops navigator.vibrate()
 * on the first tap. A click is also the press that actually happened: a
 * scroll that started on a link never clicks, so it never buzzes.
 *
 * Haptics go on anything pressable (haptic() no-ops on a mouse by itself).
 * Sound only goes on a link that leaves the page. Buttons that change state
 * cue themselves (theme, sound, tabs, command menu). Cueing navigation here,
 * inside the click, beats watching the pathname: it sounds the moment you
 * press instead of after the next page loads, and on iOS a sound is only
 * allowed to start inside the gesture anyway.
 */
const PRESSABLE =
  'a[href], button, summary, [role="tab"], [role="option"], [role="menuitem"]';

const leavesPage = (link: HTMLAnchorElement) => {
  if (link.hasAttribute("download")) {
    return false;
  }
  const url = new URL(link.href, window.location.href);
  return (
    url.origin !== window.location.origin ||
    url.pathname !== window.location.pathname
  );
};

export const Feedback = () => {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const hit = target?.closest?.(PRESSABLE);
      if (
        !hit ||
        hit.hasAttribute("disabled") ||
        hit.getAttribute("aria-disabled") === "true"
      ) {
        return;
      }

      haptic();

      if (hit instanceof HTMLAnchorElement && leavesPage(hit)) {
        void cue("navigate");
      }
    };

    // Capture, so a handler that stops propagation still gets its feedback.
    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
};
