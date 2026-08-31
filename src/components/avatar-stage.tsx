"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import type { PointerEvent, ReactNode } from "react";

/**
 * A few degrees of tilt and a light that follows the pointer. Drag was
 * easy to shove while reading, so the photograph stays put.
 */
const SPRING = { damping: 16, mass: 0.6, stiffness: 140 };
const TILT = 8;

export const AvatarStage = ({ children }: { children: ReactNode }) => {
  const reduce = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, SPRING);
  const springY = useSpring(rotateY, SPRING);

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType !== "mouse") {
      return;
    }

    const box = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width;
    const py = (event.clientY - box.top) / box.height;
    rotateY.set((px - 0.5) * TILT * 2);
    rotateX.set((0.5 - py) * TILT * 2);
    event.currentTarget.style.setProperty("--spot-x", `${px * 100}%`);
    event.currentTarget.style.setProperty("--spot-y", `${py * 100}%`);
  };

  const onLeave = (event: PointerEvent<HTMLDivElement>) => {
    rotateX.set(0);
    rotateY.set(0);
    event.currentTarget.style.setProperty("--spot-x", "50%");
    event.currentTarget.style.setProperty("--spot-y", "28%");
  };

  return (
    <div className="relative float-right mb-4 ml-6 w-28 [perspective:720px] sm:w-36">
      <motion.div
        className="group relative overflow-hidden rounded-lg outline outline-black/10 dark:outline-white/10"
        onPointerLeave={onLeave}
        onPointerMove={onMove}
        style={{
          rotateX: springX,
          rotateY: springY,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-200 [background:radial-gradient(circle_at_var(--spot-x,50%)_var(--spot-y,28%),rgb(255_255_255/0.28),transparent_55%)] motion-reduce:hidden [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100"
        />
      </motion.div>
    </div>
  );
};
