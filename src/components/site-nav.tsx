"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SITE_CONTAINER, site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * rgba() rather than bg-background/80: Tailwind's opacity modifier compiles
 * to color-mix(), a non-legacy colour that interpolates in oklab — visibly
 * out of step with the page's legacy sRGB white→black theme fade. Legacy
 * rgba() keeps the bar and the page on one curve.
 */
const NAV_SURFACE =
  "bg-[rgba(255,255,255,0.8)] dark:bg-[rgba(0,0,0,0.8)] backdrop-blur-xl";

export const SiteNav = () => {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        NAV_SURFACE
      )}
    >
      <div
        className={cn(SITE_CONTAINER, "flex h-12 items-center justify-between")}
        data-site-nav-inner
      >
        <Link
          aria-label={`${site.name} — Home`}
          className="font-heading text-sm font-medium whitespace-nowrap transition-opacity duration-300 hover:opacity-70"
          data-site-nav-logo
          href="/"
        >
          {site.name}
        </Link>

        <div className="flex items-center gap-4 max-sm:gap-3">
          {site.nav.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-xs transition-colors duration-300",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
