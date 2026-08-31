"use client";

import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

import { site } from "@/lib/site";
import { cue } from "@/lib/ui-sound";
import { cn } from "@/lib/utils";

interface Item {
  href?: string;
  hint: string;
  id: string;
  label: string;
  external?: boolean;
}

const ITEMS: Item[] = [
  { hint: "/", href: "/", id: "home", label: "Home" },
  { hint: "/about", href: "/about", id: "about", label: "About" },
  { hint: "/crafts", href: "/crafts", id: "crafts", label: "Crafts" },
  { hint: "/writing", href: "/writing", id: "writing", label: "Writing" },
  {
    external: true,
    hint: "tui.bmohak.xyz",
    href: site.tui,
    id: "tui",
    label: "TUI",
  },
  {
    external: true,
    hint: "github.com",
    href: site.socials[0].href,
    id: "github",
    label: "GitHub",
  },
  {
    external: true,
    hint: "x.com",
    href: site.socials[1].href,
    id: "x",
    label: "X",
  },
  {
    external: true,
    hint: "linkedin.com",
    href: site.socials[2].href,
    id: "linkedin",
    label: "LinkedIn",
  },
  {
    external: true,
    hint: "resume.bmohak.xyz",
    href: site.resume,
    id: "resume",
    label: "Resume",
  },
  {
    external: true,
    hint: site.email,
    href: `mailto:${site.email}`,
    id: "email",
    label: "Email",
  },
];

const pad = (index: number) => String(index + 1).padStart(2, "0");

/**
 * ⌘K is the TUI answering on the website. Not a card, not a list of
 * muted names — a prompt, an inverted bar, and the destinations.
 */
export const CommandK = () => {
  const router = useRouter();
  const labelId = useId();
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [clock, setClock] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return ITEMS;
    }

    return ITEMS.filter((item) => {
      const hay = `${item.label} ${item.hint}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("command-k", onOpen);
    return () => window.removeEventListener("command-k", onOpen);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (open) {
          setOpen(false);
          setQuery("");
          setActive(0);
          return;
        }
        setOpen(true);
        return;
      }

      if (open && event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        setQuery("");
        setActive(0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    void cue("select");

    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useLayoutEffect(() => {
    const node = dialogRef.current;
    if (!open || !node) {
      return;
    }

    if (!node.open) {
      node.showModal();
    }

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (!coarse) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const tick = () => {
      setClock(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          hour12: false,
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Kolkata",
        }).format(new Date())
      );
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [open]);

  const close = () => {
    dialogRef.current?.close();
    setOpen(false);
    setQuery("");
    setActive(0);
  };

  const go = (item: Item) => {
    close();
    if (item.id === "tui" && item.href) {
      setNote("opening tui.bmohak.xyz");
      void cue("select");
      window.open(item.href, "_blank", "noopener,noreferrer");
      window.setTimeout(() => setNote(null), 1400);
      return;
    }
    if (item.href?.startsWith("mailto:")) {
      window.location.assign(item.href);
      return;
    }
    if (item.href && item.external) {
      window.open(item.href, "_blank", "noopener,noreferrer");
      return;
    }
    if (item.href) {
      router.push(item.href);
    }
  };

  const onInputKey = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current) =>
        items.length === 0 ? 0 : (current + 1) % items.length
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) =>
        items.length === 0 ? 0 : (current - 1 + items.length) % items.length
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const item = items[active];
      if (item) {
        go(item);
      }
      return;
    }

    if (!query && /^[1-9]$/u.test(event.key)) {
      const item = items[Number(event.key) - 1];
      if (item) {
        event.preventDefault();
        go(item);
      }
    }
  };

  return (
    <>
      {open ? (
        <dialog
          aria-labelledby={labelId}
          className="text-foreground fixed inset-0 z-[60] m-0 grid h-dvh max-h-none w-full max-w-none place-items-center overflow-y-auto overscroll-contain border-0 bg-[rgba(255,255,255,0.55)] p-0 backdrop-blur-xl backdrop:bg-transparent dark:bg-[rgba(0,0,0,0.55)]"
          onCancel={(event) => {
            event.preventDefault();
            close();
          }}
          ref={dialogRef}
        >
          <button
            aria-label="Close"
            className="absolute inset-0"
            onClick={close}
            tabIndex={-1}
            type="button"
          />

          <div
            className={cn(
              "command-k-session pointer-events-auto relative z-10 w-full max-w-sm px-6",
              "[font-family:var(--font-jetbrains-mono),ui-monospace,monospace]"
            )}
          >
            <div className="text-muted-foreground mb-8 flex items-baseline justify-between text-xs">
              <span>bmohak.xyz</span>
              <span className="tabular-nums">{clock ?? "⌘K"}</span>
            </div>

            <label className="sr-only" htmlFor={inputId} id={labelId}>
              Go to
            </label>
            <div className="flex items-center gap-2 text-sm">
              <span aria-hidden="true" className="text-muted-foreground">
                {">"}
              </span>
              <input
                autoComplete="off"
                autoCorrect="off"
                className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent caret-current outline-none"
                id={inputId}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKey}
                placeholder="go to"
                ref={inputRef}
                spellCheck={false}
                value={query}
              />
              <span aria-hidden="true" className="tui-cursor text-foreground">
                █
              </span>
            </div>

            <ul className="mt-6">
              {items.length === 0 ? (
                <li className="text-muted-foreground px-2 py-1 text-sm">
                  nothing matches
                </li>
              ) : (
                items.map((item, index) => {
                  const current = index === active;

                  return (
                    <li key={item.id}>
                      <button
                        aria-current={current ? "true" : undefined}
                        className={cn(
                          "flex w-full items-baseline justify-between gap-4 px-2 py-1 text-left text-sm",
                          current
                            ? "bg-foreground text-background"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                        onClick={() => go(item)}
                        onPointerEnter={() => setActive(index)}
                        type="button"
                      >
                        <span className="flex min-w-0 items-baseline gap-3">
                          <span
                            className={cn(
                              "w-4 shrink-0 tabular-nums",
                              current
                                ? "text-background/50"
                                : "text-muted-foreground"
                            )}
                          >
                            {pad(index)}
                          </span>
                          <span>{item.label}</span>
                        </span>
                        <span
                          className={cn(
                            "min-w-0 truncate text-xs",
                            current
                              ? "text-background/50"
                              : "text-muted-foreground"
                          )}
                        >
                          {item.hint}
                        </span>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>

            <p className="text-muted-foreground mt-8 text-xs">
              <span className="tabular-nums">{items.length}</span>
              {items.length === 1 ? " match" : " matches"}
              <span className="mx-2">·</span>
              ↑↓
              <span className="mx-2">·</span>↵<span className="mx-2">·</span>
              1–9
              <span className="mx-2">·</span>
              esc
            </p>
          </div>
        </dialog>
      ) : null}
      {note ? (
        <div
          aria-live="polite"
          className="pointer-events-none fixed inset-x-0 bottom-14 z-[70] flex justify-center px-6"
        >
          <p className="text-foreground bg-[rgba(255,255,255,0.82)] px-2 py-1 [font-family:var(--font-jetbrains-mono),ui-monospace,monospace] text-xs dark:bg-[rgba(0,0,0,0.82)]">
            {note}
          </p>
        </div>
      ) : null}
    </>
  );
};
