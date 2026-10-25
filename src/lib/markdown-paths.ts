import { crafts } from "@/lib/crafts";
import { posts } from "@/lib/writing";

const STATIC_PATHS = new Set(["/", "/about", "/crafts", "/writing"]);

const SLUG = /^[a-z0-9-]+$/u;

export const normalizePath = (pathname: string) => {
  const withSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (withSlash.length > 1 && withSlash.endsWith("/")) {
    return withSlash.slice(0, -1);
  }
  return withSlash;
};

export const isMarkdownPath = (pathname: string) => {
  const path = normalizePath(pathname);
  if (STATIC_PATHS.has(path)) {
    return true;
  }
  if (crafts.some((craft) => path === `/crafts/${craft.slug}`)) {
    return true;
  }
  return posts.some((post) => post.href === path);
};

/**
 * Slug comes from our own lists, then is checked again here so a path can
 * never be joined into a file read.
 */
export const essaySlug = (
  pathname: string,
  prefix: "/writing/" | "/crafts/"
) => {
  if (!pathname.startsWith(prefix)) {
    return null;
  }
  const slug = pathname.slice(prefix.length);
  return SLUG.test(slug) ? slug : null;
};
