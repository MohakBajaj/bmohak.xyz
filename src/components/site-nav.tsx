"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ViewTransition } from "react";

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

const NAV_ACTIVE =
  "site-nav-active bg-foreground absolute inset-x-0 -bottom-px h-px";

export const SiteNav = () => {
  const pathname = usePathname();

  return (
    <ViewTransition name="site-nav">
      <nav
        className={cn(
          "fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)] transition-colors duration-300",
          NAV_SURFACE
        )}
      >
        <a
          className="bg-foreground text-background sr-only z-[80] px-3 py-2 text-xs focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          href="#content"
        >
          Skip to content
        </a>
        <div
          className={cn(
            SITE_CONTAINER,
            "flex h-12 items-center justify-between"
          )}
          data-site-nav-inner
        >
          <Link
            aria-label={`${site.name} — Home`}
            className="font-heading inline-flex min-h-10 items-center text-sm font-medium whitespace-nowrap"
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
                  aria-label={item.label}
                  className={cn(
                    "inline-flex min-h-10 items-center text-xs transition-colors duration-300",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  href={item.href}
                  key={item.href}
                >
                  <span className="relative">
                    {item.label}
                    {active ? (
                      <span aria-hidden="true" className={NAV_ACTIVE} />
                    ) : null}
                  </span>
                </Link>
              );
            })}
            <button
              aria-label="Open command menu"
              className="text-muted-foreground hover:text-foreground inline-flex min-h-10 items-center text-xs tabular-nums transition-colors duration-300"
              onClick={() => window.dispatchEvent(new Event("command-k"))}
              type="button"
            >
              <span className="sm:hidden">go</span>
              <span className="hidden sm:inline">⌘K</span>
            </button>
          </div>
        </div>
      </nav>
    </ViewTransition>
  );
};
