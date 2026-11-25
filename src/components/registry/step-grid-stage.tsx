"use client";

import { useStepGridHit } from "@/hooks/use-step-grid-hit";
import { StepGrid } from "@/registry/ui/step-grid";

/** The live grid, wired to the site's sound. The demo file stays dependency-free. */
export const StepGridLive = () => {
  const onHit = useStepGridHit();

  return (
    <StepGrid.Provider onHit={onHit}>
      <StepGrid.Preview />
    </StepGrid.Provider>
  );
};
