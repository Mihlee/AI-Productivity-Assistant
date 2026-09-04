import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { SiteShell } from "@/components/biz/site-shell";
import { StatusBadge } from "@/components/biz/status-badge";
import { generateOwnerReply } from "@/lib/ai.functions";
import { useBizActions, useBizStore } from "@/lib/bizassist-store";
import { cn } from "@/lib/utils";

const TONES = ["Friendly", "Professional", "Concise", "Apologetic"] as const;
const DECISIONS = [
  { key: "confirm", label: "Confirm" },
  { key: "clarify", label: "Ask for more info" },
  { key: "decline", label: "Decline" },
] as const;

export const Route = createFileRoute("/owner/requests/$id")({
  head: () => ({
    meta: [
      { title: "Request detail — BizAssist AI owner console" },
      {
        name: "description",
        content:
          "Review one AI-collected request, draft a reply in the tone you want, edit it, then confirm, decline or ask for more detail.",
      },
      { property: "og:title", content: "Request detail — BizAssist AI owner console" },
      {
        property: "og:description",
        content:
          "AI Response Studio drafts a reply from the request and your approved business data; you edit and send the final word.",
      },
    ],
  }),
  component: RequestDetail,
});

function RequestDetail() {
  const { id } = Route.useParams();
  const request = useBizStore((s) => s.requests.find((r) => r.id === id));
  const { updateRequest } = useBizActions();
  const draftReply = useServerFn(generateOwnerReply);

  const [tone, setTone] = useState<(typeof TONES)[number]>("Friendly");
  const [decision, setDecision] = useState<(typeof DECISIONS)[number]["key"]>("confirm");
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!request) {
    return (
      <SiteShell>
        <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8">
          <p className="text-sm text-muted-foreground">That request is no longer in the queue.</p>
          <Link to="/owner" className="mt-4 inline-block text-sm text-primary hover:underline">
            ← Back to the queue
          </Link>
        </div>
      </SiteShell>
    );
  }

  async function generate() {
    if (!request) return;
    setBusy(true);
    setError("");
    try {
      const res = await draftReply({
        data: {
          slug: request.businessSlug,
          tone,
          decision,
          request: {
            reference: request.ref,
            customer_name: request.customer_name,
            contact: request.contact,
            service_or_product: request.service_or_product,
            preferred_date: request.preferred_date,
            preferred_time: request.preferred_time,
            quantity_if_needed: request.quantity_if_needed,
            special_requirements: request.special_requirements,
            estimated_price_if_known: request.estimated_price_if_known,
            urgency: request.urgency,
          },
        },
      });
      setReply(res.reply);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not draft a reply.");
    } finally {
      setBusy(false);
    }
  }

  function send() {
    if (!request) return;
    updateRequest(request.id, {
      ownerReply: reply,
      status:
        decision === "confirm" ? "Confirmed" : decision === "decline" ? "Declined" : "Awaiting Owner",
    });
  }

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 lg:py-16">
        <Link to="/owner" className="text-sm text-muted-foreground hover:text-foreground">
          ← Request queue
        </Link>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="eyebrow">
              {request.ref} · {request.businessName}
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight">
              {request.service_or_product}
            </h1>
          </div>
          <StatusBadge status={request.status} />
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
          <div className="surface-panel rounded-2xl p-5">
            <p className="eyebrow">Request details</p>
            <dl className="mt-4 space-y-3 text-sm">
              <Row label="Customer" value={request.customer_name} />
              <Row label="Contact" value={request.contact} />
              <Row label="Preferred" value={`${request.preferred_date} · ${request.preferred_time}`} />
              <Row label="Quantity" value={request.quantity_if_needed} />
              <Row label="Price on list" value={request.estimated_price_if_known} />
              <Row label="Urgency" value={request.urgency} />
              <Row label="Notes" value={request.special_requirements} />
            </dl>
            {request.aiSummary ? (
              <div className="mt-5 rounded-xl border border-border bg-background/50 p-4">
                <p className="eyebrow">AI summary</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {request.aiSummary}
                </p>
              </div>
            ) : null}
          </div>

          <div className="surface-panel rounded-2xl p-5">
            <p className="eyebrow">AI response studio</p>

            <p className="mt-4 text-xs text-muted-foreground">Decision</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {DECISIONS.map((d) => (
                <button
                  key={d.key}
                  onClick={() => setDecision(d.key)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                    decision === d.key
                      ? "border-primary/45 bg-primary/12 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <p className="mt-5 text-xs text-muted-foreground">Tone</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                    tone === t
                      ? "border-primary/45 bg-primary/12 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={generate}
              disabled={busy}
              className="bg-gradient-primary mt-5 w-full rounded-xl py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {busy ? "Drafting…" : "Draft reply"}
            </button>

            {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={7}
              placeholder="The drafted reply appears here — edit it before you send."
              className="mt-4 w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm leading-relaxed outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-ring/40"
            />

            <button
              onClick={send}
              disabled={!reply.trim()}
              className="mt-3 w-full rounded-xl border border-primary/40 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 disabled:opacity-40"
            >
              Send reply &amp; update status
            </button>

            {request.ownerReply ? (
              <div className="mt-5 rounded-xl border border-border bg-background/50 p-4">
                <p className="eyebrow">Last reply sent</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                  {request.ownerReply}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </SiteShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right text-foreground/90">{value || "—"}</dd>
    </div>
  );
}
