import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import type { ReactNode } from "react";

import { Favicon } from "@/components/favicon";
import {
  GitHubContributions,
  GitHubContributionsFallback,
} from "@/components/github-contributions";
import { OpenSourceSection } from "@/components/open-source";
import { PageShell } from "@/components/site-shell";
import { StackTabs } from "@/components/stack-tabs";
import { achievements, projects, stack, work } from "@/lib/about";
import { getCachedContributions } from "@/lib/get-cached-contributions";
import {
  GITHUB_PROFILE_URL,
  GITHUB_USERNAME,
  getCachedOpenSource,
} from "@/lib/github";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  description:
    "Where I've worked, what I've shipped, and the tools that survived.",
  title: "About",
};

const LINK = "text-foreground underline underline-offset-4";
const PROSE = "text-muted-foreground leading-relaxed";

/* A page description, not a bio line — what is on the page, the way his reads. */
const ABOUT_INTRO =
  "Where I've worked, what I've shipped, and the tools that survived.";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  /* grid-cols-[minmax(0,1fr)]: a grid track defaults to max-content, so one
     wide child — the contribution calendar — sizes the track and blows the
     whole column past its cap instead of scrolling inside it. */
  <section className="grid grid-cols-[minmax(0,1fr)] gap-4">
    <h2 className="font-heading text-sm font-medium tracking-tight text-balance">
      {title}
    </h2>
    {children}
  </section>
);

const About = async () => {
  const openSource = await getCachedOpenSource();
  // Not awaited: it streams into the Suspense boundary below.
  const contributions = getCachedContributions(GITHUB_USERNAME);

  return (
    <PageShell description={ABOUT_INTRO} title="About">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 text-sm">
        <section>
          {/* Float, so the prose wraps around it the way his does. */}
          <Image
            alt="Mohak Bajaj"
            className="float-right mb-4 ml-6 w-28 rounded-lg outline outline-black/10 sm:w-36 dark:outline-white/10"
            height={720}
            priority
            src="/avatar.jpg"
            width={720}
          />

          <div className={`space-y-3 text-pretty ${PROSE}`}>
            <p>
              I&apos;m a full stack architect at{" "}
              <a
                className={LINK}
                href="https://cambrianedge.ai"
                rel="noopener noreferrer"
                target="_blank"
              >
                CambrianEdge.ai
              </a>
              , where I lead the architecture of an AI-native marketing
              platform. B.Tech in CSE with a DevOps specialisation. Based in
              Delhi NCR.
            </p>
            <p>
              The work sits between the application and the pipeline that ships
              it. I use AI aggressively. An agent wrote most of what runs on
              this domain, and I read every diff before it lands. If the model
              isn&apos;t responsible for the outcome the user cares about,
              it&apos;s decoration, and it comes out.
            </p>
            <p>
              Most of what I learn goes out in public, the misses included. A
              portfolio that answers on port 22. A multiplayer live-coding jam
              booth built over a weekend. A SaaS I never launched. The receipts
              are on{" "}
              <a
                className={LINK}
                href={site.socials[0].href}
                rel="noopener noreferrer"
                target="_blank"
              >
                GitHub
              </a>{" "}
              and{" "}
              <a
                className={LINK}
                href={site.socials[1].href}
                rel="noopener noreferrer"
                target="_blank"
              >
                X
              </a>
              .
            </p>
          </div>
        </section>

        <Section title="Work">
          <div className="grid gap-7">
            {work.map((role) => (
              <div
                className="grid gap-3 sm:grid-cols-[40px_1fr] sm:gap-4"
                key={`${role.company}-${role.period}`}
              >
                <div className="border-border grid aspect-square w-10 place-items-center rounded-lg border sm:w-full">
                  <Favicon
                    className="size-5"
                    icon={role.icon}
                    label={role.company}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid">
                      <h3 className="font-medium">
                        {role.href ? (
                          <a
                            className="hover:text-muted-foreground transition-colors duration-300"
                            href={role.href}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {role.company}
                          </a>
                        ) : (
                          role.company
                        )}
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        {role.role}
                      </p>
                    </div>
                    <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                      {role.period}
                    </span>
                  </div>

                  <p className={`text-pretty ${PROSE}`}>
                    {role.highlights.join(" ")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className={`border-border border-t border-dotted pt-5 ${PROSE}`}>
            Alongside the roles above I was Secretary of the Xe-Tech Club at
            UPES, established by{" "}
            <a
              className={LINK}
              href="https://xebia.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              Xebia
            </a>
            , and organised XeFest. {achievements[0]} {achievements[1]}{" "}
            {achievements[3]} There is a{" "}
            <a
              className={LINK}
              href={site.resume}
              rel="noopener noreferrer"
              target="_blank"
            >
              resume
            </a>{" "}
            too, and the rest is on{" "}
            <a
              className={LINK}
              href={site.socials[2].href}
              rel="noopener noreferrer"
              target="_blank"
            >
              LinkedIn
            </a>
            .
          </p>
        </Section>

        <Section title="Projects">
          <ul className="grid gap-2.5">
            {projects.map((project) => (
              <li
                className="flex items-start justify-between gap-4"
                key={project.name}
              >
                {/* items-start + nudge: a description that wraps to two lines
                  would otherwise centre the mark between them instead of
                  against the name it belongs to. */}
                <div className="flex min-w-0 items-start gap-2.5">
                  <Favicon
                    className="translate-y-0.5"
                    icon={project.icon}
                    label={project.name}
                  />
                  <p className="flex flex-wrap items-baseline gap-x-2 leading-relaxed">
                    <a
                      className="hover:text-muted-foreground font-medium transition-colors duration-300"
                      href={project.href ?? project.repo}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {project.name}
                    </a>
                    <span className="text-muted-foreground">
                      {project.description}
                    </span>
                  </p>
                </div>
                {project.status ? (
                  <span className="text-muted-foreground shrink-0 text-xs">
                    {project.status}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Open source">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
            <Suspense fallback={<GitHubContributionsFallback />}>
              <GitHubContributions
                contributions={contributions}
                githubProfileUrl={GITHUB_PROFILE_URL}
              />
            </Suspense>

            <OpenSourceSection data={openSource} />
          </div>
        </Section>

        <Section title="Education">
          <p className={PROSE}>
            I hold a B.Tech in Computer Science &amp; Engineering with a DevOps
            specialisation from the{" "}
            <a
              className={LINK}
              href="https://www.upes.ac.in"
              rel="noopener noreferrer"
              target="_blank"
            >
              University of Petroleum and Energy Studies
            </a>
            , Dehradun (2021 – 2025), graduating with an 8.31 CGPA. Before that,
            XII (CBSE) at Preet Public School in Delhi in 2020, at 89%.
          </p>
        </Section>

        <Section title="Stack">
          <StackTabs groups={stack} />
        </Section>
      </div>
    </PageShell>
  );
};

export default About;
