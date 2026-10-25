import { site } from "./site";

/**
 * Homepage `Link` header for agent discovery (RFC 8288, RFC 9727 §3).
 *
 * One field, comma-separated. Next keeps a single value per header name, and
 * both shapes are valid. Targets are root-relative so the same header works
 * on the apex and on www.
 */
export const homepageLink = [
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
  '</.well-known/service-desc>; rel="service-desc"; type="application/json"',
  '</about>; rel="service-doc"; type="text/html"',
  '</sitemap.xml>; rel="describedby"; type="application/xml"',
].join(", ");

const origin = site.url;

/**
 * RFC 9727 catalog. `item` is the public site. The other relations point at
 * the same resources the homepage `Link` header advertises.
 */
export const apiCatalog = {
  linkset: [
    {
      anchor: `${origin}/`,
      describedby: [
        {
          href: `${origin}/sitemap.xml`,
          type: "application/xml",
        },
      ],
      item: [
        {
          href: `${origin}/`,
          title: site.name,
        },
      ],
      "service-desc": [
        {
          href: `${origin}/.well-known/service-desc`,
          title: "Machine-readable description of the public site",
          type: "application/json",
        },
      ],
      "service-doc": [
        {
          href: `${origin}/about`,
          title: "About this site",
          type: "text/html",
        },
      ],
    },
  ],
} as const;

/** Machine-readable description of the public read surface. */
export const serviceDescription = {
  description: site.description,
  endpoints: [
    {
      accept: "text/markdown",
      description:
        "Homepage, about, crafts, and writing. Browsers receive HTML. A client that names text/markdown in Accept receives markdown.",
      href: `${origin}/`,
      method: "GET",
    },
    {
      href: `${origin}/sitemap.xml`,
      method: "GET",
      type: "application/xml",
    },
    {
      href: `${origin}/robots.txt`,
      method: "GET",
      type: "text/plain",
    },
  ],
  name: site.title,
  url: origin,
} as const;

export const LINKSET_MEDIA_TYPE =
  'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"';
