"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

import { Favicon } from "@/components/favicon";
import type { ToolGroup } from "@/lib/about";
import { cue } from "@/lib/ui-sound";
import { cn } from "@/lib/utils";

const stackSlug = (category: string) =>
  category.toLowerCase().replaceAll("&", "").replaceAll(/\s+/gu, "-");

const categoryFromSlug = (groups: ToolGroup[], value?: string) => {
  if (!value) {
    return groups[0]?.category ?? "";
  }

  return (
    groups.find((group) => stackSlug(group.category) === value)?.category ??
    groups[0]?.category ??
    ""
  );
};

/**
 * Tabs rather than one long list, so the stack stays a glance instead of a
 * scroll. The active group lives in `?stack=` so a link can land on Web.
 */
export const StackTabs = ({
  groups,
  initial,
}: {
  groups: ToolGroup[];
  initial?: string;
}) => {
  const reduce = useReducedMotion();
  const router = useRouter();
  const pathname = usePathname();
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(() => categoryFromSlug(groups, initial));

  const select = (category: string, index: number) => {
    if (category !== active) {
      void cue("select", { step: index });
    }
    setActive(category);
    const first = groups[0]?.category;
    const href =
      category === first
        ? pathname
        : `${pathname}?stack=${stackSlug(category)}`;
    router.replace(href, { scroll: false });
  };

  const onTabKey = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const current = groups.findIndex((group) => group.category === active);
    if (current === -1) {
      return;
    }

    let next = current;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = (current + 1) % groups.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (current - 1 + groups.length) % groups.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = groups.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const group = groups[next];
    if (!group) {
      return;
    }
    select(group.category, next);
    tabRefs.current[next]?.focus();
  };

  return (
    <>
      <div
        className="border-border flex flex-wrap gap-x-4 border-b"
        onKeyDown={onTabKey}
        role="tablist"
        tabIndex={-1}
      >
        {groups.map((group, index) => {
          const isActive = group.category === active;
          const showRule = isActive && reduce;

          return (
            <button
              aria-controls={`${baseId}-panel-${stackSlug(group.category)}`}
              aria-selected={isActive}
              className={cn(
                "relative -mb-px cursor-pointer border-b border-transparent pb-2 text-xs transition-[color,border-color,scale] duration-300 active:scale-[0.96]",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
                showRule && "border-current"
              )}
              id={`${baseId}-tab-${stackSlug(group.category)}`}
              key={group.category}
              onClick={() => select(group.category, index)}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              role="tab"
              tabIndex={isActive ? 0 : -1}
              type="button"
            >
              {group.category}
              {isActive && !reduce ? (
                <motion.span
                  className="bg-foreground absolute inset-x-0 -bottom-px h-px"
                  layoutId="stack-underline"
                  transition={{ bounce: 0, duration: 0.3, type: "spring" }}
                />
              ) : null}
            </button>
          );
        })}
      </div>

      {groups.map((group) => (
        <ul
          aria-labelledby={`${baseId}-tab-${stackSlug(group.category)}`}
          className="grid gap-2.5 text-sm"
          hidden={group.category !== active}
          id={`${baseId}-panel-${stackSlug(group.category)}`}
          key={group.category}
          role="tabpanel"
        >
          {group.tools.map((tool) => (
            <li
              className="flex items-baseline gap-2 leading-relaxed"
              key={tool.name}
            >
              <Favicon
                className="translate-y-0.5"
                icon={tool.icon}
                label={tool.name}
              />
              <a
                className="hover:text-muted-foreground shrink-0 font-medium transition-colors duration-300"
                href={tool.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                {tool.name}
              </a>
              <span className="text-muted-foreground">{tool.note}</span>
            </li>
          ))}
        </ul>
      ))}
    </>
  );
};
