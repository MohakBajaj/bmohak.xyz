"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * Letters hold their seat. A `#` swapping in for an `i` must not shove the
 * line. Reduced motion, and anything that is not a mouse, leave the word
 * alone.
 */
const GLYPHS = "01#*+=/\\";

const lockWidths = (nodes: (HTMLSpanElement | null)[]) => {
  for (const node of nodes) {
    if (!node) {
      continue;
    }
    node.style.width = "";
    node.style.width = `${node.getBoundingClientRect().width}px`;
  }
};

export const DecodeText = ({
  text,
  trigger = "hover",
  durationMs = 380,
  staggerMs = 28,
  className,
  labelled = false,
}: {
  text: string;
  trigger?: "hover" | "mount";
  durationMs?: number;
  staggerMs?: number;
  className?: string;
  labelled?: boolean;
}) => {
  const reduce = useReducedMotion();
  const letters = [...text];
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const frameRef = useRef(0);
  const scrambleRef = useRef(() => {
    // Assigned after scramble is declared.
  });

  const paint = (value: string, index: number) => {
    const node = charsRef.current[index];
    if (node) {
      node.textContent = value;
    }
  };

  const settle = () => {
    cancelAnimationFrame(frameRef.current);
    for (const [index, char] of letters.entries()) {
      paint(char, index);
    }
  };

  const scramble = () => {
    if (reduce) {
      return;
    }

    cancelAnimationFrame(frameRef.current);
    const started = performance.now();

    const tick = (now: number) => {
      const elapsed = now - started;
      let done = true;

      for (const [index, char] of letters.entries()) {
        if (char === " ") {
          continue;
        }

        const begin = index * staggerMs;
        const end = begin + durationMs;

        if (elapsed < begin) {
          done = false;
          continue;
        }

        if (elapsed >= end) {
          paint(char, index);
          continue;
        }

        done = false;
        const glyph = GLYPHS[Math.trunc(Math.random() * GLYPHS.length)];
        paint(glyph ?? char, index);
      }

      if (done) {
        settle();
        return;
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
  };

  useLayoutEffect(() => {
    scrambleRef.current = scramble;
  });

  useEffect(() => {
    let cancelled = false;

    const relock = async () => {
      try {
        await document.fonts?.ready;
      } catch {
        return;
      }

      if (!cancelled) {
        lockWidths(charsRef.current);
      }
    };

    lockWidths(charsRef.current);
    void relock();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  useEffect(() => {
    if (trigger !== "mount" || reduce) {
      return;
    }

    const id = window.setTimeout(() => {
      scrambleRef.current();
    }, 80);
    return () => window.clearTimeout(id);
  }, [trigger, reduce]);

  return (
    <span
      className={className}
      onPointerEnter={(event) => {
        if (trigger === "hover" && event.pointerType === "mouse") {
          scramble();
        }
      }}
      onPointerLeave={trigger === "hover" ? settle : undefined}
    >
      {labelled ? null : <span className="sr-only">{text}</span>}
      <span aria-hidden="true">
        {letters.map((char, index) => (
          <span
            className="inline-block"
            key={`${char}-${index.toString()}`}
            ref={(node) => {
              charsRef.current[index] = node;
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </span>
  );
};
