export function PhoneMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-primary/12 blur-3xl" />
      <div className="surface-panel rounded-[2.25rem] p-2.5 shadow-glow">
        <div className="overflow-hidden rounded-[1.85rem] border border-border bg-background/95">
          <div className="flex items-center justify-between px-5 pt-3.5 pb-1.5">
            <span className="font-mono text-[10px] text-muted-foreground">9:41</span>
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-foreground/70" />
              <span className="size-1.5 rounded-full bg-foreground/70" />
              <span className="size-1.5 rounded-full bg-foreground/35" />
            </span>
          </div>

          <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
            <span className="bg-gradient-primary grid size-8 place-items-center rounded-full font-display text-[11px] font-bold text-primary-foreground">
              FH
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold">Fadehouse Barbers</p>
              <p className="flex items-center gap-1.5 text-[11px] text-primary">
                <span className="size-1.5 rounded-full bg-primary" />
                BizAssist AI · answering now
              </p>
            </div>
          </div>

          <div className="space-y-2.5 px-3.5 py-4">
            <Bubble side="in">Can I get a fade and beard done Thursday after work?</Bubble>
            <Bubble side="out">
              Yes — the cut &amp; beard combo is R270, about 70 minutes. Combo slots run until 17:00,
              so 16:30 Thursday would work. Shall I send that through?
            </Bubble>
            <Bubble side="in">Please do. Sipho, 072 555 0148.</Bubble>

            <div className="rounded-2xl rounded-tl-sm border border-warning/30 bg-warning/8 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-warning">
                  Request BA-1039
                </span>
                <span className="rounded-full border border-warning/35 bg-warning/12 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-warning">
                  Awaiting owner
                </span>
              </div>
              <dl className="mt-2.5 space-y-1.5 text-[11.5px]">
                <Row label="Service" value="Cut & beard combo" />
                <Row label="When" value="Thu · 16:30" />
                <Row label="Price on list" value="R270" />
              </dl>
              <p className="mt-2.5 text-[10.5px] leading-relaxed text-muted-foreground">
                Not booked yet — Fadehouse confirms before it&apos;s final.
              </p>
            </div>
          </div>

          <div className="px-3.5 pb-4">
            <div className="flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3.5 py-2.5">
              <span className="flex-1 text-[11.5px] text-muted-foreground">
                Ask about services, prices, hours…
              </span>
              <span className="bg-gradient-primary grid size-6 place-items-center rounded-full text-[11px] text-primary-foreground">
                ↑
              </span>
            </div>
            <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
              AI · approved business data only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Bubble({ side, children }: { side: "in" | "out"; children: React.ReactNode }) {
  if (side === "in") {
    return (
      <p className="max-w-[80%] rounded-2xl rounded-tl-sm bg-surface-2 px-3 py-2 text-[12px] leading-relaxed">
        {children}
      </p>
    );
  }
  return (
    <p className="ml-auto max-w-[86%] rounded-2xl rounded-tr-sm border border-primary/25 bg-primary/10 px-3 py-2 text-[12px] leading-relaxed">
      {children}
    </p>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}
