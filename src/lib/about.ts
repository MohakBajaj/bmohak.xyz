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
      "Leading architecture and development of CambrianEdge, an AI-native marketing platform.",
      "Designing systems that hold up for enterprise clients without becoming ceremony.",
    ],
    href: "https://cambrianedge.ai",
    icon: "/favicons/mono/cambrianedge.png",
    period: "Dec 2024 – Present",
    role: "Full Stack Architect",
  },
  {
    company: "Gutenberg Communications",
    highlights: [
      "Designed and shipped AI solutions that streamline marketing workflows and content creation for multiple clients.",
      "Built and maintained the admin dashboard for monitoring and managing the AI tool, on real-time data visualisation.",
      "Developed real-time collaboration on rich text editors, on the OpenAI Assistant API.",
    ],
    href: "https://thegutenberg.com",
    icon: "/favicons/mono/gutenberg.png",
    period: "Jun 2024 – Dec 2024",
    role: "Full Stack Developer Intern",
  },
  {
    company: "plutosONE",
    highlights: [
      "Developed a multi-channel marketing communication platform, streamlining message delivery.",
      "Built a system for monitoring pm2 applications, for stability and performance.",
      "Integrated an in-house OAuth system, improving security and shortening the login path.",
    ],
    period: "Jun 2023 – Jul 2023",
    role: "Full Stack Developer Intern",
  },
  /* Smart Analyzers is missing here — TODO(mohak) add dates and a role, or drop it. */
];

export const projects: Project[] = [
  {
    description:
      "An SSH-accessible terminal portfolio in Go: Bubble Tea, Wish, and an AI chat behind a command interface. Runs in Termux on a phone, proxied out to tui.bmohak.xyz. Run: ssh bmohak.xyz",
    icon: "/favicons/mono/github.png",
    name: "mohak.tui",
    repo: "https://github.com/MohakBajaj/mohak.tui",
  },
  {
    description:
      "A multiplayer live-coding jam booth: shared Strudel patterns, timed rounds, and an audience. Built at the Cursor buildathon.",
    icon: "/favicons/mono/github.png",
    name: "SyncUp DJ",
    repo: "https://github.com/MohakBajaj/syncup-djs",
  },
  {
    description:
      "A local capture inbox. Select text, press a chord, and it becomes a markdown file you own.",
    icon: "/favicons/mono/github.png",
    name: "Slip",
    repo: "https://github.com/MohakBajaj/slip",
  },
  {
    description:
      "A local-first capture inbox for AI-assisted work. Native SDK app with a TypeScript core.",
    icon: "/favicons/mono/github.png",
    name: "Copper",
    repo: "https://github.com/MohakBajaj/copper",
  },
  {
    description:
      "An anonymous board for college students, with a custom anonymous auth system so anonymity actually holds.",
    href: "https://uncut.bmohak.xyz",
    icon: "/favicons/mono/uncut.png",
    name: "Uncut",
    repo: "https://github.com/MohakBajaj/uncut",
  },
  {
    description:
      "A whiteboard and notes app with a GPT-powered rich text editor, a drawing canvas, and export.",
    href: "https://cboarding.bmohak.xyz",
    icon: "/favicons/mono/cboarding.png",
    name: "CBoarding",
    repo: "https://github.com/MohakBajaj/CBoarding",
  },
  {
    description:
      "An anonymous social platform. Amplify the voice, drop the identity.",
    icon: "/favicons/mono/github.png",
    name: "Echo",
    repo: "https://github.com/MohakBajaj/echo",
    status: "Archived",
  },
  {
    description:
      "A text utility for manipulation and formatting. Web app and Docker container.",
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
  "Third place at INFAthon 4.0, Informatica's nationwide coding competition.",
  "Participated in eYantra at IIT Bombay, 2021.",
  "Secretary of the Xe-Tech Club at UPES, established by Xebia. Organised XeFest in 2023.",
  "Volunteered at Adharshila NGO as an IT teacher.",
];

/**
 * Built from evidence, not memory: the manifests in MohakBajaj/mohak.tui,
 * syncup-djs, slip, copper and personal-website-revamp, plus the toolchain
 * this repo runs on. Marks with no `icon` had no usable favicon, or flattened
 * to a solid lump under scripts/mono-favicons — the initial reads better.
 *
 * TODO(mohak): still yours to prune. Rust (seven repos, all 2022) and the
 * Java/C/Dart/Flutter half of the resume are deliberately absent — learning
 * and coursework, not daily drivers. Add them back if that is wrong.
 */
export const stack: ToolGroup[] = [
  {
    category: "AI",
    tools: [
      {
        href: "https://claude.com/claude-code",
        icon: "/favicons/mono/claude.png",
        name: "Claude Code",
        note: "Primary agent. Every diff still gets read before it lands.",
      },
      {
        href: "https://cursor.com",
        icon: "/favicons/mono/cursor.png",
        name: "Cursor",
        note: "Editor when the work wants a canvas rather than a terminal.",
      },
      {
        href: "https://openai.com/codex",
        icon: "/favicons/mono/openai.png",
        name: "Codex",
        note: "Second opinion on the ones that resist the first.",
      },
      {
        href: "https://ai-sdk.dev",
        icon: "/favicons/mono/aisdk.png",
        name: "AI SDK",
        note: "Every model behind one interface. SyncUp DJ talks to it through the Gateway.",
      },
      {
        href: "https://streamdown.ai",
        icon: "/favicons/mono/streamdown.png",
        name: "Streamdown",
        note: "Markdown that survives being streamed a token at a time.",
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
        note: "Router and Start. What the last two apps were actually built on.",
      },
      {
        href: "https://nextjs.org",
        icon: "/favicons/mono/nextjs.png",
        name: "Next.js",
        note: "This site. App Router, on 16.",
      },
      {
        href: "https://vite.dev",
        icon: "/favicons/mono/vite.png",
        name: "Vite",
        note: "Everything that is not Next. Also what Electron builds through.",
      },
      {
        href: "https://react.dev",
        icon: "/favicons/mono/react.png",
        name: "React",
        note: "19. Server components where they earn it.",
      },
      {
        href: "https://tailwindcss.com",
        icon: "/favicons/mono/tailwind.png",
        name: "Tailwind CSS",
        note: "v4. The design tokens live in one file.",
      },
      {
        href: "https://base-ui.com",
        icon: "/favicons/mono/baseui.png",
        name: "Base UI",
        note: "The primitives under shadcn here, and under Slip.",
      },
      {
        href: "https://ui.shadcn.com",
        icon: "/favicons/mono/shadcn.png",
        name: "shadcn/ui",
        note: "Components as source I own, not a dependency I wait on.",
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
        note: "Charm's TUI stack: Bubbles, Lip Gloss, Wish. mohak.tui is all four.",
      },
      {
        href: "https://github.com/charmbracelet/wish",
        icon: "/favicons/mono/charm.png",
        name: "Wish",
        note: "SSH as an app server. It is what makes ssh bmohak.xyz answer.",
      },
      {
        href: "https://www.electronjs.org",
        icon: "/favicons/mono/electron.png",
        name: "Electron",
        note: "Slip ships on it. electron-vite for the build, electron-builder for the rest.",
      },
      {
        href: "https://ziglang.org",
        icon: "/favicons/mono/zig.png",
        name: "Zig",
        note: "Copper's core. build.zig, app.zon, and no JS runtime in the binary.",
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
        note: "Runtime, package manager, test runner. 3m 44s to 30s.",
      },
      {
        href: "https://www.typescriptlang.org",
        icon: "/favicons/mono/typescript.png",
        name: "TypeScript",
        note: "On 7, on the native compiler.",
      },
      {
        href: "https://go.dev",
        icon: "/favicons/mono/go.png",
        name: "Go",
        note: "Anything that has to be one binary on a server.",
      },
      {
        href: "https://www.python.org",
        icon: "/favicons/mono/python.png",
        name: "Python",
        note: "Scripts, scrapers, and anything with a model on the other end.",
      },
      {
        href: "https://hono.dev",
        icon: "/favicons/mono/hono.png",
        name: "Hono",
        note: "APIs that should not need a framework meeting.",
      },
      {
        href: "https://elysiajs.com",
        icon: "/favicons/mono/elysia.png",
        name: "Elysia",
        note: "When the API is Bun-native and the types should be end to end.",
      },
      {
        href: "https://zod.dev",
        icon: "/favicons/mono/zod.png",
        name: "Zod",
        note: "The boundary between what I hope arrived and what did.",
      },
      {
        href: "https://turborepo.com",
        icon: "/favicons/mono/turborepo.png",
        name: "Turborepo",
        note: "Every one of these repos is a monorepo eventually.",
      },
      {
        href: "https://www.ultracite.ai",
        icon: "/favicons/mono/ultracite.png",
        name: "Ultracite",
        note: "oxlint and oxfmt behind one preset. Zero config is the point.",
      },
      {
        href: "https://git-scm.com",
        icon: "/favicons/mono/git.png",
        name: "Git",
        note: "Underneath everything, including the thing below.",
      },
      {
        href: "https://jj-vcs.github.io/jj/",
        icon: "/favicons/mono/jj.png",
        name: "Jujutsu",
        note: "Git underneath, an undo log on top. Rebases stop being an event.",
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
        note: "Traces, metrics and logs in one place instead of three bills.",
      },
      {
        href: "https://evlog.dev",
        icon: "/favicons/mono/evlog.png",
        name: "evlog",
        note: "Structured logs, wide events and structured errors behind one API. A drop-in for console.log that a platform can read.",
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
        note: "Boring infrastructure compounds.",
      },
      {
        href: "https://kubernetes.io",
        icon: "/favicons/mono/kubernetes.png",
        name: "Kubernetes",
        note: "When the thing genuinely needs it, which is less often than people think.",
      },
      {
        href: "https://aws.amazon.com",
        icon: "/favicons/mono/aws.png",
        name: "AWS",
        note: "Where the long-running pieces sit.",
      },
      {
        href: "https://vercel.com",
        icon: "/favicons/mono/vercel.png",
        name: "Vercel",
        note: "Where the frontends sit.",
      },
      {
        href: "https://github.com/features/actions",
        icon: "/favicons/mono/github.png",
        name: "GitHub Actions",
        note: "Default CI. Jenkins and Ansible when the estate predates it.",
      },
      {
        href: "https://www.postgresql.org",
        icon: "/favicons/mono/postgres.png",
        name: "PostgreSQL",
        note: "Default datastore until something proves it is not.",
      },
      {
        href: "https://redis.io",
        icon: "/favicons/mono/redis.png",
        name: "Redis",
        note: "Queues, caches, locks.",
      },
    ],
  },
];
