import { Link, createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { AiStatusPill } from "@/components/biz/business-card";
import { SiteShell } from "@/components/biz/site-shell";
import { askBusinessAI, extractRequestDraft } from "@/lib/ai.functions";
import { BUSINESSES, getBusiness } from "@/lib/bizassist-data";
import { useBizActions, useBizStore, type ChatMessage } from "@/lib/bizassist-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat/$slug")({
  loader: ({ params }) => {
    const business = getBusiness(params.slug);
    if (!business) throw notFound();
    return { business };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Chat unavailable — BizAssist AI" }, { name: "robots", content: "noindex" }],
      };
    }
    const { business } = loaderData;
    const description = `Ask ${business.name} about services, pricing, hours and policies. Answers come only from the owner-approved profile, and bookings wait for owner confirmation.`;
    return {
      meta: [
        { title: `Ask ${business.name} — BizAssist AI` },
        { name: "description", content: description },
        { property: "og:title", content: `Ask ${business.name} — BizAssist AI` },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ChatPage,
});

type Draft = {
  customer_name: string;
  contact: string;
  service_or_product: string;
  preferred_date: string;
  preferred_time: string;
  quantity_if_needed: string;
  special_requirements: string;
  estimated_price_if_known: string;
  urgency: "Standard" | "Soon" | "Urgent";
};

const emptyDraft: Draft = {
  customer_name: "",
  contact: "",
  service_or_product: "",
  preferred_date: "",
  preferred_time: "",
  quantity_if_needed: "",
  special_requirements: "",
  estimated_price_if_known: "",
  urgency: "Standard",
};

function ChatPage() {
  const { business } = Route.useLoaderData();
  const navigate = useNavigate();
  const stored = useBizStore((s) => s.chats[business.slug]);
  const { setChat, addRequest } = useBizActions();
  const [input, setInput] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [summary, setSummary] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const greeting: ChatMessage = {
    role: "assistant",
    content: `Hi, I'm the BizAssist assistant for ${business.name}. I can answer from what the owner has published — services, prices, durations, hours and policies. What are you looking for?`,
  };
  const messages = stored?.length ? stored : [greeting];

  const ask = useServerFn(askBusinessAI);
  const extract = useServerFn(extractRequestDraft);

  const chat = useMutation({
    mutationFn: (next: ChatMessage[]) =>
      ask({
        data: {
          slug: business.slug,
          messages: next.map(({ role, content }) => ({ role, content })),
        },
      }),
    onSuccess: (res, next) => setChat(business.slug, [...next, { role: "assistant", ...res, content: res.reply }]),
    onError: (err: Error) => toast.error(err.message || "The assistant could not reply."),
  });

  const buildDraft = useMutation({
    mutationFn: () =>
      extract({
        data: {
          slug: business.slug,
          messages: messages.map(({ role, content }) => ({ role, content })),
        },
      }),
    onSuccess: (res) => {
      setDraft({
        customer_name: res.customer_name ?? "",
        contact: res.contact ?? "",
        service_or_product: res.service_or_product ?? "",
        preferred_date: res.preferred_date ?? "",
        preferred_time: res.preferred_time ?? "",
        quantity_if_needed: res.quantity_if_needed ?? "",
        special_requirements: res.special_requirements ?? "",
        estimated_price_if_known: res.estimated_price_if_known ?? "",
        urgency: res.urgency ?? "Standard",
      });
      setSummary(res.summary ?? "");
      if (res.missing_fields?.length) {
        toast.info(`Still needed: ${res.missing_fields.join(", ")}`);
      }
    },
    onError: (err: Error) => {
      setDraft(emptyDraft);
      toast.error(err.message || "Could not read the details — fill them in below.");
    },
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, chat.isPending]);

  function send(text: string) {
    const value = text.trim();
    if (!value || chat.isPending) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: value }];
    setChat(business.slug, next);
    setInput("");
    chat.mutate(next);
  }

  function submitRequest() {
    if (!draft) return;
    if (!draft.customer_name || !draft.contact || !draft.service_or_product) {
      toast.error("Name, contact and service are needed before sending.");
      return;
    }
    const created = addRequest({
      businessSlug: business.slug,
      businessName: business.name,
      status: "Awaiting Owner",
      aiSummary: summary,
      ...draft,
    });
    setDraft(null);
    setChat(business.slug, [
      ...messages,
      {
        role: "assistant",
        content: `Your request ${created.ref} has been sent to ${business.name} for confirmation. It is not booked yet — you'll see the status change once the owner responds.`,
      },
    ]);
    toast.success(`Request ${created.ref} sent — awaiting owner confirmation.`);
  }

  const others = BUSINESSES.filter((b) => b.slug !== business.slug);

  return (
    <SiteShell>
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_340px]">
        <section className="surface-panel flex min-h-[70vh] flex-col overflow-hidden rounded-3xl">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="bg-gradient-primary grid size-10 place-items-center rounded-xl font-display text-[13px] font-bold text-primary-foreground">
                {business.initials}
              </span>
              <div>
                <p className="font-display text-[15px] font-semibold">{business.name}</p>
                <Link
                  to="/business/$slug"
                  params={{ slug: business.slug }}
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  View profile, services and policies →
                </Link>
              </div>
            </div>
            <AiStatusPill status={business.aiStatus} />
          </header>

          <p className="border-b border-border bg-warning/6 px-5 py-2.5 text-[12px] leading-relaxed text-muted-foreground">
            <span className="font-mono text-[10px] tracking-[0.14em] text-warning uppercase">
              AI disclosure
            </span>{" "}
            You are chatting with an AI assistant, not a person. It answers only from{" "}
            {business.name}&apos;s approved information and cannot confirm bookings.
          </p>

          <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                  m.role === "user"
                    ? "ml-auto rounded-tr-sm border border-primary/25 bg-primary/10"
                    : "rounded-tl-sm bg-surface-2",
                )}
              >
                {m.content}
              </div>
            ))}
            {chat.isPending ? (
              <div className="flex w-fit items-center gap-2 rounded-2xl rounded-tl-sm bg-surface-2 px-4 py-3">
                <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
                <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
                <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
              </div>
            ) : null}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border px-5 py-4">
            {messages.length <= 1 ? (
              <div className="mb-3 flex flex-wrap gap-2">
                {[
                  `What does ${business.services[0]?.name.toLowerCase()} cost?`,
                  "What are your hours this week?",
                  "What's your cancellation policy?",
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : null}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask ${business.name} a question…`}
                className="flex-1 rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-ring/40"
              />
              <button
                type="submit"
                disabled={chat.isPending || !input.trim()}
                className="bg-gradient-primary rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {chat.isPending ? "Sending…" : "Send"}
              </button>
            </form>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="surface-panel rounded-2xl p-5">
            <p className="eyebrow">Booking / order request</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              When you&apos;re ready, turn the conversation into a structured request. It starts at
              Awaiting Owner — {business.name} confirms or declines it.
            </p>
            <button
              type="button"
              onClick={() => buildDraft.mutate()}
              disabled={buildDraft.isPending}
              className="bg-gradient-primary mt-4 w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {buildDraft.isPending ? "Preparing request…" : "Prepare request from chat"}
            </button>

            {draft ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitRequest();
                }}
                className="mt-5 space-y-3"
              >
                {(
                  [
                    ["customer_name", "Your name"],
                    ["contact", "Contact (phone or email)"],
                    ["service_or_product", "Service or product"],
                    ["preferred_date", "Preferred date"],
                    ["preferred_time", "Preferred time"],
                    ["quantity_if_needed", "Quantity (if relevant)"],
                    ["estimated_price_if_known", "Price on the list"],
                    ["special_requirements", "Special requirements"],
                  ] as [keyof Draft, string][]
                ).map(([key, label]) => (
                  <label key={key} className="block">
                    <span className="eyebrow">{label}</span>
                    <input
                      value={draft[key]}
                      onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                      className="mt-1.5 w-full rounded-lg border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/50"
                    />
                  </label>
                ))}
                <label className="block">
                  <span className="eyebrow">Urgency</span>
                  <select
                    value={draft.urgency}
                    onChange={(e) =>
                      setDraft({ ...draft, urgency: e.target.value as Draft["urgency"] })
                    }
                    className="mt-1.5 w-full rounded-lg border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/50"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Soon">Soon</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </label>
                <button
                  type="submit"
                  className="w-full rounded-xl border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary"
                >
                  Send for owner confirmation
                </button>
                <p className="text-[11.5px] leading-relaxed text-muted-foreground">
                  Nothing is booked until the owner confirms. Only these details are shared.
                </p>
              </form>
            ) : null}
          </div>

          <div className="surface-panel rounded-2xl p-5">
            <p className="eyebrow">Ask another business</p>
            <ul className="mt-3 space-y-1.5">
              {others.map((b) => (
                <li key={b.slug}>
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/chat/$slug", params: { slug: b.slug } })}
                    className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-surface-2"
                  >
                    <span>{b.name}</span>
                    <span className="font-mono text-[10px] text-muted-foreground uppercase">
                      {b.category}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <Link
              to="/compare"
              className="mt-3 block rounded-lg border border-border px-3 py-2 text-center text-sm transition-colors hover:bg-surface-2"
            >
              Compare businesses
            </Link>
          </div>

          <div className="surface-panel rounded-2xl p-5">
            <p className="eyebrow">Privacy</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              This assistant can only see {business.name}&apos;s data. It has no access to other
              businesses&apos; information, and it won&apos;t ask for ID numbers or payment details.
            </p>
          </div>
        </aside>
      </div>
    </SiteShell>
  );
}
