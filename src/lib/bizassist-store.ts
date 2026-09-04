import { useCallback, useSyncExternalStore } from "react";

export type RequestStatus = "Draft" | "Awaiting Owner" | "Confirmed" | "Declined" | "Completed";

export type BizRequest = {
  id: string;
  ref: string;
  businessSlug: string;
  businessName: string;
  customer_name: string;
  contact: string;
  service_or_product: string;
  preferred_date: string;
  preferred_time: string;
  quantity_if_needed: string;
  special_requirements: string;
  estimated_price_if_known: string;
  urgency: "Standard" | "Soon" | "Urgent";
  status: RequestStatus;
  createdAt: number;
  ownerReply?: string;
  aiSummary?: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  limitedInfo?: boolean;
};

type StoreState = {
  requests: BizRequest[];
  chats: Record<string, ChatMessage[]>;
  compare: string[];
};

const KEY = "bizassist.state.v2";

const seeded: StoreState = {
  requests: [
    {
      id: "seed-1",
      ref: "BA-1041",
      businessSlug: "sparkline-cleaning",
      businessName: "Sparkline Cleaning Co.",
      customer_name: "Nandi M.",
      contact: "nandi@example.com",
      service_or_product: "Deep clean (2 bed)",
      preferred_date: "Sat 12 Sep",
      preferred_time: "08:00",
      quantity_if_needed: "1 property",
      special_requirements: "Two cats in the flat, please use pet-safe products.",
      estimated_price_if_known: "R1 250",
      urgency: "Standard",
      status: "Awaiting Owner",
      createdAt: Date.now() - 1000 * 60 * 42,
      aiSummary:
        "Customer wants a deep clean for a 2 bed flat on Sat 12 Sep at 08:00. Pet-safe products requested. Price on the published list is R1 250; owner must confirm the slot.",
    },
    {
      id: "seed-2",
      ref: "BA-1039",
      businessSlug: "lumina-hair-studio",
      businessName: "Lumina Hair Studio",
      customer_name: "Thandi K.",
      contact: "072 555 0148",
      service_or_product: "Balayage & toner",
      preferred_date: "Thu 10 Sep",
      preferred_time: "14:30",
      quantity_if_needed: "1",
      special_requirements: "Prefers the same senior stylist as last time if possible.",
      estimated_price_if_known: "R1 250",
      urgency: "Soon",
      status: "Confirmed",
      createdAt: Date.now() - 1000 * 60 * 60 * 5,
      ownerReply:
        "Hi Thandi, you're booked for balayage & toner on Thursday at 14:30. See you then.",
      aiSummary:
        "Balayage booking for Thu 10 Sep 14:30, inside the 15:00 start cut-off. Stylist preference noted but not guaranteed in stored data.",
    },
    {
      id: "seed-3",
      ref: "BA-1036",
      businessSlug: "tumelos-kitchen",
      businessName: "Tumelo's Kitchen",
      customer_name: "Lerato P.",
      contact: "lerato.p@example.com",
      service_or_product: "Office lunch box",
      preferred_date: "Fri 4 Sep",
      preferred_time: "12:00",
      quantity_if_needed: "14 boxes",
      special_requirements: "Two halaal boxes needed.",
      estimated_price_if_known: "R1 190",
      urgency: "Urgent",
      status: "Completed",
      createdAt: Date.now() - 1000 * 60 * 60 * 30,
      ownerReply: "Delivered at 11:50, thanks for the order Lerato.",
      aiSummary: "14 lunch boxes delivered for a Friday office order, two halaal.",
    },
  ],
  chats: {},
  compare: [],
};

let state: StoreState = seeded;
let hydrated = false;
const listeners = new Set<() => void>();

function read(): StoreState {
  if (typeof window === "undefined") return seeded;
  if (!hydrated) {
    hydrated = true;
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) state = { ...seeded, ...(JSON.parse(raw) as StoreState) };
    } catch {
      /* ignore corrupt storage */
    }
  }
  return state;
}

function write(next: StoreState) {
  state = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable */
    }
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useBizStore<T>(selector: (s: StoreState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(read()),
    () => selector(seeded),
  );
}

export function useBizActions() {
  const addRequest = useCallback(
    (req: Omit<BizRequest, "id" | "ref" | "createdAt">) => {
      const s = read();
      const request: BizRequest = {
        ...req,
        id: `req-${Date.now()}`,
        ref: `BA-${1042 + s.requests.length}`,
        createdAt: Date.now(),
      };
      write({ ...s, requests: [request, ...s.requests] });
      return request;
    },
    [],
  );

  const updateRequest = useCallback((id: string, patch: Partial<BizRequest>) => {
    const s = read();
    write({
      ...s,
      requests: s.requests.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    });
  }, []);

  const setChat = useCallback((slug: string, messages: ChatMessage[]) => {
    const s = read();
    write({ ...s, chats: { ...s.chats, [slug]: messages } });
  }, []);

  const toggleCompare = useCallback((slug: string) => {
    const s = read();
    const has = s.compare.includes(slug);
    const compare = has ? s.compare.filter((x) => x !== slug) : [...s.compare, slug].slice(-3);
    write({ ...s, compare });
  }, []);

  const clearCompare = useCallback(() => {
    const s = read();
    write({ ...s, compare: [] });
  }, []);

  return { addRequest, updateRequest, setChat, toggleCompare, clearCompare };
}
