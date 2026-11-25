export interface Role {
  company: string;
  href?: string;
  role: string;
  period: string;
  /** Site mark under public/favicons; omit and the initial is used. */
  icon?: string;
  highlights: string[];
}

export interface Project {
  name: string;
  description: string;
  href?: string;
  repo?: string;
  icon?: string;
  /** Rendered right-aligned; omit for the ones still running. */
  status?: string;
}

export interface ToolGroup {
  category: string;
  tools: { name: string; href: string; note: string; icon?: string }[];
}

/** Reverse chronological. Source: resume.json in MohakBajaj/mohak.tui. */
export const work: Role[] = [
  {
    company: "CambrianEdge.ai",
    highlights: [
      "Own the architecture and end-to-end engineering of CambrianEdge, an AI-native marketing platform.",
      "Build production systems, deployment pipelines, and the unglamorous infrastructure that keeps enterprise workloads reliable.",
    ],
    href: "https://cambrianedge.ai",
    icon: "/favicons/mono/cambrianedge.png",
    period: "Dec 2024 – Present",
    role: "Full Stack Architect",
  },
  {
    company: "Gutenberg Communications",
    highlights: [
      "Built AI-assisted marketing and content workflows shipped to multiple client teams.",
      "Created a real-time admin dashboard for monitoring usage, managing workflows, and surfacing live metrics.",
      "Implemented collaborative rich-text editing wired into the OpenAI Assistant API.",
    ],
    href: "https://thegutenberg.com",
    icon: "/favicons/mono/gutenberg.png",
    period: "Jun 2024 – Dec 2024",
    role: "Full Stack Developer Intern",
  },
  {
    company: "plutosONE",
    highlights: [
      "Built a multi-channel marketing communication platform to handle reliable message delivery.",
      "Shipped a monitoring layer for pm2 services to catch crashes and track runtime performance.",
      "Integrated an in-house OAuth flow to tighten auth and cut friction out of sign-in.",
    ],
    period: "Jun 2023 – Jul 2023",
    role: "Full Stack Developer Intern",
  },
  /* Smart Analyzers is missing here: TODO(mohak) add dates and a role, or drop it. */
];

export const projects: Project[] = [
  {
    description:
      "Local-first Mac capture inbox (originally Slip): tap Shift twice and any selection lands as a markdown file you own. Rewritten from Electron to Rust on Rune (675 MB down to 91 MB), with a Raycast extension and an MCP server.",
    href: "https://sayjot.xyz",
    name: "Jot",
  },
  {
    description:
      "SSH terminal portfolio in Go with Bubble Tea, Wish, and an AI chat interface. Runs in Termux on a phone, proxied to tui.bmohak.xyz. Try: ssh bmohak.xyz",
    icon: "/favicons/mono/github.png",
    name: "mohak.tui",
    repo: "https://github.com/MohakBajaj/mohak.tui",
  },
  {
    description:
      "Multiplayer live-coding jam booth built on shared Strudel patterns, timed rounds, and a live audience. Shipped over a weekend at the Cursor buildathon.",
    icon: "/favicons/mono/github.png",
    name: "SyncUp DJ",
    repo: "https://github.com/MohakBajaj/syncup-djs",
  },
  {
    description:
      "Local-first capture inbox for AI-assisted work, built on a native Zig core with no JS runtime in the binary.",
    icon: "/favicons/mono/github.png",
    name: "Copper",
    repo: "https://github.com/MohakBajaj/copper",
  },
  {
    description:
      "Anonymous discussion board for college students, backed by a custom anonymous auth flow so privacy holds up.",
    href: "https://uncut.bmohak.xyz",
    icon: "/favicons/mono/uncut.png",
    name: "Uncut",
    repo: "https://github.com/MohakBajaj/uncut",
  },
  {
    description:
      "Combined whiteboard and notes workspace with a GPT-powered rich text editor, drawing canvas, and export.",
    href: "https://cboarding.bmohak.xyz",
    icon: "/favicons/mono/cboarding.png",
    name: "CBoarding",
    repo: "https://github.com/MohakBajaj/CBoarding",
  },
  {
    description:
      "The Electron prototype that became Jot: select text, hit a shortcut, save local markdown.",
    icon: "/favicons/mono/github.png",
    name: "Slip",
    repo: "https://github.com/MohakBajaj/slip",
    status: "Superseded",
  },
  {
    description: "Anonymous social feed built around ideas over profiles.",
    icon: "/favicons/mono/github.png",
    name: "Echo",
    repo: "https://github.com/MohakBajaj/echo",
    status: "Archived",
  },
  {
    description:
      "Text formatting and transformation utility packaged as both a web app and a Docker container.",
    href: "https://wordsmith.bmohak.xyz",
    icon: "/favicons/mono/wordsmith.png",
    name: "Wordsmith",
    repo: "https://github.com/MohakBajaj/Wordsmith",
    status: "Archived",
  },
];

export const education = [
  {
    degree: "B.Tech, Computer Science & Engineering (DevOps)",
    institution: "University of Petroleum and Energy Studies",
    location: "Dehradun",
    period: "2021 – 2025",
    score: "8.31 CGPA",
  },
  {
    degree: "XII Standard (CBSE)",
    institution: "Preet Public School",
    location: "Delhi",
    period: "2019 – 2020",
    score: "89%",
  },
];

export const achievements = [
  "Spoke live at Microsoft Build //localhost in Gurugram (From CLI to PR, no slides safety net).",
  "Mentored and judged EQUINOX, a 36-hour hackathon with ~50 teams at Zenith School of AI and Google Developer Groups.",
  "Placed third at INFAthon 4.0, Informatica's nationwide coding competition.",
  "Competed in eYantra at IIT Bombay (2021).",
  "Served as Secretary of the Xe-Tech Club at UPES (established by Xebia) and organised XeFest.",
  "Volunteered as an IT teacher at Adharshila NGO.",
];

/**
 * Built from evidence, not memory: the manifests in MohakBajaj/mohak.tui,
 * syncup-djs, slip, copper and personal-website-revamp, plus the toolchain
 * this repo runs on. Marks with no `icon` had no usable favicon, or flattened
 * to a solid lump under scripts/mono-favicons: the initial reads better.
 *
 * Rust is back since Jot 2.0 moved onto it. The Java/C/Dart/Flutter half
 * of the resume stays out: coursework, not daily drivers.
 */
export const stack: ToolGroup[] = [
  {
    category: "AI",
    tools: [
      {
        href: "https://claude.com/claude-code",
        icon: "/favicons/mono/claude.png",
        name: "Claude Code",
        note: "Daily driver for agentic coding. Fast to draft, still reviewed line by line.",
      },
      {
        href: "https://cursor.com",
        icon: "/favicons/mono/cursor.png",
        name: "Cursor",
        note: "Where I work when the task wants an editor canvas instead of a terminal.",
      },
      {
        href: "https://openai.com/codex",
        icon: "/favicons/mono/openai.png",
        name: "Codex",
        note: "Second pair of eyes when the first model gets stuck in a loop.",
      },
      {
        href: "https://ai-sdk.dev",
        icon: "/favicons/mono/aisdk.png",
        name: "AI SDK",
        note: "One interface across providers. SyncUp DJ routes models through the Gateway.",
      },
      {
        href: "https://streamdown.ai",
        icon: "/favicons/mono/streamdown.png",
        name: "Streamdown",
        note: "Markdown rendering that stays clean while tokens are still streaming in.",
      },
    ],
  },
  {
    category: "Web",
    tools: [
      {
        href: "https://tanstack.com/start",
        icon: "/favicons/mono/tanstack.png",
        name: "TanStack Start",
        note: "Router and full-stack framework behind my last two web apps.",
      },
      {
        href: "https://nextjs.org",
        icon: "/favicons/mono/nextjs.png",
        name: "Next.js",
        note: "Powers this site. App Router on v16.",
      },
      {
        href: "https://vite.dev",
        icon: "/favicons/mono/vite.png",
        name: "Vite",
        note: "Default build tool for anything outside Next, including Electron builds.",
      },
      {
        href: "https://react.dev",
        icon: "/favicons/mono/react.png",
        name: "React",
        note: "v19, using Server Components where they actually simplify data flow.",
      },
      {
        href: "https://tailwindcss.com",
        icon: "/favicons/mono/tailwind.png",
        name: "Tailwind CSS",
        note: "v4, with all design tokens kept in a single stylesheet.",
      },
      {
        href: "https://ui-sdk.dev",
        name: "ui-sdk",
        note: "Headless primitives behind this site. Popups render in place with no portal juggling.",
      },
      {
        href: "https://base-ui.com",
        icon: "/favicons/mono/baseui.png",
        name: "Base UI",
        note: "Accessible primitives underneath shadcn and early Slip builds.",
      },
      {
        href: "https://ui.shadcn.com",
        icon: "/favicons/mono/shadcn.png",
        name: "shadcn/ui",
        note: "Components as owned source code instead of a black-box dependency.",
      },
    ],
  },
  {
    category: "Native & terminal",
    tools: [
      {
        href: "https://github.com/charmbracelet/bubbletea",
        icon: "/favicons/mono/charm.png",
        name: "Bubble Tea",
        note: "Charm's Go TUI stack (Bubbles, Lip Gloss, Wish). mohak.tui runs on all of it.",
      },
      {
        href: "https://github.com/charmbracelet/wish",
        icon: "/favicons/mono/charm.png",
        name: "Wish",
        note: "Turns SSH into an app server. Hosts mohak.tui at tui.bmohak.xyz.",
      },
      {
        href: "https://www.rust-lang.org",
        icon: "/favicons/mono/rust.png",
        name: "Rust",
        note: "Powers Jot 2.0. Moving off Electron cut footprint from 675 MB to 91 MB on the same vault.",
      },
      {
        href: "https://github.com/anomalyco/rune",
        name: "Rune",
        note: "The native UI framework under Jot 2.0.",
      },
      {
        href: "https://www.raycast.com",
        name: "Raycast",
        note: "Hosts Jot's extension so capturing a note is one shortcut from any app.",
      },
      {
        href: "https://www.electronjs.org",
        icon: "/favicons/mono/electron.png",
        name: "Electron",
        note: "Where Slip began and what Jot outgrew. Still hard to beat for getting to a first prototype fast.",
      },
      {
        href: "https://ziglang.org",
        icon: "/favicons/mono/zig.png",
        name: "Zig",
        note: "Copper's native core: build.zig, app.zon, and zero JS runtime in the binary.",
      },
    ],
  },
  {
    category: "Runtime & tooling",
    tools: [
      {
        href: "https://bun.com",
        icon: "/favicons/mono/bun.png",
        name: "Bun",
        note: "Package manager, script runner, and test runner. Cut CI from 3m 44s to 30s.",
      },
      {
        href: "https://www.typescriptlang.org",
        icon: "/favicons/mono/typescript.png",
        name: "TypeScript",
        note: "v7 on the native compiler. Typechecks finish fast enough to disappear.",
      },
      {
        href: "https://go.dev",
        icon: "/favicons/mono/go.png",
        name: "Go",
        note: "My pick when a service should ship as a single static binary.",
      },
      {
        href: "https://www.python.org",
        icon: "/favicons/mono/python.png",
        name: "Python",
        note: "Automation scripts, scrapers, and quick work around ML models.",
      },
      {
        href: "https://hono.dev",
        icon: "/favicons/mono/hono.png",
        name: "Hono",
        note: "Lightweight HTTP APIs without framework ceremony.",
      },
      {
        href: "https://elysiajs.com",
        icon: "/favicons/mono/elysia.png",
        name: "Elysia",
        note: "Bun-native APIs when end-to-end type safety is the priority.",
      },
      {
        href: "https://zod.dev",
        icon: "/favicons/mono/zod.png",
        name: "Zod",
        note: "Runtime validation at every boundary where external data enters.",
      },
      {
        href: "https://turborepo.com",
        icon: "/favicons/mono/turborepo.png",
        name: "Turborepo",
        note: "Keeps multi-package repos fast once a side project grows legs.",
      },
      {
        href: "https://www.ultracite.ai",
        icon: "/favicons/mono/ultracite.png",
        name: "Ultracite",
        note: "Zero-config preset wrapping oxlint and oxfmt into one fast check.",
      },
      {
        href: "https://git-scm.com",
        icon: "/favicons/mono/git.png",
        name: "Git",
        note: "The foundation under every repo, including the tool below.",
      },
      {
        href: "https://jj-vcs.github.io/jj/",
        icon: "/favicons/mono/jj.png",
        name: "Jujutsu",
        note: "Git compatibility underneath with a first-class undo log. Makes rebases boring.",
      },
    ],
  },
  {
    category: "Observability",
    tools: [
      {
        href: "https://signoz.io",
        icon: "/favicons/mono/signoz.png",
        name: "SigNoz",
        note: "Unified traces, metrics, and logs without paying three separate vendors.",
      },
      {
        href: "https://evlog.dev",
        icon: "/favicons/mono/evlog.png",
        name: "evlog",
        note: "Structured logs, wide events, and typed errors behind one clean API.",
      },
    ],
  },
  {
    category: "Infrastructure",
    tools: [
      {
        href: "https://www.docker.com",
        icon: "/favicons/mono/docker.png",
        name: "Docker",
        note: "Predictable containers that run the same way everywhere.",
      },
      {
        href: "https://kubernetes.io",
        icon: "/favicons/mono/kubernetes.png",
        name: "Kubernetes",
        note: "Reached for when scale actually demands it, not by default.",
      },
      {
        href: "https://aws.amazon.com",
        icon: "/favicons/mono/aws.png",
        name: "AWS",
        note: "Where long-running backend services and pipelines live.",
      },
      {
        href: "https://vercel.com",
        icon: "/favicons/mono/vercel.png",
        name: "Vercel",
        note: "Default home for web frontends and edge previews.",
      },
      {
        href: "https://github.com/features/actions",
        icon: "/favicons/mono/github.png",
        name: "GitHub Actions",
        note: "Primary CI/CD, with Jenkins and Ansible for older infrastructure.",
      },
      {
        href: "https://www.postgresql.org",
        icon: "/favicons/mono/postgres.png",
        name: "PostgreSQL",
        note: "Default database until a workload proves it needs something else.",
      },
      {
        href: "https://redis.io",
        icon: "/favicons/mono/redis.png",
        name: "Redis",
        note: "Fast queues, caches, and distributed locks.",
      },
    ],
  },
];
