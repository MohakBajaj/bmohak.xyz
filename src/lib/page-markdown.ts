import { readFile } from "node:fs/promises";
import path from "node:path";

import type {
  LifelineEvent,
  LifelineEventSegment,
} from "@/components/lifeline/types";
import { achievements, projects, stack, work } from "@/lib/about";
import { crafts } from "@/lib/crafts";
import { GITHUB_PROFILE_URL, getCachedOpenSource } from "@/lib/github";
import type { OpenSource } from "@/lib/github";
import { mohak } from "@/lib/lifelines/mohak";
import { essaySlug, normalizePath } from "@/lib/markdown-paths";
import { namespaceCommand, registryItems } from "@/lib/registry";
import { site } from "@/lib/site";
import { isExternal, postsByYear } from "@/lib/writing";

const abs = (href: string) => new URL(href, site.url).href;

const link = (label: string, href: string) => `[${label}](${href})`;

const titled = (page: string) => `${page}, ${site.name}`;

const social = (key: (typeof site.socials)[number]["key"]) =>
  site.socials.find((item) => item.key === key);

const segments = (parts: LifelineEventSegment[]) =>
  parts
    .map((part) =>
      part.type === "link" ? link(part.value, part.href) : part.value
    )
    .join("");

const eventText = (event: LifelineEvent) => {
  if (typeof event === "string") {
    return event;
  }
  if (Array.isArray(event)) {
    return segments(event);
  }
  return typeof event.text === "string" ? event.text : segments(event.text);
};

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
  sameAs: [...site.socials.map((item) => item.href), site.resume],
  url: site.url,
  worksFor: { "@type": "Organization", name: "CambrianEdge.ai" },
};

const siteLinks = () =>
  [
    link(site.name, site.url),
    ...site.nav.map((item) => link(item.label, abs(item.href))),
    link("tui", site.tui),
    ...site.socials.map((item) => link(item.label, item.href)),
    link("Resume", site.resume),
    link("Email", `mailto:${site.email}`),
  ].join(" · ");

const markdownDocument = (
  meta: { description: string; title: string },
  body: string
) => {
  const frontmatter = [
    "---",
    `title: ${JSON.stringify(meta.title)}`,
    `description: ${JSON.stringify(meta.description)}`,
    `image: ${JSON.stringify(abs("/opengraph-image"))}`,
    "---",
    "",
  ].join("\n");

  const jsonLd = ["```json", JSON.stringify(person, null, 2), "```"].join("\n");

  return `${frontmatter}\n${body.trim()}\n\n${siteLinks()}\n\n${jsonLd}\n`;
};

const home = () => {
  const years = mohak.markers
    .filter((marker) => marker.events.length > 0)
    .map((marker) => {
      const events = marker.events
        .map((event) => `- ${eventText(event)}`)
        .join("\n");
      return `### ${marker.year}\n\n${events}`;
    })
    .join("\n\n");

  const pages = site.nav
    .map((item) => `- ${link(item.label, abs(item.href))}`)
    .join("\n");

  return [
    `# ${site.name}`,
    "",
    site.intro,
    "",
    mohak.description,
    "",
    "## Timeline",
    "",
    years,
    "",
    "## Pages",
    "",
    pages,
  ].join("\n");
};

const aboutIntro = () => {
  const github = social("github");
  const x = social("x");

  return [
    `I'm a full stack architect at ${link("CambrianEdge.ai", "https://cambrianedge.ai")}, where I lead the architecture of an AI-native marketing platform. B.Tech in CSE with a DevOps specialisation. Based in Delhi NCR.`,
    "",
    "The work sits between the application and the pipeline that ships it. I use AI aggressively. An agent wrote most of what runs on this domain, and I read every diff before it lands. If the model isn't responsible for the outcome the user cares about, it's decoration, and it comes out.",
    "",
    `Most of what I learn goes out in public, the misses included. A portfolio that answers on port 22. A multiplayer live-coding jam booth built over a weekend. A SaaS I never launched. The receipts are on ${github ? link(github.label, github.href) : "GitHub"} and ${x ? link(x.label, x.href) : "X"}.`,
  ].join("\n");
};

const workSection = () =>
  work
    .map((role) => {
      const company = role.href ? link(role.company, role.href) : role.company;
      return `### ${company}\n\n${role.role} · ${role.period}\n\n${role.highlights.join(" ")}`;
    })
    .join("\n\n");

const projectSection = () =>
  projects
    .map((project) => {
      const href = project.href ?? project.repo;
      const name = href ? link(project.name, href) : project.name;
      const status = project.status ? ` _(${project.status})_` : "";
      return `- ${name} — ${project.description}${status}`;
    })
    .join("\n");

const openSourceSection = (data: OpenSource) => {
  if (data.repos.length === 0) {
    return "";
  }

  const repos = data.repos
    .map((repo) => {
      const language = repo.language ? `${repo.language}, ` : "";
      const description = repo.description ?? "No description.";
      return `- ${link(repo.name, repo.url)} — ${description} (${language}${repo.lastPush})`;
    })
    .join("\n");

  const pullRequests =
    data.pullRequests.length === 0
      ? ""
      : [
          "",
          "### Sent to other people's repositories",
          "",
          data.pullRequests
            .map(
              (pr) =>
                `- ${link(`${pr.repo}#${pr.number}`, pr.url)} — ${pr.title} (${pr.state})`
            )
            .join("\n"),
        ].join("\n");

  return [
    "",
    "## Open source",
    "",
    `${data.publicRepos} public repos, ${data.stars} stars, ${data.followers} followers, ${data.languages.length} languages.`,
    "",
    "### Recently pushed",
    "",
    repos,
    pullRequests,
    "",
    `Live from the GitHub API, cached for a day. ${link(`All ${data.publicRepos} repos`, GITHUB_PROFILE_URL)}.`,
  ].join("\n");
};

const stackSection = () =>
  stack
    .map((group) => {
      const tools = group.tools
        .map((tool) => `- ${link(tool.name, tool.href)} — ${tool.note}`)
        .join("\n");
      return `### ${group.category}\n\n${tools}`;
    })
    .join("\n\n");

const about = async () => {
  const openSource = await getCachedOpenSource();
  const linkedin = social("linkedin");
  const also = achievements.map((item) => `- ${item}`).join("\n");
  const elsewhere = linkedin
    ? `, and the rest is on ${link(linkedin.label, linkedin.href)}`
    : "";

  return [
    "# About",
    "",
    "Where I've worked, what I've shipped, and the tools that survived.",
    "",
    aboutIntro(),
    "",
    "## Work",
    "",
    workSection(),
    "",
    also,
    "",
    `There is a ${link("resume", site.resume)} too${elsewhere}.`,
    "",
    "## Projects",
    "",
    projectSection(),
    openSourceSection(openSource),
    "",
    "## Education",
    "",
    "I hold a B.Tech in Computer Science & Engineering with a DevOps specialisation from the University of Petroleum and Energy Studies, Dehradun (2021 – 2025), graduating with an 8.31 CGPA. Before that, XII (CBSE) at Preet Public School in Delhi in 2020, at 89%.",
    "",
    "## Stack",
    "",
    stackSection(),
  ].join("\n");
};

const writing = () => {
  const years = postsByYear();
  const x = social("x");
  const empty = x
    ? `Nothing here yet. The shorter stuff goes to ${link(x.label, x.href)}.`
    : "Nothing here yet.";
  const body =
    years.length === 0
      ? empty
      : years
          .map(([year, yearPosts]) => {
            const items = yearPosts
              .map((post) => {
                const href = isExternal(post) ? post.href : abs(post.href);
                return `- ${link(post.title, href)} (${post.source}) — ${post.description}`;
              })
              .join("\n");
            return `## ${year}\n\n${items}`;
          })
          .join("\n\n");

  return `# Writing\n\nPostmortems, migrations, and the occasional thing that worked.\n\n${body}`;
};

const craftsIndex = () => {
  const items = crafts
    .map(
      (craft) =>
        `- ${link(craft.title, abs(`/crafts/${craft.slug}`))} (${craft.year}) — ${craft.tagline}`
    )
    .join("\n");

  return `# Crafts\n\nSmall interactive things, each built to work out one idea. They're \`@bmohak\` on the shadcn registry.\n\n${items}`;
};

const mdxBody = (source: string) => {
  const heading = source.search(/^#\s/mu);
  const body = heading === -1 ? source : source.slice(heading);
  return body
    .replaceAll(/<[A-Z][\w.]*(?:\s[^>]*)?\/>/gu, "")
    .replaceAll(/\n{3,}/gu, "\n\n")
    .trim();
};

const essayFile = (kind: "writing" | "crafts", slug: string) => {
  const folder =
    kind === "writing" ? "src/app/writing/(posts)" : "src/app/crafts/(crafts)";
  return path.join(process.cwd(), folder, slug, "page.mdx");
};

const readEssay = async (kind: "writing" | "crafts", slug: string) => {
  try {
    return await readFile(essayFile(kind, slug), "utf-8");
  } catch {
    return null;
  }
};

const craftNotes = (slug: string) => {
  const item = registryItems.find((row) => row.name === slug);
  const command = ["```bash", namespaceCommand(slug, "bun"), "```"].join("\n");
  if (!item) {
    return `## Install\n\n${command}`;
  }

  const props = item.props
    .map((prop) => {
      const meta =
        prop.defaultValue === "—"
          ? `\`${prop.type}\``
          : `\`${prop.type}\` = \`${prop.defaultValue}\``;
      return `- \`${prop.name}\` — ${meta}`;
    })
    .join("\n");

  return [
    "## Install",
    "",
    command,
    "",
    "## Props",
    "",
    props,
    "",
    "## Usage",
    "",
    "```tsx",
    item.usage,
    "```",
  ].join("\n");
};

const postMarkdown = async (pathname: string) => {
  const slug = essaySlug(pathname, "/writing/");
  if (!slug) {
    return null;
  }
  const source = await readEssay("writing", slug);
  if (!source) {
    return null;
  }
  const post = postsByYear()
    .flatMap(([, yearPosts]) => yearPosts)
    .find((item) => item.href === pathname);
  return markdownDocument(
    {
      description: post?.description ?? "",
      title: titled(post?.title ?? slug),
    },
    mdxBody(source)
  );
};

const craftMarkdown = async (pathname: string) => {
  const slug = essaySlug(pathname, "/crafts/");
  if (!slug) {
    return null;
  }
  const source = await readEssay("crafts", slug);
  if (!source) {
    return null;
  }
  const craft = crafts.find((item) => item.slug === slug);
  return markdownDocument(
    {
      description: craft?.tagline ?? "",
      title: titled(craft?.title ?? slug),
    },
    `${mdxBody(source)}\n\n${craftNotes(slug)}`
  );
};

const NOT_FOUND = "No page at this path.";

export const renderPageMarkdown = async (pathname: string) => {
  const pagePath = normalizePath(pathname);

  switch (pagePath) {
    case "/": {
      return markdownDocument(
        { description: site.description, title: site.title },
        home()
      );
    }
    case "/about": {
      return markdownDocument(
        {
          description:
            "Where I've worked, what I've shipped, and the tools that survived.",
          title: titled("About"),
        },
        await about()
      );
    }
    case "/writing": {
      return markdownDocument(
        {
          description:
            "Postmortems, migrations, and the occasional thing that worked.",
          title: titled("Writing"),
        },
        writing()
      );
    }
    case "/crafts": {
      return markdownDocument(
        {
          description:
            "Small interactive things, each built to work out one idea. Also a shadcn registry.",
          title: titled("Crafts"),
        },
        craftsIndex()
      );
    }
    default: {
      if (pagePath.startsWith("/writing/")) {
        return postMarkdown(pagePath);
      }
      if (pagePath.startsWith("/crafts/")) {
        return craftMarkdown(pagePath);
      }
      return null;
    }
  }
};

export const notFoundMarkdown = (pathname: string) =>
  markdownDocument(
    { description: NOT_FOUND, title: titled("Not found") },
    `# Not found\n\n${NOT_FOUND}\n\n\`${pathname}\``
  );
