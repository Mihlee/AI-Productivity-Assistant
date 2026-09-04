import { Link } from "@tanstack/react-router";

import type { Business } from "@/lib/bizassist-data";
import { useBizActions, useBizStore } from "@/lib/bizassist-store";
import { cn } from "@/lib/utils";

export function AiStatusPill({ status }: { status: Business["aiStatus"] }) {
  const live = status === "live";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em]",
        live
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border bg-muted text-muted-foreground",
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {live ? "AI live" : "AI limited data"}
    </span>
  );
}

export function BusinessCard({ business }: { business: Business }) {
  const compare = useBizStore((s) => s.compare);
  const { toggleCompare } = useBizActions();
  const selected = compare.includes(business.slug);
  const cheapest = business.services[0];

  return (
    <article className="surface-panel flex flex-col rounded-2xl p-5 transition-colors hover:border-primary/25">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="bg-gradient-primary grid size-10 shrink-0 place-items-center rounded-xl font-display text-[13px] font-bold text-primary-foreground">
            {business.initials}
          </span>
          <div>
            <p className="eyebrow">{business.category}</p>
            <h3 className="mt-1 font-display text-base font-semibold">
              <Link
                to="/business/$slug"
                params={{ slug: business.slug }}
                className="hover:text-primary"
              >
                {business.name}
              </Link>
            </h3>
          </div>
        </div>
        <AiStatusPill status={business.aiStatus} />
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{business.tagline}</p>

      <dl className="mt-4 space-y-1.5 text-[13px]">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-muted-foreground">Popular</dt>
          <dd className="text-right">
            {cheapest.name} · {cheapest.price}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-muted-foreground">Hours</dt>
          <dd className="text-right">{business.hours[0].day + " " + business.hours[0].open}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-muted-foreground">Area</dt>
          <dd>{business.city}</dd>
        </div>
      </dl>

      <div className="mt-5 flex items-center gap-2">
        <Link
          to="/chat/$slug"
          params={{ slug: business.slug }}
          className="bg-gradient-primary flex-1 rounded-lg px-3 py-2 text-center text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Ask AI
        </Link>
        <Link
          to="/business/$slug"
          params={{ slug: business.slug }}
          className="rounded-lg border border-border px-3 py-2 text-[13px] transition-colors hover:bg-surface-2"
        >
          Profile
        </Link>
        <button
          type="button"
          onClick={() => toggleCompare(business.slug)}
          className={cn(
            "rounded-lg border px-3 py-2 text-[13px] transition-colors",
            selected
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border hover:bg-surface-2",
          )}
        >
          {selected ? "Added" : "Compare"}
        </button>
      </div>
    </article>
  );
}
