import type { ReactNode } from "react";

import { CopyButton } from "@/components/registry/copy-button";
import { demoSource, installCommand, registryItem } from "@/lib/registry";

/**
 * Server component. The source block is read from the demo file at build
 * time, so what the page shows is the code that type-checks, not a string
 * that drifts. Same idea as the shadcn and ncdai registries.
 */
export const CraftStage = async ({
  children,
  name,
}: {
  children: ReactNode;
  name: string;
}) => {
  const { props } = registryItem(name);
  const source = await demoSource(name);
  const command = installCommand(name);

  return (
    <div className="my-8 grid gap-6">
      <div className="not-typeset grid gap-4">
        {children}
        <div className="flex items-baseline justify-between gap-4">
          <code className="text-muted-foreground scroll-fade-x min-w-0 overflow-x-auto font-mono text-[12px]">
            {command}
          </code>
          <CopyButton className="shrink-0" value={command} />
        </div>
      </div>
      <pre>
        <code>{source}</code>
      </pre>
      <dl className="not-typeset">
        {props.map((prop) => (
          <div
            className="border-border flex flex-wrap items-baseline justify-between gap-x-4 border-t py-2 text-xs first:border-t-0"
            key={prop.name}
          >
            <dt className="font-medium">{prop.name}</dt>
            <dd className="text-muted-foreground font-mono">
              {prop.defaultValue
                ? `${prop.type} = ${prop.defaultValue}`
                : prop.type}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};
