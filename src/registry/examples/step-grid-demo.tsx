"use client";

import { StepGrid } from "@/registry/ui/step-grid";

const StepGridDemo = () => (
  <StepGrid.Provider defaultBpm={120} onHit={(voice) => console.log(voice)}>
    <StepGrid.Frame>
      <StepGrid.Pads />
      <StepGrid.Caption>
        <StepGrid.Play />
        <StepGrid.Tempo />
        <StepGrid.Clear />
      </StepGrid.Caption>
    </StepGrid.Frame>
  </StepGrid.Provider>
);

export default StepGridDemo;
