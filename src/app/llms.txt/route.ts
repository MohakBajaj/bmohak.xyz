import { projects, work } from "@/lib/about";
import { crafts } from "@/lib/crafts";
import { site } from "@/lib/site";
import { posts } from "@/lib/writing";

export const dynamic = "force-static";

const abs = (href: string) => new URL(href, site.url).toString();

/* Built from the same data the pages render, so it never drifts from them. */
const body = `# ${site.name}

> ${site.intro}

${site.description}

## Work

${work.map((r) => `- ${r.role}, ${r.company} (${r.period})${r.href ? `: ${r.href}` : ""}`).join("\n")}

## Projects

${projects.map((p) => `- [${p.name}](${p.href ?? p.repo}): ${p.description}`).join("\n")}

## Crafts

${crafts.map((c) => `- [${c.title}](${abs(`/crafts/${c.slug}`)}): ${c.tagline}`).join("\n")}

## Writing

${posts.map((p) => `- [${p.title}](${abs(p.href)}): ${p.description}`).join("\n")}

## Pages

- [About](${abs("/about")})
- [Resume](${site.resume})

## Contact

- Email: ${site.email}
${site.socials.map((s) => `- ${s.label}: ${s.href}`).join("\n")}
`;

export const GET = () =>
  new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
