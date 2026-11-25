"use client";

import { useCallback } from "react";

import { useSoundPreference } from "@/components/sound-toggle";
import { useSound } from "@/hooks/use-sound";
import { switchOnSound } from "@/lib/switch-on";
import { VOICE_RATE } from "@/registry/ui/step-grid";
import type { Voice } from "@/registry/ui/step-grid";

export const useStepGridHit = () => {
  const { enabled: sound } = useSoundPreference();
  const [playSwitch] = useSound(switchOnSound, {
    soundEnabled: sound,
    volume: 0.4,
  });

  return useCallback(
    (voice: Voice) => {
      playSwitch({ playbackRate: VOICE_RATE[voice], volume: 0.35 });
    },
    [playSwitch]
  );
};
