import {
  jsonDocument,
  registrationDocument,
  registrationRefused,
} from "@/lib/agent-auth";

export const dynamic = "force-static";

export const GET = () => jsonDocument(registrationDocument);

export const POST = () =>
  jsonDocument(registrationRefused, 405, { Allow: "GET, HEAD" });
