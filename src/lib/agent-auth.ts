import { site } from "@/lib/site";

/**
 * Auth.md discovery for a public site.
 *
 * Nothing here issues a credential or accepts a registration. The anonymous
 * method is the whole surface: read the pages. `register_uri` repeats that
 * in JSON. A POST to it is refused, because registration would create an
 * account this site does not have.
 */
const origin = site.url;

export const agentAuth = {
  claimUri: `${origin}/.well-known/agent-auth`,
  issuer: origin,
  registerUri: `${origin}/.well-known/agent-auth`,
  resource: origin,
  scopesSupported: ["public"],
  skill: `${origin}/auth.md`,
} as const;

const anonymous = {
  claim_uri: agentAuth.claimUri,
  credential_types_supported: ["none"],
} as const;

export const agentAuthBlock = {
  anonymous,
  claim_uri: agentAuth.claimUri,
  identity_types_supported: ["anonymous"],
  register_uri: agentAuth.registerUri,
  skill: agentAuth.skill,
} as const;

export const protectedResourceMetadata = {
  authorization_servers: [agentAuth.issuer],
  bearer_methods_supported: ["header"],
  resource: agentAuth.resource,
  resource_documentation: agentAuth.skill,
  scopes_supported: agentAuth.scopesSupported,
} as const;

export const authorizationServerMetadata = {
  agent_auth: agentAuthBlock,
  issuer: agentAuth.issuer,
  scopes_supported: agentAuth.scopesSupported,
  service_documentation: agentAuth.skill,
} as const;

export const registrationDocument = {
  agent_auth: agentAuthBlock,
  audience:
    "Any agent reading the public pages on bmohak.xyz, including clients that ask for text/markdown.",
  credential_use:
    "No credential is issued or required. An Authorization header is ignored. GET and HEAD return the same public document either way.",
  methods: ["anonymous"],
  registration: "not_required",
} as const;

const protectedResourceUrl = `${origin}/.well-known/oauth-protected-resource`;
const authorizationServerUrl = `${origin}/.well-known/oauth-authorization-server`;

export const authMarkdown = `# auth.md

bmohak.xyz is ${site.name}'s public site. Agents are readers. Every page is available without an account.

## Audience

Any agent fetching public pages on ${origin}, including clients that send \`Accept: text/markdown\`.

## Registration

Agent registration is not required, and this host does not provision accounts.

The registration document is ${agentAuth.registerUri} (\`register_uri\`). \`GET\` returns the anonymous method below. \`POST\` is refused. A body sent there does not create an account, send email, or issue a credential.

## Methods

One method is supported.

- **anonymous.** \`identity_types_supported\` is \`["anonymous"]\`. \`anonymous.credential_types_supported\` is \`["none"]\`. \`claim_uri\` is ${agentAuth.claimUri}. There is no account to claim. The claim document says the same thing, because it is the same URL.

## Credentials

No credential is issued or required. Do not send an \`Authorization\` header. \`bearer_methods_supported\` lists \`header\` so an OAuth client that already holds a token knows where a bearer would go. This resource does not check one. \`GET\` and \`HEAD\` return the same public document either way.

The scope name is \`public\`. It names open read of the site. It does not grant anything anonymous access lacks.

Pages that negotiate markdown (\`/\`, \`/about\`, \`/crafts\`, \`/writing\`, and each essay or craft) return \`text/markdown\` when \`Accept\` names \`text/markdown\`.

## Discovery

Protected resource metadata: ${protectedResourceUrl}

That document carries \`resource\` \`${agentAuth.resource}\`, \`authorization_servers\` \`["${agentAuth.issuer}"]\`, \`scopes_supported\` \`["public"]\`, and \`bearer_methods_supported\` \`["header"]\`.

Authorization server metadata: ${authorizationServerUrl}

\`issuer\` is \`${agentAuth.issuer}\`, the same value advertised in \`authorization_servers\`. The \`agent_auth\` block sets \`skill\` to this file, \`register_uri\` and \`claim_uri\` to the registration document, and the anonymous method above.

Nothing on this host answers 401, so there is no \`WWW-Authenticate\` challenge to follow. Start from the two documents above, or from this file.
`;

const DOCUMENT_HEADERS = {
  "Cache-Control": "public, max-age=3600",
} as const;

export const markdownDocument = (body: string) =>
  new Response(body, {
    headers: {
      ...DOCUMENT_HEADERS,
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });

export const jsonDocument = (
  body: unknown,
  status = 200,
  extraHeaders?: Record<string, string>
) =>
  Response.json(body, {
    headers: { ...DOCUMENT_HEADERS, ...extraHeaders },
    status,
  });

export const registrationRefused = {
  error: "registration_not_supported",
  error_description:
    "bmohak.xyz does not register agents. GET this URL for the anonymous method. A body sent here does not create an account, send email, or issue a credential.",
} as const;
