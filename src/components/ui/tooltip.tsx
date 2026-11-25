"use client";

import {
  createTooltipController,
  Tooltip as TooltipPrimitive,
  TooltipArrow,
  TooltipContent as TooltipContentPrimitive,
  type TooltipContentState,
  TooltipTrigger,
  type TooltipProps,
} from "@ui-sdk/react/tooltip";

import { cn } from "@/lib/utils";

// ponytail: ui-sdk groups tooltips without a provider; delay 0 keeps the old provider default.
function Tooltip({ delay = 0, ...props }: TooltipProps) {
  return <TooltipPrimitive delay={delay} {...props} />;
}

const arrow = (
  <TooltipArrow className="bg-foreground z-50 size-2.5 rotate-45 rounded-[2px] data-[side=bottom]:-top-1 data-[side=left]:-right-1 data-[side=right]:-left-1 data-[side=top]:-bottom-1" />
);

/*
  Renders in place, not in a portal: keep it outside an <svg>, or the
  browser will not draw it. Pair it with a controller there.
*/
function TooltipContent<Payload = unknown>({
  className,
  children,
  ...props
}: Omit<
  React.ComponentProps<typeof TooltipContentPrimitive<Payload>>,
  "children" | "className"
> & {
  children?:
    | React.ReactNode
    | ((state: TooltipContentState<Payload>) => React.ReactNode);
  className?: string;
}) {
  return (
    <TooltipContentPrimitive<Payload>
      className={cn(
        "bg-foreground text-background z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-[opacity,scale] duration-100 data-ending-style:scale-95 data-ending-style:opacity-0 data-instant:transition-none data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-opacity",
        className
      )}
      {...props}
    >
      {(state) => (
        <>
          {typeof children === "function" ? children(state) : children}
          {arrow}
        </>
      )}
    </TooltipContentPrimitive>
  );
}

export { createTooltipController, Tooltip, TooltipContent, TooltipTrigger };
