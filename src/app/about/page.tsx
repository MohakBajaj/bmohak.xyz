import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import type { ReactNode } from "react";

import { AvatarStage } from "@/components/avatar-stage";
import { Favicon } from "@/components/favicon";
import {
  GitHubContributions,
  GitHubContributionsFallback,
} from "@/components/github-contributions";
import { OpenSourceSection } from "@/components/open-source";
import { PageShell } from "@/components/site-shell";
import { StackTabs } from "@/components/stack-tabs";
import { projects, stack, work } from "@/lib/about";
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
    "Where I've worked, what I've shipped, and the tools still in daily rotation.",
  title: "About",
};

const LINK = "text-foreground underline underline-offset-4";
const PROSE = "text-muted-foreground leading-relaxed";

/* A page description, not a bio line: what is on the page, the way his reads. */
const ABOUT_INTRO =
  "Where I've worked, what I've shipped, and the tools still in daily rotation.";

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

const About = async ({ searchParams }: PageProps<"/about">) => {
  const params = await searchParams;
  const stackParam =
    typeof params.stack === "string" ? params.stack : undefined;
  const openSource = await getCachedOpenSource();
  // Not awaited: it streams into the Suspense boundary below.
  const contributions = getCachedContributions(GITHUB_USERNAME);

  return (
    <PageShell description={ABOUT_INTRO} title="About">
      <div className="page-enter grid grid-cols-[minmax(0,1fr)] gap-10 text-sm [--page-enter-base:120ms]">
        <section>
          {/* Float, so the prose wraps around it the way his does. */}
          <AvatarStage>
            <Image
              alt="Mohak Bajaj"
              className="h-auto w-full"
              draggable={false}
              height={720}
              priority
              src="/avatar.jpg"
              width={720}
            />
          </AvatarStage>

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
              </a>{" "}
              in Delhi NCR, where I design and build an AI-native marketing
              platform. My degree is in Computer Science with a DevOps
              specialisation, so I care just as much about the pipeline and
              runtime as the application running on top of them.
            </p>
            <p>
              I build with coding agents every day, and I review every diff
              before it merges. Most of this site was written that way. The rule
              for AI in products is simpler: if the model is not doing real work
              the user actually notices, it does not belong in the product.
            </p>
            <p>
              Outside of day-job architecture, I ship tools in public and write
              about what broke along the way. A local-first Mac capture app
              rewritten from Electron to Rust (
              <a
                className={LINK}
                href="https://sayjot.xyz"
                rel="noopener noreferrer"
                target="_blank"
              >
                Jot
              </a>
              ), a portfolio that answers on port 22, a multiplayer live-coding
              jam booth from a weekend buildathon, and plenty of experiments
              that never left the repo. The work lives on{" "}
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
            Beyond day jobs, I gave my first talk live at{" "}
            <a
              className={LINK}
              href="https://github.com/MohakBajaj/build-2026-cli-live"
              rel="noopener noreferrer"
              target="_blank"
            >
              Microsoft Build //localhost
            </a>{" "}
            in Gurugram, mentored and judged the 36-hour EQUINOX hackathon with
            Google Developer Groups, and earlier served as Secretary of the
            Xe-Tech Club at UPES (established by{" "}
            <a
              className={LINK}
              href="https://xebia.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              Xebia
            </a>
            ), where I organised XeFest. I also placed third at INFAthon 4.0,
            competed in eYantra at IIT Bombay, and volunteered as an IT teacher
            at Adharshila NGO. Full timeline is in the{" "}
            <a
              className={LINK}
              href={site.resume}
              rel="noopener noreferrer"
              target="_blank"
            >
              resume
            </a>{" "}
            and on{" "}
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
            Graduated in 2025 with a B.Tech in Computer Science &amp;
            Engineering (DevOps specialisation) from the{" "}
            <a
              className={LINK}
              href="https://www.upes.ac.in"
              rel="noopener noreferrer"
              target="_blank"
            >
              University of Petroleum and Energy Studies
            </a>
            , Dehradun (2021 – 2025, 8.31 CGPA). Completed Class XII (CBSE) at
            Preet Public School in Delhi in 2020 (89%).
          </p>
        </Section>

        <Section title="Stack">
          <StackTabs
            groups={stack}
            initial={stackParam}
            key={stackParam ?? "ai"}
          />
        </Section>
      </div>
    </PageShell>
  );
};

export default About;
