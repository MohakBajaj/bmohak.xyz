import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";

/**
 * Required by @next/mdx in the App Router. Almost empty on purpose: typeset
 * styles the rendered markdown from the container class in
 * app/writing/(posts)/layout.tsx, so elements need no components of their own.
 *
 * The exception is <pre>, typeset's one scroll surface — a wide code block
 * scrolls sideways with no cue that it does. scroll-fade masks the edge and
 * eases it as you scroll.
 */
const components: MDXComponents = {
  pre: (props: ComponentProps<"pre">) => (
    <pre {...props} className="scroll-fade-x" />
  ),
};

export const useMDXComponents = (): MDXComponents => components;
