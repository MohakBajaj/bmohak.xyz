"use client";

import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";

import { cue } from "@/lib/ui-sound";

/**
 * next-themes swaps a class on <html>, which is an instant repaint. Wrapping
 * the swap in startViewTransition gives the browser an old/new snapshot to
 * crossfade, so the theme fades on the same 180ms curve as a navigation. The
 * API is still missing in some browsers, hence the plain fallback.
 */
const withViewTransition = (update: () => void) => {
  if (typeof document.startViewTransition === "function") {
    document.startViewTransition(update);
    return;
  }
  update();
};

/**
 * Both icons stay mounted and cross-fade, rather than one being display:none.
 * The swap is driven by a CSS class on <html>, not React state, so this is the
 * dependency-free path: stack them, animate opacity/scale/blur, and both the
 * enter and the exit come for free.
 *
 * `size-10` is the hit area, not the icon — a 14px target is unusable on
 * touch. `-my-2` keeps the footer its original height.
 */
const ICON =
  "absolute size-3.5 transition-[opacity,scale,filter] duration-200 ease-[cubic-bezier(0.2,0,0,1)]";

export const ThemeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <button
      aria-label="Toggle theme"
      className="text-muted-foreground hover:text-foreground relative -my-2 inline-flex size-10 items-center justify-center transition-[color,scale] duration-300 active:scale-[0.96]"
      onClick={() => {
        const toDark = resolvedTheme !== "dark";
        cue(toDark ? "toggle-on" : "toggle-off");
        withViewTransition(() => setTheme(toDark ? "dark" : "light"));
      }}
      type="button"
    >
      <HugeiconsIcon
        className={`${ICON} scale-25 opacity-0 blur-[4px] dark:scale-100 dark:opacity-100 dark:blur-none`}
        icon={Sun03Icon}
        strokeWidth={1.75}
      />
      <HugeiconsIcon
        className={`${ICON} scale-100 opacity-100 blur-none dark:scale-25 dark:opacity-0 dark:blur-[4px]`}
        icon={Moon02Icon}
        strokeWidth={1.75}
      />
    </button>
  );
};
