import { Favicon } from "@/components/favicon";
import { GITHUB_PROFILE_URL } from "@/lib/github";
import type { OpenSource } from "@/lib/github";
import { cn } from "@/lib/utils";

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="font-medium tabular-nums">{value}</div>
    <div className="text-muted-foreground text-xs">{label}</div>
  </div>
);

export const OpenSourceSection = ({ data }: { data: OpenSource }) => {
  // Rate-limited or offline: say nothing rather than render an empty shell.
  if (data.repos.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
        <Stat label="Public repos" value={String(data.publicRepos)} />
        <Stat label="Stars earned" value={String(data.stars)} />
        <Stat label="Followers" value={String(data.followers)} />
        <Stat label="Languages" value={String(data.languages.length)} />
      </div>

      <div className="grid gap-2.5">
        <h3 className="text-muted-foreground text-xs">Recently pushed</h3>

        <ul className="grid gap-2.5">
          {data.repos.map((repo) => (
            <li
              className="flex items-start justify-between gap-4"
              key={repo.name}
            >
              <div className="flex min-w-0 items-start gap-2.5">
                <Favicon
                  className="translate-y-0.5"
                  icon="/favicons/mono/github.png"
                  label={repo.name}
                />
                <p className="flex flex-wrap items-baseline gap-x-2 leading-relaxed">
                  <a
                    className="hover:text-muted-foreground font-medium transition-colors duration-300"
                    href={repo.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {repo.name}
                  </a>
                  <span className="text-muted-foreground text-pretty">
                    {repo.description ?? "No description."}
                  </span>
                </p>
              </div>

              <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                {repo.language ? `${repo.language} · ` : ""}
                {repo.lastPush}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {data.pullRequests.length > 0 ? (
        <div className="grid gap-2.5">
          <h3 className="text-muted-foreground text-xs">
            Sent to other people&apos;s repositories
          </h3>

          <ul className="grid gap-2.5">
            {data.pullRequests.map((pr) => (
              <li
                className="flex items-start justify-between gap-4"
                key={pr.url}
              >
                <div className="flex min-w-0 items-start gap-2.5">
                  <Favicon
                    className="translate-y-0.5"
                    icon="/favicons/mono/github.png"
                    label={pr.repo}
                  />
                  <p className="flex flex-wrap items-baseline gap-x-2 leading-relaxed">
                    <a
                      className="hover:text-muted-foreground font-medium transition-colors duration-300"
                      href={pr.url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {pr.repo}
                      <span className="text-muted-foreground tabular-nums">
                        #{pr.number}
                      </span>
                    </a>
                    <span className="text-muted-foreground text-pretty">
                      {pr.title}
                    </span>
                  </p>
                </div>

                {/* The outcome is the signal, not the number. Merged reads
                    plainly; open and closed are dimmed so a wall of them does
                    not look like a wall of failures. */}
                <span
                  className={cn(
                    "shrink-0 text-xs",
                    pr.state === "merged"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {pr.state}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="text-muted-foreground text-xs">
        Live from the GitHub API, cached for a day.{" "}
        <a
          className="link-underline text-foreground"
          href={GITHUB_PROFILE_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          All {data.publicRepos} repos
        </a>
        .
      </p>
    </div>
  );
};
