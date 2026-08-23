"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { cue } from "@/lib/ui-sound";

/**
 * One cue when the route actually changes — not when a link is pressed. A
 * link to the page you are already on changes nothing and should be silent,
 * and pressing a link that fails to navigate should not have sounded like it
 * worked. Watching the pathname is the only way to hear the difference.
 *
 * The first render is skipped: arriving on a page is not a change.
 */
export const RouteCue = () => {
  const pathname = usePathname();
  const previous = useRef<string | null>(null);

  useEffect(() => {
    if (previous.current !== null && previous.current !== pathname) {
      cue("navigate");
    }
    previous.current = pathname;
  }, [pathname]);

  return null;
};
