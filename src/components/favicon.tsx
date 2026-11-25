import { cn } from "@/lib/utils";

/**
 * Marks are fetched once at author time into public/favicons rather than
 * proxied through a favicon service at render: a service would tell a third
 * party every outbound domain on this page, for every visitor, and would 404
 * unpredictably.
 *
 * Marks render in their own colour. A path under /favicons/mono/ instead
 * renders as a mask filled with `currentColor`: kept for marks that are black
 * on transparent (they vanish on the dark theme) and for GitHub, which repeats
 * down whole lists. scripts/mono-favicons builds those alpha-only files.
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
}) => {
  if (!icon) {
    return (
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
  }
  if (icon.includes("/mono/")) {
    return (
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
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt=""
      aria-hidden="true"
      className={cn("size-4 shrink-0 rounded-[3px] object-contain", className)}
      decoding="async"
      loading="lazy"
      src={icon}
    />
  );
};
