"use client";

import { usePathname } from "next/navigation";

import { LineNav } from "@/components/line-nav";
import { craftNavItems } from "@/lib/crafts";

/**
 * LineNav renders plain anchors, so every move between crafts is a full page
 * load rather than a client navigation. That also means it never gets the
 * 180ms view transition the rest of the site has — worth patching the
 * vendored component to use next/link if this list ever gets long.
 */
export const CraftNav = () => {
  const pathname = usePathname();

  return (
    <LineNav
      activeHref={pathname}
      /*
        gap-6 overrides the component's own gap-2. Each item is an h-px rail
        with a label that is always visible, so at 8px pitch consecutive
        labels sit on top of each other.
      */
      className="sticky top-24 hidden h-fit shrink-0 gap-6 md:flex"
      items={craftNavItems}
    />
  );
};
