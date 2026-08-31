"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

import { cue } from "@/lib/ui-sound";

/**
 * The pointer writes. A click on empty ground writes harder. The layer
 * never takes a hit: it only watches, so links and tabs keep working.
 */
const GLYPHS = "01#*+=/\\░";
const POOL = 18;
const GAP_MS = 34;
const BURST = 8;
const SKIP =
  "a, button, input, textarea, select, [role='tab'], [role='dialog'], .lifeline-typeset, [data-lifeline]";

const stamp = (
  node: HTMLSpanElement,
  x: number,
  y: number,
  driftX: number,
  driftY: number
) => {
  const glyph = GLYPHS[Math.trunc(Math.random() * GLYPHS.length)];
  node.textContent = glyph ?? "#";
  node.style.left = `${x + driftX}px`;
  node.style.top = `${y + driftY}px`;
  node.classList.remove("is-on");
  void node.offsetWidth;
  node.classList.add("is-on");
};

export const Playfield = () => {
  const reduce = useReducedMotion();
  const layerRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef(0);
  const indexRef = useRef(0);

  useEffect(() => {
    if (reduce) {
      return;
    }

    const layer = layerRef.current;
    if (!layer) {
      return;
    }

    const pool: HTMLSpanElement[] = [];
    for (let n = 0; n < POOL; n += 1) {
      const node = document.createElement("span");
      node.className = "playfield-glyph";
      node.setAttribute("aria-hidden", "true");
      layer.append(node);
      pool.push(node);
    }

    const take = () => {
      const node = pool[indexRef.current % pool.length];
      indexRef.current += 1;
      return node;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }

      const now = performance.now();
      if (now - lastRef.current < GAP_MS) {
        return;
      }
      lastRef.current = now;

      const node = take();
      if (!node) {
        return;
      }
      stamp(node, event.clientX, event.clientY, 0, 0);
    };

    const onDown = (event: PointerEvent) => {
      const { target } = event;
      if (target instanceof Element && target.closest(SKIP)) {
        return;
      }

      for (let n = 0; n < BURST; n += 1) {
        const node = take();
        if (!node) {
          return;
        }
        stamp(
          node,
          event.clientX,
          event.clientY,
          (Math.random() - 0.5) * 48,
          (Math.random() - 0.5) * 48
        );
      }
      void cue("tick");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      layer.replaceChildren();
    };
  }, [reduce]);

  return <div aria-hidden="true" className="playfield" ref={layerRef} />;
};
