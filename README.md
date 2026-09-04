# BizConnect Hub

BizAssist AI

Lovable Master Build Prompt — Elevated Version

Project Goal

Build a polished multi-business AI web application called BizAssist AI. The product is an AI business discovery and customer-service hub, not just a single-business chatbot. Customers can discover participating businesses, open a business profile, ask that business AI questions, compare suitable businesses, and submit booking/order requests. Business owners have a separate command centre to manage business information, requests and AI-assisted responses.

Product Positioning

Tagline: “Ask businesses. Compare options. Get things done.” The experience should feel like a modern SaaS product with a premium, trustworthy, mobile-friendly interface. Avoid generic chatbot styling. Hero visual: include a compact modern smartphone mockup in the top-right corner of the landing page showing a BizAssist WhatsApp-style chat with realistic customer messages, AI replies, and a visible booking/request card. Use BizAssist branding rather than reproducing the exact WhatsApp interface; keep it subtle, premium, responsive, and clear of the main headline and call-to-action.

User Roles

Customer: discovers businesses, chats with business AI, compares options and submits requests.

Business Owner: manages business profile, services, pricing, policies, requests and AI-generated replies.

AI Assistant: answers from approved business data, extracts intent, summarizes requests and asks clarifying questions.

Main Screens

Landing / marketing page

Business discovery marketplace

Business profile page

Customer chat page

Compare businesses page

Customer request status page

Owner sign-in / business setup

Owner command centre dashboard

Requests detail page

AI Response Studio

Business knowledge / services settings

Customer Features

Search participating businesses by category, service or keyword.

Browse business cards with category, services, pricing highlights, operating hours and AI availability status.

Click “Ask AI” to open the selected business assistant.

Use “Ask another business” to switch to another participating business without leaving the platform.

Use “Compare” to compare two or more participating businesses based only on stored business data.

Submit a booking/order request through conversation.

See request status: Draft, Awaiting Owner, Confirmed, Declined or Completed.

Owner Features

Create and edit a business profile.

Add services/products, prices, descriptions, durations and optional availability notes.

Add business hours and policies.

View requests with priority badges.

Open an AI-generated request summary.

Generate customer replies in Friendly, Professional, Concise and Apologetic tones.

Confirm or decline requests manually.

See simple productivity metrics such as enquiries received, requests awaiting action and response opportunities.

AI Rules

The business AI must use the selected business profile as its source of truth. Never invent a price, service, availability, policy or business detail. When information is missing, say so and ask a useful follow-up question. Never claim a booking or order is confirmed until the owner explicitly confirms it. Clearly identify when an answer is based on limited information. Do not expose another business’s private data.

Comparison Rules

The comparison feature may compare only businesses that are registered in the prototype. Use factual fields such as service, price, duration, business hours and published policies. Never fabricate reviews, ratings, availability, distance or “best” claims. Present comparisons neutrally.

Core System Prompt

You are BizAssist AI for {business_name}. Answer customer questions using only the approved business information provided below. Approved data: {business_profile}, {services}, {hours}, {policies}. Rules: do not invent facts; do not confirm bookings; ask for missing information; keep answers concise and helpful; when a request is actionable, collect the required fields and return a structured request for owner review.

Structured Request Output

When the customer intends to book or order, produce structured fields: customer_name, contact, service_or_product, preferred_date, preferred_time, quantity_if_needed, special_requirements, estimated_price_if_known, urgency, status. Status must begin as “Awaiting Owner”.

Responsible AI & Privacy

Show a visible AI disclosure in the chat interface.

Do not collect unnecessary sensitive information.

Keep owner approval mandatory for bookings/orders.

Provide a fallback when data is missing or ambiguous.

Prevent the AI from answering as if it has access to private information from another business.

Design Direction

Use a clean premium SaaS look: strong typography, generous spacing, rounded cards, subtle shadows, clear status badges, responsive layout, accessible contrast and polished empty/loading/error states. Use a consistent design system. The marketplace should feel like a modern service directory; the chat should feel familiar and focused; the owner dashboard should feel operational and efficient.

MVP Constraints

Build a convincing prototype with seeded example businesses so the discovery and multi-business experience can be demonstrated. Do not build real payment processing, live WhatsApp integration, live web scraping of arbitrary businesses or complex scheduling integrations in the first version. Treat these as future integrations.

Demo Scenario

Seed at least three different example businesses from different categories. Demonstrate: customer searches for a service → selects Business A → asks AI a question → receives an answer from Business A data → requests a booking → request appears in owner dashboard → owner generates a reply → customer returns to discovery → selects Business B → asks another business AI → compares Business A and Business B → makes an informed choice. Ensure the prototype never pretends that the sample businesses are real live integrations.

Build Quality

Prioritize working end-to-end flows over unnecessary features. Use realistic data, clear microcopy, loading/error states and responsive behavior. Keep the code organized and make the app easy to extend with real integrations later. Do not remove the core discovery, multi-business chat, comparison, request management and owner-control workflow. Also the this be in dark mode

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ask-compare-done.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e7e38d07-aa85-4f05-a2ce-a932c51c9345).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
