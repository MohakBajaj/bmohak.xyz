"use client";

import { useReducedMotion } from "motion/react";
import { useState } from "react";

/**
 * The word "night" in the footer sentence. Stars on hover. It does not
 * change the theme — the sun/moon in this row already owns that.
 */
const STARS = [
  { d: 1.4, delay: "0ms", x: -18, y: -10 },
  { d: 1.1, delay: "80ms", x: 8, y: -16 },
  { d: 1.6, delay: "140ms", x: 22, y: -6 },
  { d: 1, delay: "40ms", x: -6, y: 12 },
  { d: 1.3, delay: "200ms", x: 16, y: 10 },
  { d: 1.2, delay: "110ms", x: 36, y: -14 },
  { d: 1.5, delay: "60ms", x: -28, y: 4 },
] as const;

export const NightWord = () => {
  const reduce = useReducedMotion();
  const [on, setOn] = useState(false);

  return (
    <span
      className="relative inline-block"
      onPointerEnter={() => setOn(true)}
      onPointerLeave={() => setOn(false)}
    >
      night
      {on ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2"
        >
          {STARS.map((star) => (
            <span
              className="night-star bg-foreground absolute rounded-full"
              key={`${star.x}-${star.y}`}
              style={{
                animationDelay: reduce ? undefined : star.delay,
                height: star.d,
                transform: `translate(${star.x}px, ${star.y}px)`,
                width: star.d,
              }}
            />
          ))}
        </span>
      ) : null}
    </span>
  );
};
