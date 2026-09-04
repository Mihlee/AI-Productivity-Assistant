import type { RequestStatus } from "@/lib/bizassist-store";
import { cn } from "@/lib/utils";

const styles: Record<RequestStatus, string> = {
  Draft: "border-border bg-muted text-muted-foreground",
  "Awaiting Owner": "border-warning/35 bg-warning/12 text-warning",
  Confirmed: "border-success/35 bg-success/12 text-success",
  Declined: "border-destructive/35 bg-destructive/12 text-destructive",
  Completed: "border-primary/30 bg-primary/10 text-primary",
};

export function StatusBadge({ status, className }: { status: RequestStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em]",
        styles[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
