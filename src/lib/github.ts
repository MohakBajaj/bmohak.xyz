import { unstable_cache } from "next/cache";

export const GITHUB_USERNAME = "MohakBajaj";
export const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;

export interface Repo {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  /** "3 days ago". Computed on fetch, not in render: it ages with the cache. */
  lastPush: string;
}

export interface PullRequest {
  title: string;
  url: string;
  repo: string;
  number: number;
  state: "merged" | "open" | "closed";
}

export interface OpenSource {
  repos: Repo[];
  pullRequests: PullRequest[];
  publicRepos: number;
  followers: number;
  stars: number;
  languages: string[];
}

const EMPTY: OpenSource = {
  followers: 0,
  languages: [],
  publicRepos: 0,
  pullRequests: [],
  repos: [],
  stars: 0,
};

/**
 * Work repos. They are private, so an unauthenticated request never sees them
 * anyway, but a token that can read them must not be able to leak internal
 * branch names, client features or colleagues' names onto a public page.
 * Excluded explicitly rather than relying on `is:public` alone.
 */
const NEVER_PUBLISH = ["GutenbergCommunications"];

/** How many rows the section shows. */
const PR_LIMIT = 5;

interface ApiRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
}

interface ApiUser {
  public_repos: number;
  followers: number;
}

const RELATIVE = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const DAY = 86_400_000;

const sincePush = (iso: string, now: number) => {
  const days = Math.round((new Date(iso).getTime() - now) / DAY);
  return days > -31
    ? RELATIVE.format(days, "day")
    : RELATIVE.format(Math.round(days / 30), "month");
};

interface ApiSearchItem {
  title: string;
  html_url: string;
  number: number;
  state: string;
  repository_url: string;
  pull_request?: { merged_at: string | null };
}

/**
 * Pull requests to repositories that are not mine, whatever came of them. An
 * open PR upstream says more than a merged one on my own account, and a
 * closed one still happened.
 *
 * `is:public` keeps private work out even when the running token can see it,
 * and NEVER_PUBLISH is a second gate on the employer org. `-user:` on my own
 * account drops self-merges, which the repo list above already covers.
 *
 * Ordered by recency, one row per repository so a single repo cannot fill the
 * list. No star lookups any more: that was eight extra calls to rank things
 * that recency ranks well enough once the state is visible.
 */
const fetchPullRequests = async (
  headers: HeadersInit
): Promise<PullRequest[]> => {
  const exclusions = [GITHUB_USERNAME, ...NEVER_PUBLISH]
    .map((owner) => `-user:${owner}`)
    .join("+");

  const query = `author:${GITHUB_USERNAME}+type:pr+is:public+${exclusions}`;

  const res = await fetch(
    `https://api.github.com/search/issues?q=${query}&sort=updated&per_page=40`,
    { headers }
  );

  if (!res.ok) {
    return [];
  }

  const body = (await res.json()) as { items?: ApiSearchItem[] };
  const items = body.items ?? [];

  const byRepo = new Map<string, PullRequest>();
  for (const item of items) {
    const [, repo] = item.repository_url.split("/repos/");
    if (!repo || byRepo.has(repo)) {
      continue;
    }

    let state: PullRequest["state"] = "open";
    if (item.pull_request?.merged_at) {
      state = "merged";
    } else if (item.state === "closed") {
      state = "closed";
    }

    byRepo.set(repo, {
      number: item.number,
      repo,
      state,
      title: item.title,
      url: item.html_url,
    });
  }

  return [...byRepo.values()].slice(0, PR_LIMIT);
};

/**
 * Unauthenticated GitHub, so 60 requests an hour per IP — fine behind a day of
 * cache, and the page still renders if it runs out: every failure path returns
 * EMPTY and the section hides itself rather than erroring the route.
 *
 * Set GITHUB_TOKEN to lift the ceiling to 5,000/hr. Nothing here needs a
 * scope; a bare token is enough.
 */
const fetchOpenSource = async (): Promise<OpenSource> => {
  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers }),
      fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed`,
        { headers }
      ),
    ]);

    if (!(userRes.ok && reposRes.ok)) {
      return EMPTY;
    }

    const user = (await userRes.json()) as ApiUser;
    const all = (await reposRes.json()) as ApiRepo[];
    const own = all.filter((r) => !(r.fork || r.archived));
    const now = Date.now();

    /*
      By last push, not by stars. Sorting on stars surfaces whatever got a
      handful of them years ago — here, 2021 coursework — which is the
      opposite of what "what am I working on" should show.
    */
    const repos: Repo[] = own
      .toSorted((a, b) => b.pushed_at.localeCompare(a.pushed_at))
      .slice(0, 4)
      .map((r) => ({
        description: r.description,
        language: r.language,
        lastPush: sincePush(r.pushed_at, now),
        name: r.name,
        stars: r.stargazers_count,
        url: r.html_url,
      }));

    /*
      Isolated: search has its own much tighter rate limit than the rest of
      the API, so a failure here is likely and must not empty the repo list
      that already succeeded.
    */
    let pullRequests: PullRequest[] = [];
    try {
      pullRequests = await fetchPullRequests(headers);
    } catch {
      // Search is rate-limited far harder than the rest of the API.
    }

    const languages = [
      ...new Set(own.map((r) => r.language).filter((l): l is string => !!l)),
    ];

    return {
      followers: user.followers,
      languages,
      publicRepos: user.public_repos,
      pullRequests,
      repos,
      stars: own.reduce((n, r) => n + r.stargazers_count, 0),
    };
  } catch {
    return EMPTY;
  }
};

export const getCachedOpenSource = unstable_cache(
  fetchOpenSource,
  ["github-open-source-v3"],
  { revalidate: 86_400 }
);
