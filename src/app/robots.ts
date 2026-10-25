import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

/*
  Search, training, and live AI answers may all use the site.
  https://contentsignals.org/
*/
const robots = (): MetadataRoute.Robots => ({
  rules: {
    allow: "/",
    other: {
      "Content-Signal": "ai-train=yes, search=yes, ai-input=yes",
    },
    userAgent: "*",
  },
  sitemap: new URL("/sitemap.xml", site.url).toString(),
});

export default robots;
