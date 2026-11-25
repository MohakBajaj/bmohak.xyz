"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

export const CopyButton = ({
  className,
  label = "Copy",
  value,
}: {
  className?: string;
  label?: string;
  value: string;
}) => {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard blocked. Leave the label as-is.
    }
  };

  return (
    <button
      className={cn(
        "text-muted-foreground hover:text-foreground min-h-8 text-xs transition-[color,scale] active:scale-[0.96]",
        className
      )}
      onClick={onCopy}
      type="button"
    >
      {copied ? "Copied" : label}
    </button>
  );
};
