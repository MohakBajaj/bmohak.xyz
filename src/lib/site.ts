/**
 * Shared width cap. Lifeline measures its rail from the logo's left edge to
 * 24px inside `data-site-nav-inner`'s right edge, so the timeline inherits
 * this. The nav and the footer must use the same constant, or the rail
 * visibly stops short of the footer's edge.
 *
 * It lives here rather than in site-nav.tsx because that module is
 * `"use client"`: a server component importing a value from a client module
 * gets a client-reference proxy, not the string, and the classes vanish with
 * no error.
 */
export const SITE_CONTAINER = "mx-auto w-full max-w-5xl px-6";

export const site = {
  /*
    `hints=search` opens ChatGPT with web search already on. The site pin
    keeps it on this Mohak, and "tech profile" keeps the answer in scope.
  */
  chatgpt:
    "https://chatgpt.com/?hints=search&prompt=Tech%20profile%20of%20Mohak%20Bajaj%20(bmohak.xyz).",
  description:
    "I build platforms and the pipelines that ship them, mostly in public. Full stack architect at CambrianEdge.ai, in Delhi NCR.",
  email: "bmohak87@gmail.com",
  /* The one identity sentence. Rendered sr-only on the timeline, which has
     no visible prose of its own to tell a crawler or a reader what this is. */
  intro:
    "Mohak Bajaj is a full stack architect and DevOps engineer in Delhi NCR, building CambrianEdge.ai and shipping side projects in public.",
  name: "Mohak Bajaj",
  nav: [
    { href: "/about", label: "About" },
    { href: "/crafts", label: "Crafts" },
    { href: "/writing", label: "Writing" },
  ],
  resume: "https://resume.bmohak.xyz",
  socials: [
    { href: "https://github.com/MohakBajaj", key: "github", label: "GitHub" },
    { href: "https://x.com/MohakBajaj5", key: "x", label: "X" },
    {
      href: "https://linkedin.com/in/mohak-bajaj",
      key: "linkedin",
      label: "LinkedIn",
    },
  ],
  title: "Mohak Bajaj, Full Stack Architect and DevOps Engineer",
  url: "https://bmohak.xyz",
} as const;
