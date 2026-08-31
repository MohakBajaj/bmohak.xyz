"use client";

import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

export type TOCItemType = {
  title: React.ReactNode;
  url: string;
  depth: number;
};

export type TOCMinimapProps = {
  items: TOCItemType[];
  className?: string;
};

/**
 * Bars on the right, one per heading. Each bar is a real link so a keyboard
 * can reach it. The title sits in the accessible name, and appears beside
 * the bar on hover or focus.
 */
export function TOCMinimap({ items, className }: TOCMinimapProps) {
  const itemIds = useMemo(
    () => items.map((item) => item.url.replace("#", "")),
    [items]
  );

  const activeHeading = useActiveHeading(itemIds);

  if (!items.length) {
    return null;
  }

  return (
    <nav aria-label="On this page" className={cn("ml-auto w-18", className)}>
      <ol className="flex max-h-[50dvh] flex-col gap-3 overflow-hidden py-3 pl-6">
        {items.map((item) => {
          const current = item.url === `#${activeHeading}`;

          return (
            <li className="relative" key={item.url}>
              <a
                className={cn(
                  "group relative block h-0.5 rounded-xs transition-[background-color,width] duration-200 after:absolute after:inset-x-0 after:-inset-y-2",
                  "data-[depth=2]:w-6 data-[depth=3]:ml-2 data-[depth=3]:w-4 data-[depth=4]:ml-4 data-[depth=4]:w-2",
                  current
                    ? "bg-foreground"
                    : "bg-ring/50 hover:bg-foreground focus-visible:bg-foreground"
                )}
                data-depth={item.depth}
                href={item.url}
                onClick={handleItemClick}
              >
                <span className="sr-only">{item.title}</span>
                <span
                  aria-hidden="true"
                  className="bg-background/90 text-foreground pointer-events-none absolute top-1/2 right-full mr-3 hidden -translate-y-1/2 px-1.5 py-0.5 text-xs text-nowrap group-hover:block group-focus-visible:block"
                >
                  {item.title}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function useActiveHeading(itemIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0% 0% -80% 0%", threshold: 0.98 }
    );

    for (const id of itemIds ?? []) {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    }

    return () => {
      for (const id of itemIds ?? []) {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      }
    };
  }, [itemIds]);

  return activeId;
}

function handleItemClick(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  const url = event.currentTarget.getAttribute("href") ?? "";
  history.pushState(null, "", url);
  document.getElementById(url.replace("#", ""))?.scrollIntoView({
    behavior: "smooth",
  });
}
