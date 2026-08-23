import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";

/*
  Omit strokeWidth: the registry types these as SVG props, where it is
  `string | number`, then spreads them onto HugeiconsIcon, which takes only
  `number`. It is hardcoded below anyway, so dropping it from the surface is
  the whole fix. Re-adding this item from the registry reintroduces the error.
*/
function Spinner({
  className,
  ...props
}: Omit<React.ComponentProps<"svg">, "strokeWidth">) {
  return (
    <HugeiconsIcon
      icon={Loading03Icon}
      strokeWidth={2}
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
