import { Link, createFileRoute } from "@tanstack/react-router";

import { BusinessCard } from "@/components/biz/business-card";
import { PhoneMockup } from "@/components/biz/phone-mockup";
import { SiteShell } from "@/components/biz/site-shell";
import { BUSINESSES } from "@/lib/bizassist-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BizAssist AI — Ask businesses. Compare options. Get things done." },
      {
        name: "description",
        content:
          "Discover local businesses, ask each one's AI assistant about services, prices and hours, compare options and send a booking request for owner confirmation.",
      },
      {
        property: "og:title",
        content: "BizAssist AI — Ask businesses. Compare options. Get things done.",
      },
      {
        property: "og:description",
        content:
          "An AI business discovery and customer-service hub: chat with any listed business, compare them on stored facts, and send requests owners confirm themselves.",
      },
    ],
  }),
  component: Landing,
});

const steps = [
  {
    n: "01",
    title: "Find a business",
    body: "Search by service, category or keyword. Every listing shows services, pricing, hours and whether its AI is live.",
  },
  {
    n: "02",
    title: "Ask its AI",
    body: "The assistant answers from that business's approved profile only. If something isn't on file, it says so and asks.",
  },
  {
    n: "03",
    title: "Compare on facts",
    body: "Put two or three listed businesses side by side on price, duration, hours and policies. No ratings, no invented claims.",
  },
  {
    n: "04",
    title: "Send a request",
    body: "Your details become a structured request. It sits at Awaiting Owner until a human confirms or declines it.",
  },
];

function Landing() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute -top-40 -right-32 size-[560px] rounded-full bg-primary/12 blur-[130px]" />
        <div className="pointer-events-none absolute -bottom-48 -left-32 size-[420px] rounded-full bg-primary-glow/8 blur-[130px]" />

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1">
              <span className="size-1.5 rounded-full bg-primary" />
              <span className="eyebrow">{BUSINESSES.length} sample businesses listed</span>
            </span>

            <h1 className="mt-7 text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl">
              Ask businesses.
              <br />
              Compare options.
              <br />
              <span className="text-gradient">Get things done.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              BizAssist AI is a discovery and customer-service hub for small businesses. Each
              business gets its own assistant that answers strictly from what the owner has
              approved — and every booking still waits for that owner to confirm.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/discover"
                className="bg-gradient-primary rounded-xl px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Discover businesses
              </Link>
              <Link
                to="/owner"
                className="rounded-xl border border-border px-5 py-3 text-sm font-semibold transition-colors hover:bg-surface-2"
              >
                Owner command centre
              </Link>
            </div>

            <ul className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2">
              {["No invented prices", "Owner confirms every booking", "Factual comparisons"].map(
                (item) => (
                  <li key={item} className="eyebrow">
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="lg:pl-6">
            <PhoneMockup />
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-3 max-w-xl font-display text-2xl font-semibold sm:text-3xl">
            One hub for asking, comparing and requesting.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="surface-panel rounded-2xl p-5">
                <span className="font-mono text-[11px] text-primary">{s.n}</span>
                <h3 className="mt-3 font-display text-base font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Participating businesses</p>
              <h2 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">
                Start with one of these
              </h2>
            </div>
            <Link to="/discover" className="text-sm text-primary hover:underline">
              See all {BUSINESSES.length} →
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BUSINESSES.slice(0, 3).map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>

          <div className="surface-panel mt-10 rounded-2xl p-5 sm:p-6">
            <p className="eyebrow">Prototype notice</p>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              These businesses are realistic samples used to demonstrate the flow. Nothing here is a
              live integration — no real messaging channel, payment processing or calendar is
              connected, and no request reaches an actual business.
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
