import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { BusinessCard } from "@/components/biz/business-card";
import { PageHeading, SiteShell } from "@/components/biz/site-shell";
import { BUSINESSES, CATEGORIES } from "@/lib/bizassist-data";
import { useBizStore } from "@/lib/bizassist-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover businesses — BizAssist AI" },
      {
        name: "description",
        content:
          "Search participating businesses by category, service or keyword and see pricing, hours and AI availability before you ask a question.",
      },
      { property: "og:title", content: "Discover businesses — BizAssist AI" },
      {
        property: "og:description",
        content:
          "Browse listed businesses with services, pricing highlights, operating hours and AI availability, then ask or compare.",
      },
    ],
  }),
  component: Discover,
});

function Discover() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const compareCount = useBizStore((s) => s.compare.length);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BUSINESSES.filter((b) => {
      const inCategory = category === CATEGORIES[0] || b.category === category;
      if (!inCategory) return false;
      if (!q) return true;
      const haystack = [
        b.name,
        b.category,
        b.tagline,
        b.city,
        b.about,
        ...b.services.map((s) => `${s.name} ${s.description}`),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, category]);

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <PageHeading
          eyebrow="Marketplace"
          title="Discover businesses"
          description="Every listing below is a participating business with an approved profile. Search by service, category or keyword."
        >
          {compareCount > 0 ? (
            <Link
              to="/compare"
              className="bg-gradient-primary rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Compare {compareCount} selected →
            </Link>
          ) : null}
        </PageHeading>

        <div className="surface-panel mt-8 rounded-2xl p-4 sm:p-5">
          <label className="block">
            <span className="eyebrow">Search</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Try "deep clean", "fade", "lunch boxes"…'
              className="mt-2 w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-ring/40"
            />
          </label>

          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs transition-colors",
                  c === category
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-surface-2",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <p className="eyebrow mt-6">
          {results.length} {results.length === 1 ? "business" : "businesses"} found
        </p>

        {results.length === 0 ? (
          <div className="surface-panel mt-4 rounded-2xl p-10 text-center">
            <h2 className="font-display text-lg font-semibold">No matching business</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Nothing in the participating businesses matches that search. Try a broader keyword or
              clear the category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory(CATEGORIES[0]);
              }}
              className="mt-5 rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-surface-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
