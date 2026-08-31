"use client";

import Link from "next/link";
import type { PointerEvent, ReactNode } from "react";

/**
 * A wash that sits under the pointer, not under the whole row. The gradient
 * is written onto the node so a list of these does not re-render as you
 * move. Touch skips it: there is no hover to follow.
 */
const wash =
  "pointer-events-none absolute inset-0 rounded-md opacity-0 transition-opacity duration-200 [background:radial-gradient(160px_circle_at_var(--mx,50%)_var(--my,50%),currentColor,transparent_70%)] group-hover:opacity-[0.06] motion-reduce:hidden max-md:hidden";

const setSpot = (event: PointerEvent<HTMLElement>) => {
  if (event.pointerType !== "mouse") {
    return;
  }

  const box = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty(
    "--mx",
    `${event.clientX - box.left}px`
  );
  event.currentTarget.style.setProperty("--my", `${event.clientY - box.top}px`);
};

const className = "group relative -mx-3 block rounded-md px-3 py-1.5";

export const PointerLink = ({
  href,
  external = false,
  children,
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
}) => {
  const body = (
    <>
      <span aria-hidden="true" className={wash} />
      <span className="relative">{children}</span>
    </>
  );

  if (external) {
    return (
      <a
        className={className}
        href={href}
        onPointerMove={setSpot}
        rel="noopener noreferrer"
        target="_blank"
      >
        {body}
      </a>
    );
  }

  return (
    <Link className={className} href={href} onPointerMove={setSpot}>
      {body}
    </Link>
  );
};
