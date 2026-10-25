import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { prefersMarkdown } from "@/lib/markdown-negotiation";
import { isMarkdownPath, normalizePath } from "@/lib/markdown-paths";

/**
 * Browsers never send `text/markdown`, so this returns `next()` for them and
 * the HTML pages render as before. Agents that name the type are rewritten
 * to the markdown route; the public URL stays the page they asked for.
 */
export const proxy = (request: NextRequest) => {
  if (!prefersMarkdown(request.headers.get("accept"))) {
    return NextResponse.next();
  }

  const pathname = normalizePath(request.nextUrl.pathname);
  if (!isMarkdownPath(pathname)) {
    return NextResponse.next();
  }

  const headers = new Headers(request.headers);
  headers.set("x-markdown-negotiate", "1");

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/md" : `/md${pathname}`;
  url.search = "";

  return NextResponse.rewrite(url, { request: { headers } });
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|api(?:/|$)|md(?:/|$)|.*\\..*).*)"],
};
