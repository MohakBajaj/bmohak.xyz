import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
    Next blocks cross-origin requests to dev-only assets by default, so a dev
    server reached over Tailscale serves the page but never its HMR client.
    Dev-only setting; production is unaffected.
  */
  allowedDevOrigins: ["*.local"],
  /*
    Markdown negotiation reads the essay MDX off disk. The slug is chosen from
    the writing and crafts lists, so the tracer never sees a literal path.
  */
  outputFileTracingIncludes: {
    "/md": ["./src/app/**/*.mdx"],
    "/md/**": ["./src/app/**/*.mdx"],
    "/md/\\[\\[...path\\]\\]": ["./src/app/**/*.mdx"],
  },
  // .mdx files under app/ become routes; posts live in app/writing/(posts)/
  pageExtensions: ["ts", "tsx", "mdx"],
};

const withMDX = createMDX({
  options: {
    // Named as a string, not imported: Turbopack resolves plugins in Rust and
    // cannot take a JS function. Base MDX is CommonMark — no tables, no
    // strikethrough, no task lists — and typeset styles all three.
    // Heading ids, which the TOC minimap links to. Named as a string for the
    // same reason as remark below: Turbopack resolves plugins in Rust.
    rehypePlugins: ["rehype-slug"],
    remarkPlugins: ["remark-gfm"],
  },
});

export default withMDX(nextConfig);
