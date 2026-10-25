import {
  LINKSET_MEDIA_TYPE,
  apiCatalog,
  homepageLink,
} from "@/lib/discovery-links";

export const dynamic = "force-static";

export const GET = () =>
  Response.json(apiCatalog, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": LINKSET_MEDIA_TYPE,
      Link: homepageLink,
    },
  });
