import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { SiteShell } from "@/components/biz/site-shell";

const OWNER_KEY = "bizassist.owner";

export const Route = createFileRoute("/owner")({
  component: OwnerLayout,
});

export function useOwner() {
  const [owner, setOwner] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setOwner(window.localStorage.getItem(OWNER_KEY));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  function signIn(email: string) {
    try {
      window.localStorage.setItem(OWNER_KEY, email);
    } catch {
      /* ignore */
    }
    setOwner(email);
  }

  function signOut() {
    try {
      window.localStorage.removeItem(OWNER_KEY);
    } catch {
      /* ignore */
    }
    setOwner(null);
  }

  return { owner, ready, signIn, signOut };
}

function OwnerLayout() {
  const { owner, ready, signIn } = useOwner();
  const [email, setEmail] = useState("");

  if (!ready) {
    return (
      <SiteShell>
        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8">
          <p className="text-sm text-muted-foreground">Loading owner console…</p>
        </div>
      </SiteShell>
    );
  }

  if (!owner) {
    return (
      <SiteShell>
        <div className="mx-auto w-full max-w-md px-5 py-16 sm:px-8 lg:py-24">
          <p className="eyebrow">Owner console</p>
          <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Prototype sign-in — any email works and is only stored on this device.
          </p>
          <form
            className="surface-panel mt-7 space-y-4 rounded-2xl p-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) signIn(email.trim());
            }}
          >
            <label className="block">
              <span className="eyebrow">Work email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@business.co.za"
                className="mt-2 w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-ring/40"
              />
            </label>
            <button
              type="submit"
              className="bg-gradient-primary w-full rounded-xl py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Enter console
            </button>
          </form>
          <Link to="/discover" className="mt-6 inline-block text-sm text-muted-foreground hover:text-foreground">
            ← Back to the marketplace
          </Link>
        </div>
      </SiteShell>
    );
  }

  return <Outlet />;
}
