import {
  ChatGptIcon,
  Github01Icon,
  Linkedin01Icon,
  Mail01Icon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";

import { SoundToggle } from "@/components/sound-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { SITE_CONTAINER, site } from "@/lib/site";
import { cn } from "@/lib/utils";

const MARK: Record<string, IconSvgElement> = {
  github: Github01Icon,
  linkedin: Linkedin01Icon,
  x: NewTwitterIcon,
};

/**
 * `size-10` is the hit area, not the mark — a 14px target is unusable on
 * touch. `-my-2` keeps the row its original height, and the group's own
 * negative margin pulls the first and last boxes back by that padding so the
 * marks line up with the container edge rather than floating inside it.
 */
const ICON_LINK =
  "text-muted-foreground hover:text-foreground -my-2 inline-flex size-10 items-center justify-center transition-[color,scale] duration-300 active:scale-[0.96]";

const IconLink = ({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: IconSvgElement;
}) => (
  <a
    aria-label={label}
    className={ICON_LINK}
    href={href}
    rel="noopener noreferrer"
    target="_blank"
  >
    <HugeiconsIcon className="size-4" icon={icon} strokeWidth={1.75} />
  </a>
);

/**
 * Two surfaces, one bar. On the timeline the footer floats over a page that
 * cannot scroll, so it is translucent and ruleless: a border there would read
 * as one more horizontal line on a page already full of them. On a scrolling
 * page it is opaque with a rule, because content passes under it.
 */
export const SiteFooter = ({ floating = false }: { floating?: boolean }) => (
  <footer
    className={cn(
      "shrink-0 transition-colors duration-300",
      floating
        ? "bg-[rgba(255,255,255,0.95)] dark:bg-[rgba(0,0,0,0.95)]"
        : "border-border border-t"
    )}
  >
    <div
      className={cn(
        SITE_CONTAINER,
        "text-muted-foreground flex min-h-12 flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2 text-xs"
      )}
    >
      <span>© {site.name}. Built in public, mostly at night.</span>

      <nav className="-mx-[13px] flex items-center">
        <IconLink
          href={site.chatgpt}
          icon={ChatGptIcon}
          label={`Ask ChatGPT about ${site.name}`}
        />

        {site.socials.map((social) => (
          <IconLink
            href={social.href}
            icon={MARK[social.key]}
            key={social.href}
            label={social.label}
          />
        ))}

        <IconLink
          href={`mailto:${site.email}`}
          icon={Mail01Icon}
          label="Email"
        />

        {/* Links are destinations, the toggles change this page, so a rule
            between them stops them reading as two more links. */}
        <span aria-hidden="true" className="bg-border mx-3 h-3.5 w-px" />

        <SoundToggle />
        <ThemeToggle />
      </nav>
    </div>
  </footer>
);
