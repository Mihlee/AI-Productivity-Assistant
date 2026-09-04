import { Link, createFileRoute } from "@tanstack/react-router";

import { PageHeading, SiteShell } from "@/components/biz/site-shell";
import { StatusBadge } from "@/components/biz/status-badge";
import { useBizStore } from "@/lib/bizassist-store";

export const Route = createFileRoute("/requests")({
  head: () => ({
    meta: [
      { title: "My requests — BizAssist AI" },
      {
        name: "description",
        content:
          "Track every booking or order request you sent through BizAssist AI, with its status and the owner's reply.",
      },
      { property: "og:title", content: "My requests — BizAssist AI" },
      {
        property: "og:description",
        content:
          "See which requests are awaiting the owner, confirmed, declined or completed, along with the details that were sent.",
      },
    ],
  }),
  component: Requests,
});

function Requests() {
  const requests = useBizStore((s) => s.requests);

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 lg:py-16">
        <PageHeading
          eyebrow="Customer view"
          title="My requests"
          description="Nothing here is a confirmed booking until the business owner replies. Requests are stored on this device for the prototype."
        />

        {requests.length === 0 ? (
          <div className="surface-panel mt-8 rounded-2xl p-8 text-center">
            <p className="text-sm text-muted-foreground">You haven't sent any requests yet.</p>
            <Link
              to="/discover"
              className="bg-gradient-primary mt-5 inline-block rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Find a business
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {requests.map((r) => (
              <article key={r.id} className="surface-panel rounded-2xl p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="eyebrow">Request {r.ref}</p>
                    <h2 className="mt-1.5 font-display text-lg font-semibold">{r.businessName}</h2>
                    <p className="text-sm text-muted-foreground">{r.service_or_product}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>

                <dl className="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                  <Field label="When" value={`${r.preferred_date} · ${r.preferred_time}`} />
                  <Field label="Quantity" value={r.quantity_if_needed} />
                  <Field label="Price on list" value={r.estimated_price_if_known} />
                  <Field label="Urgency" value={r.urgency} />
                  <Field label="Contact" value={r.contact} />
                  <Field label="Notes" value={r.special_requirements} />
                </dl>

                {r.ownerReply ? (
                  <div className="mt-5 rounded-xl border border-border bg-background/50 p-4">
                    <p className="eyebrow">Owner reply</p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/90">{r.ownerReply}</p>
                  </div>
                ) : (
                  <p className="mt-5 text-xs text-muted-foreground">
                    Waiting for {r.businessName} to respond.
                  </p>
                )}

                <Link
                  to="/chat/$slug"
                  params={{ slug: r.businessSlug }}
                  className="mt-5 inline-block text-sm text-primary hover:underline"
                >
                  Open the conversation →
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </SiteShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-1 text-foreground/90">{value || "—"}</dd>
    </div>
  );
}
