import { Link, createFileRoute } from "@tanstack/react-router";

import { PageHeading, SiteShell } from "@/components/biz/site-shell";
import { StatusBadge } from "@/components/biz/status-badge";
import { useBizStore } from "@/lib/bizassist-store";
import { useOwner } from "./owner";

export const Route = createFileRoute("/owner/")({
  head: () => ({
    meta: [
      { title: "Owner dashboard — BizAssist AI" },
      {
        name: "description",
        content:
          "Review incoming AI-collected requests, confirm or decline them, and keep your services, prices and policies up to date.",
      },
      { property: "og:title", content: "Owner dashboard — BizAssist AI" },
      {
        property: "og:description",
        content:
          "One queue for every request your AI assistant collected, with drafted replies you approve before anything is sent.",
      },
    ],
  }),
  component: OwnerDashboard,
});

function OwnerDashboard() {
  const requests = useBizStore((s) => s.requests);
  const { owner, signOut } = useOwner();

  const awaiting = requests.filter((r) => r.status === "Awaiting Owner").length;
  const confirmed = requests.filter((r) => r.status === "Confirmed").length;
  const completed = requests.filter((r) => r.status === "Completed").length;

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
        <PageHeading
          eyebrow="Owner console"
          title="Request queue"
          description={`Signed in as ${owner ?? ""}. Nothing is sent to a customer until you approve a reply.`}
        >
          <div className="flex flex-wrap gap-2">
            <Link
              to="/owner/knowledge"
              className="rounded-xl border border-border px-4 py-2.5 text-sm transition-colors hover:border-primary/40 hover:text-primary"
            >
              Business knowledge
            </Link>
            <button
              onClick={signOut}
              className="rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign out
            </button>
          </div>
        </PageHeading>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Metric label="Awaiting you" value={awaiting} tone="warning" />
          <Metric label="Confirmed" value={confirmed} tone="success" />
          <Metric label="Completed" value={completed} tone="primary" />
        </div>

        <div className="mt-8 space-y-3">
          {requests.length === 0 ? (
            <div className="surface-panel rounded-2xl p-8 text-center text-sm text-muted-foreground">
              No requests yet.
            </div>
          ) : (
            requests.map((r) => (
              <Link
                key={r.id}
                to="/owner/requests/$id"
                params={{ id: r.id }}
                className="surface-panel block rounded-2xl p-5 transition-colors hover:border-primary/35"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="eyebrow">
                      {r.ref} · {r.businessName}
                    </p>
                    <h2 className="mt-1.5 font-display text-base font-semibold">
                      {r.service_or_product}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {r.customer_name} · {r.preferred_date} {r.preferred_time} ·{" "}
                      {r.estimated_price_if_known || "price not listed"}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                {r.aiSummary ? (
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{r.aiSummary}</p>
                ) : null}
              </Link>
            ))
          )}
        </div>
      </div>
    </SiteShell>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "warning" | "success" | "primary";
}) {
  const toneClass =
    tone === "warning" ? "text-warning" : tone === "success" ? "text-success" : "text-primary";
  return (
    <div className="surface-panel rounded-2xl p-5">
      <p className="eyebrow">{label}</p>
      <p className={`mt-2 font-display text-3xl font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}
