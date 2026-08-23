# bmohak.xyz

My personal site. The homepage is a timeline rather than a hero section: a rail from 2004 to now, where every year carries what actually happened in it. The format is the argument, because a year with nothing in it is visibly empty.

Live at [bmohak.xyz](https://bmohak.xyz). There is a terminal version too: `ssh bmohak.xyz`.

## Run it

```bash
cp .env.example .env
bun install
bun run dev
```

| script              |                                  |
| ------------------- | -------------------------------- |
| `bun run dev`       | Next dev server on Turbopack     |
| `bun run build`     | Production build                 |
| `bun run check`     | Lint and format check, no writes |
| `bun run fix`       | Lint and format, with writes     |
| `bun run typecheck` | `tsc --noEmit`                   |

`bun run typecheck` needs `.next/types` to exist, so run `dev` or `build` once on a fresh clone first. `LayoutProps` is generated, not hand-written.

## Stack

|  |  |
| --- | --- |
| Framework | Next.js 16.3, App Router, Turbopack |
| Runtime | Bun for install and scripts. Next itself runs on Node |
| Language | TypeScript 7, native compiler |
| Lint and format | [Ultracite](https://www.ultracite.ai), which is oxlint and oxfmt behind one preset |
| Components | [shadcn/ui](https://ui.shadcn.com) on Base UI, `base-nova` |
| Prose | [shadcn typeset](https://ui.shadcn.com/docs/typeset), one CSS file, no prose classes |
| Timeline | [Lifeline](https://github.com/evilrabbit/lifeline) by evilrabbit |
| Content | MDX via `@next/mdx`, with `remark-gfm` and `rehype-slug` |

Bun is the package manager and script runner, not the runtime. `bun --bun next build` crashes inside Next's Turbopack production runtime, so the scripts run `next` on Node.

## Routes

```
/                       the timeline
/about                  work, projects, live GitHub data, tabbed stack
/crafts                 index
/crafts/<slug>          one craft, MDX plus a live demo component
/writing                index, grouped by year
/writing/<slug>         one post, MDX
```

## Adding content

**A post.** Create `src/app/writing/(posts)/<slug>/page.mdx`, export a `metadata` object from it, then add a matching row to `posts` in `src/lib/writing.ts`. A post published elsewhere never gets a file, only a row with an absolute `href`.

**A craft.** Same shape under `src/app/crafts/(crafts)/<slug>/page.mdx`, plus a row in `src/lib/crafts.ts`. The interactive part is a component in `src/components/crafts/` imported by the MDX.

**A timeline year.** One entry in `src/lib/lifelines/mohak.ts`. `birthYear` is the axis start and the age labels are `year - birthYear`, so no marker needs an age override.

Step three is manual in every case. There is no filesystem glob: one list to read, and the order on the page is the order in the file.

## Things worth knowing before you change them

**Data lives in `src/lib`, not in the pages.** `site.ts`, `about.ts`, `crafts.ts`, `writing.ts` and `lifelines/mohak.ts` are the only files that should need editing to change what the site says.

**Site marks are flattened at author time.** The site is two colours and fetched favicons are not, and half of them ship an opaque tile that a CSS filter would paint as a solid square. `scripts/mono-favicons.ts` reduces each mark to a single channel, alpha, into `public/favicons/mono/`, and the page paints the shape with `currentColor` so it follows the theme. After adding a logo to `public/favicons/`:

```bash
bun scripts/mono-favicons.ts
```

Anything with no file, or that flattens to a lump, falls back to its initial.

**Vendored registry components are lint-ignored, not edited lightly.** Everything under `src/components/lifeline/`, `src/components/ui/`, plus the contribution graph, TOC minimap and line nav came from a shadcn registry. Re-running `shadcn add` overwrites them, including the small type fixes each one needed. Those fixes are commented where they are.

**Sound is opt-in and event-based.** Haptics fire globally on `pointerdown`. Sound only fires on a real state change: the theme flipping, a tab switching, the route actually changing. It is off until asked for and the preference survives a reload. See `src/lib/ui-sound.ts`.

**The GitHub section is live.** `src/lib/github.ts` reads repos, stats and pull requests at build time and caches for a day. It is unauthenticated, so 60 requests an hour per IP; set `GITHUB_TOKEN` to lift that. Every failure path returns empty and the section hides itself rather than erroring the route. Changing the shape of what it returns needs the cache key bumped, or a stale entry keeps being served.

## Licence

Code is MIT. The writing, the timeline and the photographs are not.
