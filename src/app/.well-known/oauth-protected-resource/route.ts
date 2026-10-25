import { jsonDocument, protectedResourceMetadata } from "@/lib/agent-auth";

export const dynamic = "force-static";

export const GET = () => jsonDocument(protectedResourceMetadata);
