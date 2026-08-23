import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

const robots = (): MetadataRoute.Robots => ({
  rules: { allow: "/", userAgent: "*" },
  sitemap: new URL("/sitemap.xml", site.url).toString(),
});

export default robots;
