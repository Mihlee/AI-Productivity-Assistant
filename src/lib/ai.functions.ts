import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { businessProfileForPrompt, getBusiness } from "./bizassist-data";

const MODEL = "openai/gpt-5.6-sol";
const ENDPOINT = "https://ai.gateway.lovable.dev/v1/responses";

type ResponseInputItem = {
  role: "user" | "assistant" | "system";
  content: { type: "input_text" | "output_text"; text: string }[];
};

function toItems(messages: { role: "user" | "assistant"; content: string }[]): ResponseInputItem[] {
  return messages.map((m) => ({
    role: m.role,
    content: [{ type: m.role === "assistant" ? "output_text" : "input_text", text: m.content }],
  }));
}

/**
 * Calls the gateway Responses API with streaming (required for reasoning models)
 * and returns the accumulated output text.
 */
async function runGateway(body: Record<string, unknown>): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured on this deployment.");

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({ ...body, model: MODEL, stream: true, store: false }),
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("The assistant is busy right now. Try again shortly.");
    if (res.status === 402)
      throw new Error("AI credits are exhausted for this workspace. The owner needs to top up.");
    if (res.status === 403)
      throw new Error("AI access is blocked for this workspace by an admin setting.");
    throw new Error(`AI request failed (${res.status}). ${detail.slice(0, 200)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const evt = JSON.parse(payload) as {
          type?: string;
          delta?: string;
          response?: { output_text?: string };
        };
        if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
          text += evt.delta;
        } else if (evt.type === "response.completed" && evt.response?.output_text && !text) {
          text = evt.response.output_text;
        }
      } catch {
        /* ignore keep-alive / partial frames */
      }
    }
  }

  return text.trim();
}

function systemPrompt(slug: string): string {
  const business = getBusiness(slug);
  if (!business) throw new Error("Unknown business.");
  return [
    `You are BizAssist AI for ${business.name}.`,
    "Answer customer questions using only the approved business information below.",
    "",
    businessProfileForPrompt(business),
    "",
    "Rules:",
    "- Never invent a price, service, availability, policy or business detail.",
    "- If the information is not in the approved data, say clearly that you do not have it and ask a useful follow-up question.",
    "- Never say a booking or order is confirmed. Only the owner can confirm; say the request will be sent for owner confirmation.",
    "- Say explicitly when an answer is based on limited information.",
    "- You have no access to any other business's data. If asked, say so.",
    "- Do not ask for sensitive information beyond a name, a contact detail and the booking details.",
    "- Keep answers concise, warm and practical. Use short paragraphs, no headings.",
    "- When the customer wants to book or order, collect: name, contact, service, preferred date, preferred time, quantity if relevant, and any special requirements.",
  ].join("\n");
}

const ChatInput = z.object({
  slug: z.string().min(1),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .min(1)
    .max(40),
});

export const askBusinessAI = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const text = await runGateway({
      instructions: systemPrompt(data.slug),
      input: toItems(data.messages),
      reasoning: { effort: "low", summary: "auto" },
      include: ["reasoning.encrypted_content"],
    });
    return {
      reply:
        text ||
        "I could not put an answer together just now. Could you rephrase that, or ask about a specific service?",
    };
  });

const ExtractInput = z.object({
  slug: z.string().min(1),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .min(1)
    .max(40),
});

export type RequestDraft = {
  customer_name: string | null;
  contact: string | null;
  service_or_product: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  quantity_if_needed: string | null;
  special_requirements: string | null;
  estimated_price_if_known: string | null;
  urgency: "Standard" | "Soon" | "Urgent";
  summary: string;
  missing_fields: string[];
};

const draftSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "customer_name",
    "contact",
    "service_or_product",
    "preferred_date",
    "preferred_time",
    "quantity_if_needed",
    "special_requirements",
    "estimated_price_if_known",
    "urgency",
    "summary",
    "missing_fields",
  ],
  properties: {
    customer_name: { type: ["string", "null"] },
    contact: { type: ["string", "null"] },
    service_or_product: { type: ["string", "null"] },
    preferred_date: { type: ["string", "null"] },
    preferred_time: { type: ["string", "null"] },
    quantity_if_needed: { type: ["string", "null"] },
    special_requirements: { type: ["string", "null"] },
    estimated_price_if_known: { type: ["string", "null"] },
    urgency: { type: "string", enum: ["Standard", "Soon", "Urgent"] },
    summary: { type: "string" },
    missing_fields: { type: "array", items: { type: "string" } },
  },
} as const;

export const extractRequestDraft = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ExtractInput.parse(input))
  .handler(async ({ data }) => {
    const business = getBusiness(data.slug);
    if (!business) throw new Error("Unknown business.");

    const text = await runGateway({
      instructions: [
        `Extract a structured booking/order request for ${business.name} from the conversation.`,
        "Use only what the customer actually said, plus prices from the approved data below when the service matches exactly.",
        "Leave a field null when it was not stated. Never guess a date, time, price or quantity.",
        "The summary is one or two sentences written for the business owner.",
        "",
        businessProfileForPrompt(business),
      ].join("\n"),
      input: toItems(data.messages),
      reasoning: { effort: "low", summary: "auto" },
      include: ["reasoning.encrypted_content"],
      text: {
        format: {
          type: "json_schema",
          name: "request_draft",
          strict: true,
          schema: draftSchema,
        },
      },
    });

    try {
      return JSON.parse(text) as RequestDraft;
    } catch {
      throw new Error("Could not read the request details. Please fill them in manually.");
    }
  });

const ReplyInput = z.object({
  slug: z.string().min(1),
  tone: z.enum(["Friendly", "Professional", "Concise", "Apologetic"]),
  decision: z.enum(["confirm", "decline", "clarify"]),
  request: z.record(z.string(), z.string()),
});

export const generateOwnerReply = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ReplyInput.parse(input))
  .handler(async ({ data }) => {
    const business = getBusiness(data.slug);
    if (!business) throw new Error("Unknown business.");

    const intent =
      data.decision === "confirm"
        ? "The owner is confirming this request."
        : data.decision === "decline"
          ? "The owner is declining this request; be respectful and offer to look at another slot."
          : "The owner needs more information before deciding; ask only for what is missing.";

    const text = await runGateway({
      instructions: [
        `Write a reply to a customer on behalf of ${business.name}.`,
        `Tone: ${data.tone}. ${intent}`,
        "Use only the approved business data below. Never invent a price, slot or policy.",
        "No greeting placeholders, no subject line. 2 to 4 sentences, plain text.",
        "",
        businessProfileForPrompt(business),
      ].join("\n"),
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Request details:\n${Object.entries(data.request)
                .filter(([, v]) => v)
                .map(([k, v]) => `${k}: ${v}`)
                .join("\n")}`,
            },
          ],
        },
      ],
      reasoning: { effort: "low", summary: "auto" },
      include: ["reasoning.encrypted_content"],
    });

    return { reply: text || "Could not draft a reply. Please write one manually." };
  });

const CompareInput = z.object({ slugs: z.array(z.string()).min(2).max(3) });

export const compareBusinesses = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => CompareInput.parse(input))
  .handler(async ({ data }) => {
    const businesses = data.slugs.map(getBusiness).filter(Boolean);
    if (businesses.length < 2) throw new Error("Pick at least two registered businesses.");

    const text = await runGateway({
      instructions: [
        "Compare the registered businesses below for a customer, neutrally.",
        "Use only the stored fields: services, prices, durations, hours and published policies.",
        "Never invent reviews, ratings, distance, availability or a 'best' choice.",
        "Point out where the data is not comparable or is missing.",
        "Answer in 3 to 5 short bullet points, plain text with '- ' bullets.",
      ].join("\n"),
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: businesses
                .map((b) => businessProfileForPrompt(b!))
                .join("\n\n-----------------\n\n"),
            },
          ],
        },
      ],
      reasoning: { effort: "low", summary: "auto" },
      include: ["reasoning.encrypted_content"],
    });

    return { notes: text };
  });
