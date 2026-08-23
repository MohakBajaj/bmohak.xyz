import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import next from "ultracite/oxlint/next";
import react from "ultracite/oxlint/react";

// ponytail: shadcn-registry source is vendored, not authored here. Format it,
// don't lint it — `shadcn add`/`apply` rewrites these paths wholesale.
const VENDORED = [
  "src/components/ui/**",
  "src/components/lifeline/**",
  "src/lib/lifeline-data.ts",
  "src/components/contribution-graph.tsx",
  "src/components/github-contributions.tsx",
  "src/lib/haptic.ts",
  "src/lib/get-cached-contributions.ts",
  "src/components/toc-minimap.tsx",
  "src/components/line-nav.tsx",
  "src/hooks/**",
  "src/lib/sound-*.ts",
  "src/lib/click-soft.ts",
  "src/lib/hover-tick.ts",
  "src/lib/switch-on.ts",
  "src/lib/switch-off.ts",
  "src/lib/u-mini-map-open.ts",
];

/*
  Author-side scripts, run by hand and never bundled. The preset above is a
  React/Next preset, and its stylistic rules — no-bitwise, no-plusplus,
  prefer-destructuring — are wrong for a pixel loop, where `i++` and `>> 4`
  quantisation are the idiom. Still formatted, just not linted as app code.
*/
const SCRIPTS = ["scripts/**"];

/*
  One file, one rule, one reason: JSON-LD cannot be injected any other way in
  React, and the payload is a local literal. See the comment in the file.
*/
const SILENCED = ["src/components/json-ld.tsx"];

export default defineConfig({
  extends: [core, next, react],
  ignorePatterns: [
    ...(core.ignorePatterns ?? []),
    ...VENDORED,
    ...SCRIPTS,
    ...SILENCED,
  ],
});
