import { site } from "@/lib/site";

export const REGISTRY_NS = "@bmohak";

export type PackageManager = "bun" | "npm" | "pnpm" | "yarn";

export const PACKAGE_MANAGERS: PackageManager[] = [
  "bun",
  "pnpm",
  "npm",
  "yarn",
];

export interface RegistryProp {
  defaultValue: string;
  name: string;
  type: string;
}

export interface RegistryItem {
  description: string;
  docs: string;
  name: string;
  props: RegistryProp[];
  title: string;
  usage: string;
}

const itemUrl = (name: string) => `${site.url}/r/${name}.json`;

export const addCommand = (name: string, manager: PackageManager) => {
  const url = itemUrl(name);

  if (manager === "bun") {
    return `bunx --bun shadcn@latest add ${url}`;
  }

  if (manager === "pnpm") {
    return `pnpm dlx shadcn@latest add ${url}`;
  }

  if (manager === "yarn") {
    return `yarn dlx shadcn@latest add ${url}`;
  }

  return `npx shadcn@latest add ${url}`;
};

export const namespaceCommand = (name: string, manager: PackageManager) => {
  const spec = `${REGISTRY_NS}/${name}`;

  if (manager === "bun") {
    return `bunx --bun shadcn@latest add ${spec}`;
  }

  if (manager === "pnpm") {
    return `pnpm dlx shadcn@latest add ${spec}`;
  }

  if (manager === "yarn") {
    return `yarn dlx shadcn@latest add ${spec}`;
  }

  return `npx shadcn@latest add ${spec}`;
};

export const namespaceConfig = `{
  "registries": {
    "${REGISTRY_NS}": "${site.url}/r/{name}.json"
  }
}`;

export const registryItems: RegistryItem[] = [
  {
    description: "The grid is a force, not a wall.",
    docs: `${site.url}/crafts/snap`,
    name: "snap",
    props: [
      { defaultValue: "0.38", name: "magnet", type: "number" },
      {
        defaultValue: "—",
        name: "onSettle",
        type: "(seat: { col: number; row: number }) => void",
      },
    ],
    title: "Snap",
    usage: `import { Snap } from "@/components/ui/snap"

<Snap.Provider magnet={0.38} onSettle={(seat) => {}}>
  <Snap.Field />
</Snap.Provider>`,
  },
  {
    description: "Confirmation is how long you press.",
    docs: `${site.url}/crafts/hold`,
    name: "hold",
    props: [
      { defaultValue: "720", name: "duration", type: "number" },
      { defaultValue: '"Confirmed"', name: "confirmed", type: "ReactNode" },
      { defaultValue: "—", name: "onConfirm", type: "() => void" },
    ],
    title: "Hold",
    usage: `import { Hold } from "@/components/ui/hold"

<Hold duration={720} onConfirm={() => {}}>
  Hold to confirm
</Hold>`,
  },
  {
    description: "Sixteen steps, four voices, one sample.",
    docs: `${site.url}/crafts/step-grid`,
    name: "step-grid",
    props: [
      { defaultValue: "120", name: "defaultBpm", type: "number" },
      {
        defaultValue: "—",
        name: "onHit",
        type: "(voice: Voice, step: number) => void",
      },
    ],
    title: "Step Grid",
    usage: `import { StepGrid } from "@/components/ui/step-grid"

<StepGrid.Provider defaultBpm={120} onHit={(voice) => play(voice)}>
  <StepGrid.Pads />
  <StepGrid.Play />
  <StepGrid.Tempo />
  <StepGrid.Clear />
</StepGrid.Provider>`,
  },
];
