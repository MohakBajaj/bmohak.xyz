"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import type { PointerEvent, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The hit target stays put. The mark leans toward the pointer and springs
 * back, which is what makes a row of icons feel held rather than printed.
 * Mouse only: a tap already has haptics, and a sticky offset after a finger
 * lifts reads as a bug.
 */
const STRENGTH = 0.34;
const SPRING = { damping: 18, mass: 0.45, stiffness: 260 };

export const Magnetic = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);
  const springScale = useSpring(scale, SPRING);

  const onMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (reduce || event.pointerType !== "mouse") {
      return;
    }

    const box = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (box.left + box.width / 2)) * STRENGTH);
    y.set((event.clientY - (box.top + box.height / 2)) * STRENGTH);
  };

  const onEnter = (event: PointerEvent<HTMLSpanElement>) => {
    if (reduce || event.pointerType !== "mouse") {
      return;
    }
    scale.set(1.08);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  return (
    <span
      className={cn("inline-flex", className)}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onPointerMove={onMove}
    >
      <motion.span
        className="inline-flex"
        style={{ scale: springScale, x: springX, y: springY }}
      >
        {children}
      </motion.span>
    </span>
  );
};
