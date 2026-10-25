import { markdownResponse } from "@/lib/markdown-negotiation";
import { normalizePath } from "@/lib/markdown-paths";
import { notFoundMarkdown, renderPageMarkdown } from "@/lib/page-markdown";

const NEGOTIATE = "x-markdown-negotiate";

const pathnameFrom = (path: string[] | undefined) =>
  normalizePath(path?.length ? `/${path.join("/")}` : "/");

const markdownFor = async (request: Request, path: string[] | undefined) => {
  if (request.headers.get(NEGOTIATE) !== "1") {
    return new Response("Not found\n", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      status: 404,
    });
  }

  const pathname = pathnameFrom(path);
  const body = await renderPageMarkdown(pathname);
  if (!body) {
    return markdownResponse(notFoundMarkdown(pathname), 404);
  }
  return markdownResponse(body);
};

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) => {
  const { path } = await params;
  return markdownFor(request, path);
};

export const HEAD = async (
  request: Request,
  context: { params: Promise<{ path?: string[] }> }
) => {
  const response = await GET(request, context);
  return new Response(null, {
    headers: response.headers,
    status: response.status,
  });
};
