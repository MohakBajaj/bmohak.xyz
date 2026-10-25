/**
 * Content negotiation for Markdown for Agents.
 *
 * A range counts only when `text/markdown` is named. A wildcard accept must
 * not flip a browser onto markdown: browsers send one as a low-q fallback
 * and never name `text/markdown`. When both markdown and HTML are named,
 * markdown wins on a tie so `Accept: text/markdown` is honored beside HTML.
 */
export const prefersMarkdown = (header: string | null): boolean => {
  if (!header) {
    return false;
  }

  let markdown = 0;
  let markdownNamed = false;
  let html = 0;

  for (const part of header.split(",")) {
    const [rawType, ...params] = part.split(";").map((piece) => piece.trim());
    if (!rawType) {
      continue;
    }

    let quality = 1;
    for (const param of params) {
      const [key, value] = param.split("=").map((piece) => piece.trim());
      if (key?.toLowerCase() !== "q") {
        continue;
      }
      const parsed = Number(value);
      quality = Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : 0;
    }

    const type = rawType.toLowerCase();
    if (type === "text/markdown") {
      markdownNamed = true;
      markdown = Math.max(markdown, quality);
    } else if (type === "text/html" || type === "application/xhtml+xml") {
      html = Math.max(html, quality);
    }
  }

  return markdownNamed && markdown > 0 && markdown >= html;
};

/** Four characters per token. The usual English estimate, not a tokenizer. */
const estimateTokens = (markdown: string) => Math.ceil(markdown.length / 4);

export const markdownResponse = (body: string, status = 200) =>
  new Response(body, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
      "x-markdown-tokens": String(estimateTokens(body)),
    },
    status,
  });
