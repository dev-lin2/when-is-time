import { Hourglass, Timer, TimerOff } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";
import { cn } from "@/lib/utils";

interface CountdownDisplayProps {
  targetTime: Date;
  timezone: string;
}

export function CountdownDisplay({ targetTime }: CountdownDisplayProps) {
  const countdown = useCountdown(targetTime);

  const state = countdown.isNow ? "now" : countdown.isPast ? "past" : "future";
  const stateLabel =
    state === "now"
      ? "Exact moment"
      : state === "past"
        ? `Passed ${countdown.formatted}`
        : `in ${countdown.formatted}`;

  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        state === "future" && "border-sky-500/35 bg-sky-500/10 dark:bg-sky-500/18",
        state === "past" && "border-slate-500/35 bg-slate-500/10 dark:bg-slate-500/16",
        state === "now" && "border-emerald-500/45 bg-emerald-500/10 dark:bg-emerald-500/16",
      )}
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {state === "future" ? (
          <Hourglass className="h-4 w-4" />
        ) : state === "past" ? (
          <TimerOff className="h-4 w-4" />
        ) : (
          <Timer className="h-4 w-4" />
        )}
        <span>{state === "future" ? "Time until" : state === "past" ? "Passed by" : "Right now"}</span>
      </div>
      <p className="mt-2 font-mono text-3xl font-bold tabular-nums">{countdown.formatted}</p>
      <p className="mt-1 text-sm text-muted-foreground">{stateLabel}</p>
    </div>
  );
}
