import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { PageHeading, SiteShell } from "@/components/biz/site-shell";
import { compareBusinesses } from "@/lib/ai.functions";
import { BUSINESSES, getBusiness } from "@/lib/bizassist-data";
import { useBizActions, useBizStore } from "@/lib/bizassist-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare businesses — BizAssist AI" },
      {
        name: "description",
        content:
          "Put up to three listed businesses side by side and compare services, prices, durations, hours and policies from owner-approved data only.",
      },
      { property: "og:title", content: "Compare businesses — BizAssist AI" },
      {
        property: "og:description",
        content:
          "Side-by-side comparison of services, prices, hours and policies, with a neutral AI summary that never invents ratings or availability.",
      },
    ],
  }),
  component: Compare,
});

function Compare() {
  const slugs = useBizStore((s) => s.compare);
  const { toggleCompare, clearCompare } = useBizActions();
  const runCompare = useServerFn(compareBusinesses);

  const [summary, setSummary] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const selected = slugs.map((slug) => getBusiness(slug)).filter((b): b is NonNullable<typeof b> => Boolean(b));

  async function summarise() {
    setBusy(true);
    setError("");
    setSummary("");
    try {
      const res = await runCompare({ data: { slugs } });
      setSummary(res.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not build the comparison.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <PageHeading
          eyebrow="Side by side"
          title="Compare businesses"
          description="Only stored, owner-approved fields are compared. No ratings, distances or availability are inferred."
        >
          {selected.length > 0 ? (
            <button
              onClick={clearCompare}
              className="rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Clear selection
            </button>
          ) : null}
        </PageHeading>

        {selected.length < 2 ? (
          <div className="surface-panel mt-8 rounded-2xl p-6 sm:p-8">
            <p className="text-sm text-muted-foreground">
              Pick two or three businesses from Discover to compare them here.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {BUSINESSES.map((b) => (
                <button
                  key={b.slug}
                  onClick={() => toggleCompare(b.slug)}
                  className={cn(
                    "rounded-full border px-3.5 py-2 text-sm transition-colors",
                    slugs.includes(b.slug)
                      ? "border-primary/45 bg-primary/12 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {b.name}
                </button>
              ))}
            </div>
            <Link
              to="/discover"
              className="mt-6 inline-block text-sm text-primary hover:underline"
            >
              Browse all businesses →
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {selected.map((b) => (
                <div key={b.slug} className="surface-panel rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="eyebrow">{b.category}</p>
                      <h2 className="mt-1.5 font-display text-lg font-semibold">{b.name}</h2>
                      <p className="text-sm text-muted-foreground">{b.city}</p>
                    </div>
                    <button
                      onClick={() => toggleCompare(b.slug)}
                      className="text-xs text-muted-foreground transition-colors hover:text-destructive"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-5">
                    <p className="eyebrow">Services &amp; prices</p>
                    <ul className="mt-2.5 space-y-2">
                      {b.services.map((s) => (
                        <li key={s.id} className="flex items-baseline justify-between gap-3 text-sm">
                          <span>{s.name}</span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {s.price} · {s.duration}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5">
                    <p className="eyebrow">Hours</p>
                    <ul className="mt-2.5 space-y-1.5 text-sm text-muted-foreground">
                      {b.hours.map((h) => (
                        <li key={h.day} className="flex justify-between gap-3">
                          <span>{h.day}</span>
                          <span className="font-mono text-xs">{h.open}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5">
                    <p className="eyebrow">Policies</p>
                    <ul className="mt-2.5 space-y-1.5 text-sm text-muted-foreground">
                      {b.policies.map((p) => (
                        <li key={p}>· {p}</li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to="/chat/$slug"
                    params={{ slug: b.slug }}
                    className="mt-6 block rounded-xl border border-border py-2.5 text-center text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    Ask this business
                  </Link>
                </div>
              ))}
            </div>

            <div className="surface-panel mt-6 rounded-2xl p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">AI comparison</p>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    A neutral summary of the differences that are actually in the stored data.
                  </p>
                </div>
                <button
                  onClick={summarise}
                  disabled={busy}
                  className="bg-gradient-primary rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {busy ? "Comparing…" : "Summarise differences"}
                </button>
              </div>

              {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
              {summary ? (
                <div className="mt-4 space-y-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                  {summary}
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
    </SiteShell>
  );
}
