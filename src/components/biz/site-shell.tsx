import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { useBizStore } from "@/lib/bizassist-store";
import { cn } from "@/lib/utils";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="bg-gradient-primary grid size-8 place-items-center rounded-lg font-display text-sm font-bold text-primary-foreground">
        B
      </span>
      <span className="font-display text-[15px] font-semibold tracking-tight">BizAssist</span>
      <span className="eyebrow">AI</span>
    </Link>
  );
}

const nav = [
  { to: "/discover", label: "Discover" },
  { to: "/compare", label: "Compare" },
  { to: "/requests", label: "My requests" },
  { to: "/owner", label: "For owners" },
] as const;

export function SiteShell({ children, wide }: { children: ReactNode; wide?: boolean }) {
  const compareCount = useBizStore((s) => s.compare.length);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="transition-colors hover:text-foreground"
                  activeProps={{ className: "text-foreground" }}
                >
                  {item.label}
                  {item.to === "/compare" && compareCount > 0 ? (
                    <span className="ml-1.5 rounded-full bg-primary/15 px-1.5 py-0.5 font-mono text-[10px] text-primary">
                      {compareCount}
                    </span>
                  ) : null}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/discover"
              className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
            >
              Browse businesses
            </Link>
            <Link
              to="/owner"
              className="bg-gradient-primary rounded-lg px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Owner sign in
            </Link>
          </div>
        </div>
      </header>

      <main className={cn("flex-1", wide ? "" : "")}>{children}</main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-sm text-muted-foreground">
            BizAssist AI prototype — sample businesses, no live messaging, payment or scheduling
            integrations.
          </p>
          <p className="eyebrow">AI answers only from owner-approved business data</p>
        </div>
      </footer>
    </div>
  );
}

export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{title}</h1>
        {description ? (
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
