import { serviceDescription } from "@/lib/discovery-links";

export const dynamic = "force-static";

export const GET = () =>
  Response.json(serviceDescription, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
