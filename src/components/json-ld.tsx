import { site } from "@/lib/site";

/**
 * A Person, not just a WebSite. The whole point of the site is answering "who
 * is this", and the same question is what the ChatGPT link in the footer asks,
 * so the machine-readable version should say it too.
 */
const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
    addressRegion: "Delhi NCR",
  },
  alumniOf: "University of Petroleum and Energy Studies",
  description: site.description,
  jobTitle: "Full Stack Architect",
  name: site.name,
  sameAs: [...site.socials.map((s) => s.href), site.resume],
  url: site.url,
  worksFor: { "@type": "Organization", name: "CambrianEdge.ai" },
};

/**
 * Structured data has exactly one injection point in React, and it is
 * dangerouslySetInnerHTML: a script's children get HTML-escaped, which would
 * corrupt the JSON. The input is a literal defined above with no user data in
 * it, so there is nothing to inject. This file is lint-exempt for that one
 * reason and should contain nothing else.
 */
export const JsonLd = () => (
  <script
    dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
    type="application/ld+json"
  />
);
