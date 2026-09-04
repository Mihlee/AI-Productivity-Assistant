import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { AiStatusPill } from "@/components/biz/business-card";
import { SiteShell } from "@/components/biz/site-shell";
import { getBusiness } from "@/lib/bizassist-data";
import { useBizActions, useBizStore } from "@/lib/bizassist-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/business/$slug")({
  loader: ({ params }) => {
    const business = getBusiness(params.slug);
    if (!business) throw notFound();
    return { business };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Business unavailable — BizAssist AI" }, { name: "robots", content: "noindex" }],
      };
    }
    const { business } = loaderData;
    const description = `${business.name} in ${business.city}: services, pricing, hours and policies. Ask its BizAssist AI assistant or send a booking request.`;
    return {
      meta: [
        { title: `${business.name} — BizAssist AI` },
        { name: "description", content: description },
        { property: "og:title", content: `${business.name} — BizAssist AI` },
        { property: "og:description", content: description },
      ],
    };
  },
  component: BusinessProfile,
});

function BusinessProfile() {
  const { business } = Route.useLoaderData();
  const compare = useBizStore((s) => s.compare);
  const { toggleCompare } = useBizActions();
  const selected = compare.includes(business.slug);

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
        <Link to="/discover" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to discovery
        </Link>

        <header className="surface-panel mt-5 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <span className="bg-gradient-primary grid size-14 shrink-0 place-items-center rounded-2xl font-display text-lg font-bold text-primary-foreground">
                {business.initials}
              </span>
              <div>
                <p className="eyebrow">
                  {business.category} · {business.city}
                </p>
                <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
                  {business.name}
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {business.about}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3">
              <AiStatusPill status={business.aiStatus} />
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/chat/$slug"
                  params={{ slug: business.slug }}
                  className="bg-gradient-primary rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Ask {business.name.split(" ")[0]} AI
                </Link>
                <button
                  type="button"
                  onClick={() => toggleCompare(business.slug)}
                  className={cn(
                    "rounded-xl border px-4 py-2.5 text-sm transition-colors",
                    selected
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border hover:bg-surface-2",
                  )}
                >
                  {selected ? "Added to compare" : "Add to compare"}
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <section className="surface-panel rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold">Services &amp; pricing</h2>
            <ul className="mt-4 divide-y divide-border">
              {business.services.map((s) => (
                <li key={s.id} className="flex flex-wrap items-start justify-between gap-4 py-4">
                  <div className="max-w-md">
                    <p className="font-medium">{s.name}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {s.description}
                    </p>
                    {s.availabilityNote ? (
                      <p className="mt-1.5 font-mono text-[11px] text-warning">
                        {s.availabilityNote}
                      </p>
                    ) : null}
                  </div>
                  <div className="text-right">
                    <p className="font-display text-base font-semibold">{s.price}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{s.duration}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <div className="space-y-6">
            <section className="surface-panel rounded-2xl p-6">
              <h2 className="font-display text-lg font-semibold">Hours</h2>
              <dl className="mt-4 space-y-2 text-sm">
                {business.hours.map((h) => (
                  <div key={h.day} className="flex items-center justify-between gap-4">
                    <dt className="text-muted-foreground">{h.day}</dt>
                    <dd>{h.open}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="surface-panel rounded-2xl p-6">
              <h2 className="font-display text-lg font-semibold">Policies</h2>
              <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
                {business.policies.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                    {p}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <p className="eyebrow">Source of truth</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Everything on this page is what the owner approved. The AI assistant may only answer
                from it, and it can never confirm a booking on the owner&apos;s behalf.
              </p>
            </section>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
