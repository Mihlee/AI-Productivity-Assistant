export type ServiceItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  availabilityNote?: string;
};

export type Business = {
  id: string;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  about: string;
  city: string;
  hours: { day: string; open: string }[];
  policies: string[];
  services: ServiceItem[];
  aiStatus: "live" | "limited";
  initials: string;
};

export const CATEGORIES = [
  "All categories",
  "Grooming",
  "Home services",
  "Food & catering",
  "Auto care",
] as const;

export const BUSINESSES: Business[] = [
  {
    id: "biz-fade",
    slug: "fadehouse-barbers",
    name: "Fadehouse Barbers",
    category: "Grooming",
    tagline: "Precision cuts and beard work, walk-ins after 4pm.",
    about:
      "A two-chair barbershop focused on clean fades, beard sculpting and kids' cuts. Two barbers on shift most days, one on Mondays.",
    city: "Braamfontein",
    initials: "FH",
    aiStatus: "live",
    hours: [
      { day: "Mon", open: "10:00 – 17:00" },
      { day: "Tue – Fri", open: "09:00 – 19:00" },
      { day: "Sat", open: "08:00 – 16:00" },
      { day: "Sun", open: "Closed" },
    ],
    policies: [
      "Cancellations inside 2 hours of the slot are charged 50%.",
      "Card and instant EFT accepted; no cash after 18:00.",
      "Kids under 10 must be accompanied by an adult.",
    ],
    services: [
      {
        id: "svc-fade-1",
        name: "Signature fade",
        description: "Clipper fade with razor line-up and hot towel finish.",
        price: "R180",
        duration: "45 min",
      },
      {
        id: "svc-fade-2",
        name: "Beard sculpt",
        description: "Shape, trim and beard oil treatment.",
        price: "R120",
        duration: "30 min",
      },
      {
        id: "svc-fade-3",
        name: "Cut & beard combo",
        description: "Signature fade plus full beard sculpt.",
        price: "R270",
        duration: "70 min",
        availabilityNote: "Combo slots only before 17:00.",
      },
      {
        id: "svc-fade-4",
        name: "Kids cut (under 10)",
        description: "Simple scissor or clipper cut.",
        price: "R110",
        duration: "30 min",
      },
    ],
  },
  {
    id: "biz-spark",
    slug: "sparkline-cleaning",
    name: "Sparkline Cleaning Co.",
    category: "Home services",
    tagline: "Deep cleans and move-out cleans for flats and small offices.",
    about:
      "A three-person cleaning crew serving apartments and small offices. Own equipment and eco-friendly products included in every quote.",
    city: "Rosebank",
    initials: "SC",
    aiStatus: "live",
    hours: [
      { day: "Mon – Fri", open: "07:30 – 17:00" },
      { day: "Sat", open: "08:00 – 13:00" },
      { day: "Sun", open: "Closed" },
    ],
    policies: [
      "Quotes are per property size; final price confirmed by the owner before the job.",
      "48 hours notice needed to reschedule a deep clean.",
      "Crew needs access to water and power on site.",
    ],
    services: [
      {
        id: "svc-spark-1",
        name: "Standard clean (2 bed)",
        description: "Kitchen, bathrooms, floors, surfaces and bins.",
        price: "R650",
        duration: "3 hrs",
      },
      {
        id: "svc-spark-2",
        name: "Deep clean (2 bed)",
        description: "Standard clean plus inside appliances, skirtings and windows.",
        price: "R1 250",
        duration: "5 – 6 hrs",
        availabilityNote: "Deep cleans start at 08:00 only.",
      },
      {
        id: "svc-spark-3",
        name: "Move-out clean",
        description: "Empty-property clean for handover, includes cupboards and walls spot-clean.",
        price: "From R1 500",
        duration: "6 hrs",
      },
      {
        id: "svc-spark-4",
        name: "Small office clean",
        description: "Up to 8 desks, kitchenette and two bathrooms.",
        price: "R900",
        duration: "3 – 4 hrs",
      },
    ],
  },
  {
    id: "biz-tumelo",
    slug: "tumelos-kitchen",
    name: "Tumelo's Kitchen",
    category: "Food & catering",
    tagline: "Home-style platters and event catering, 24 hrs notice.",
    about:
      "A small kitchen doing office lunches, family platters and birthday catering. Menu is fixed weekly; halaal options available on request.",
    city: "Soweto",
    initials: "TK",
    aiStatus: "live",
    hours: [
      { day: "Tue – Sat", open: "09:00 – 18:00" },
      { day: "Sun", open: "10:00 – 14:00" },
      { day: "Mon", open: "Closed" },
    ],
    policies: [
      "Orders need 24 hours notice; large events need 3 days.",
      "50% deposit confirmed with the owner before cooking starts.",
      "Delivery within 15km, otherwise collection only.",
    ],
    services: [
      {
        id: "svc-tum-1",
        name: "Family platter (serves 6)",
        description: "Chicken, pap, chakalaka, salad and bread rolls.",
        price: "R520",
        duration: "24 hrs notice",
      },
      {
        id: "svc-tum-2",
        name: "Office lunch box",
        description: "Individually packed hot lunch, minimum 8 boxes.",
        price: "R85 per box",
        duration: "24 hrs notice",
      },
      {
        id: "svc-tum-3",
        name: "Birthday catering (20 guests)",
        description: "Two mains, two sides, dessert and setup.",
        price: "From R2 400",
        duration: "3 days notice",
        availabilityNote: "Saturdays book out first.",
      },
      {
        id: "svc-tum-4",
        name: "Dessert tray",
        description: "Malva pudding or milk tart, serves 10.",
        price: "R260",
        duration: "24 hrs notice",
      },
    ],
  },
  {
    id: "biz-torque",
    slug: "torque-mobile-mechanics",
    name: "Torque Mobile Mechanics",
    category: "Auto care",
    tagline: "Services and diagnostics at your address, no workshop queue.",
    about:
      "Mobile mechanics doing minor services, brakes, batteries and diagnostics on site. Major engine work is referred to a partner workshop.",
    city: "Midrand",
    initials: "TM",
    aiStatus: "limited",
    hours: [
      { day: "Mon – Fri", open: "08:00 – 16:30" },
      { day: "Sat", open: "09:00 – 13:00" },
      { day: "Sun", open: "Closed" },
    ],
    policies: [
      "Call-out fee waived within 20km of Midrand.",
      "Parts are quoted separately and confirmed by the owner before fitting.",
      "Vehicle must be parked on a flat, safe surface.",
    ],
    services: [
      {
        id: "svc-torq-1",
        name: "Minor service",
        description: "Oil, oil filter, air filter and 20-point check. Parts excluded.",
        price: "R950 labour",
        duration: "90 min",
      },
      {
        id: "svc-torq-2",
        name: "Brake pad replacement (front)",
        description: "Labour for front pad replacement, pads quoted separately.",
        price: "R700 labour",
        duration: "60 min",
      },
      {
        id: "svc-torq-3",
        name: "Diagnostic scan",
        description: "OBD scan with written fault summary.",
        price: "R450",
        duration: "45 min",
      },
      {
        id: "svc-torq-4",
        name: "Battery replacement",
        description: "Test, fit and dispose of old battery. Battery quoted separately.",
        price: "R300 labour",
        duration: "30 min",
        availabilityNote: "Battery stock is not held; ordering adds a day.",
      },
    ],
  },
];

export function getBusiness(slug: string): Business | undefined {
  return BUSINESSES.find((b) => b.slug === slug);
}

export function businessProfileForPrompt(b: Business): string {
  return [
    `Business name: ${b.name}`,
    `Category: ${b.category}`,
    `Area: ${b.city}`,
    `About: ${b.about}`,
    "",
    "Services and prices:",
    ...b.services.map(
      (s) =>
        `- ${s.name}: ${s.price}, ${s.duration}. ${s.description}${
          s.availabilityNote ? ` Availability note: ${s.availabilityNote}` : ""
        }`,
    ),
    "",
    "Business hours:",
    ...b.hours.map((h) => `- ${h.day}: ${h.open}`),
    "",
    "Policies:",
    ...b.policies.map((p) => `- ${p}`),
  ].join("\n");
}
