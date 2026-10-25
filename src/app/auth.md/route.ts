import { authMarkdown, markdownDocument } from "@/lib/agent-auth";

export const dynamic = "force-static";

export const GET = () => markdownDocument(authMarkdown);
