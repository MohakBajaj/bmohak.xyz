"use client";

import { useSyncExternalStore } from "react";

import { TOCMinimap } from "@/components/toc-minimap";

interface Item {
  title: string;
  url: string;
  depth: number;
}

const EMPTY: Item[] = [];

/*
  Cached by selector, and the cache is the point: getSnapshot runs on every
  render and must return the same reference each time or React re-renders
  forever. Nothing subscribes — the headings are fixed for the life of the
  page — so subscribe() is a no-op that returns its own unsubscribe.
*/
let cache: { key: string; items: Item[] } | null = null;

const subscribe = () => () => {
  // Headings never change after hydration; nothing to listen to.
};

const read = (selector: string): Item[] => {
  if (cache?.key === selector) {
    return cache.items;
  }

  const article = document.querySelector(selector);
  const headings = article
    ? [...article.querySelectorAll<HTMLElement>("h2[id], h3[id], h4[id]")]
    : [];

  const items = headings.map((heading) => ({
    depth: Number(heading.tagName.slice(1)),
    title: heading.textContent ?? "",
    url: `#${heading.id}`,
  }));

  cache = { items, key: selector };
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
  const items = useSyncExternalStore(
    subscribe,
    () => read(selector),
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
