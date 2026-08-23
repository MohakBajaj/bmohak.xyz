"use client";

import { useState } from "react";

import { Favicon } from "@/components/favicon";
import type { ToolGroup } from "@/lib/about";
import { cue } from "@/lib/ui-sound";
import { cn } from "@/lib/utils";

/**
 * Tabs rather than one long list, so the stack stays a glance instead of a
 * scroll. State is the only reason this is a client component; the panels
 * themselves are plain markup.
 */
export const StackTabs = ({ groups }: { groups: ToolGroup[] }) => {
  const [active, setActive] = useState(groups[0]?.category ?? "");

  return (
    <>
      <div
        className="border-border flex flex-wrap gap-x-4 border-b"
        role="tablist"
      >
        {groups.map((group, index) => (
          <button
            aria-controls={`stack-panel-${group.category}`}
            aria-selected={group.category === active}
            className={cn(
              "-mb-px cursor-pointer border-b border-transparent pb-2 text-xs transition-[color,border-color,scale] duration-300 active:scale-[0.96]",
              group.category === active
                ? "text-foreground border-current"
                : "text-muted-foreground hover:text-foreground"
            )}
            id={`stack-tab-${group.category}`}
            key={group.category}
            onClick={() => {
              if (group.category !== active) {
                cue("select", { step: index });
              }
              setActive(group.category);
            }}
            role="tab"
            type="button"
          >
            {group.category}
          </button>
        ))}
      </div>

      {groups.map((group) => (
        <ul
          aria-labelledby={`stack-tab-${group.category}`}
          className="grid gap-2.5 text-sm"
          hidden={group.category !== active}
          id={`stack-panel-${group.category}`}
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
