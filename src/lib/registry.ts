import { readFile } from "node:fs/promises";
import path from "node:path";

import { site } from "@/lib/site";

import registry from "../../registry.json";

export interface RegistryProp {
  defaultValue?: string;
  name: string;
  type: string;
}

/**
 * registry.json is the source of truth for names, titles and files (it is
 * what `shadcn build` reads). This only adds what the schema has no field for.
 */
const PROPS: Record<string, RegistryProp[]> = {
  "step-grid": [
    { defaultValue: "120", name: "defaultBpm", type: "number" },
    { name: "onHit", type: "(voice: Voice, step: number) => void" },
  ],
};

export const registryItem = (name: string) => {
  const item = registry.items.find((row) => row.name === name);

  if (!item) {
    throw new Error(`Missing registry item: ${name}`);
  }

  return { ...item, props: PROPS[name] ?? [] };
};

// ponytail: URL form because @bmohak is not in ui.shadcn.com/r/registries.json.
// Switch to `@bmohak/${name}` once the namespace is listed there.
export const installCommand = (name: string) =>
  `bunx --bun shadcn@latest add ${site.url}/r/${name}.json`;

/** Demo source, read at build time so docs show code that type-checks. */
export const demoSource = (name: string) =>
  readFile(
    path.join(process.cwd(), "src/registry/examples", `${name}-demo.tsx`),
    "utf-8"
  );
