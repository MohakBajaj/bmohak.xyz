import { cn } from "@/lib/utils";

/**
 * Marks are fetched once at author time into public/favicons rather than
 * proxied through a favicon service at render: a service would tell a third
 * party every outbound domain on this page, for every visitor, and would 404
 * unpredictably.
 *
 * They render as a mask filled with `currentColor`, not as an image. The site
 * is black and white, and a colour logo is neither — so scripts/mono-favicons
 * flattens each one to a single channel (alpha) ahead of time and the mask
 * paints the shape in whatever the theme's foreground happens to be. A CSS
 * filter could not do this: half of these ship an opaque tile, which would
 * come out a solid square.
 *
 * Anything without a file falls back to its initial in a ring — the same
 * fallback lifeline uses for unregistered companies.
 */
export const Favicon = ({
  icon,
  label,
  className,
}: {
  icon?: string;
  label: string;
  className?: string;
}) =>
  icon ? (
    <span
      aria-hidden="true"
      className={cn("size-4 shrink-0 bg-current", className)}
      style={{
        maskImage: `url(${icon})`,
        maskPosition: "center",
        maskRepeat: "no-repeat",
        maskSize: "contain",
      }}
    />
  ) : (
    <span
      aria-hidden="true"
      className={cn(
        "border-border text-muted-foreground grid size-4 shrink-0 place-items-center rounded-full border text-[9px] font-medium",
        className
      )}
    >
      {label.charAt(0).toUpperCase()}
    </span>
  );
