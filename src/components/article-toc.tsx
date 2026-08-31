"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

import { TOCMinimap } from "@/components/toc-minimap";

interface Item {
  title: string;
  url: string;
  depth: number;
}

const EMPTY: Item[] = [];

/*
  Cached by path. getSnapshot must return the same reference when the
  headings have not changed, or React re-renders forever. An empty read is
  not cached: on a client navigation the first snapshot often runs before
  the new article is in the document.
*/
let cache: { key: string; items: Item[] } | null = null;

const subscribe = (onStoreChange: () => void) => {
  const id = window.requestAnimationFrame(onStoreChange);
  return () => window.cancelAnimationFrame(id);
};

const sameItems = (left: Item[], right: Item[]) =>
  left.length === right.length &&
  left.every(
    (item, index) =>
      item.url === right[index]?.url && item.title === right[index]?.title
  );

const read = (selector: string, path: string): Item[] => {
  const article = document.querySelector(selector);
  const headings = article
    ? [...article.querySelectorAll<HTMLElement>("h2[id], h3[id], h4[id]")]
    : [];

  const items = headings.map((heading) => ({
    depth: Number(heading.tagName.slice(1)),
    title: heading.textContent ?? "",
    url: `#${heading.id}`,
  }));

  if (items.length === 0) {
    return EMPTY;
  }

  if (cache?.key === path && sameItems(cache.items, items)) {
    return cache.items;
  }

  cache = { items, key: path };
  return items;
};

/**
 * The TOC is read from the rendered article rather than from the MDX at build
 * time. A remark plugin is the usual answer, but Turbopack only accepts
 * plugins by name, so it would mean publishing a package to extract something
 * the document already knows.
 *
 * Reading it during render works because these pages are prerendered: the
 * article markup, ids and all, is in the document before React hydrates.
 * The ids themselves come from rehype-slug, which does run at build.
 */
export const ArticleToc = ({ selector = "article" }: { selector?: string }) => {
  const pathname = usePathname();
  const items = useSyncExternalStore(
    subscribe,
    () => read(selector, pathname),
    () => EMPTY
  );

  if (items.length < 2) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed top-1/2 right-4 z-40 hidden -translate-y-1/2 xl:block">
      <div className="pointer-events-auto">
        <TOCMinimap items={items} />
      </div>
    </div>
  );
};
