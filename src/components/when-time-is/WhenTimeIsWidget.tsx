import { Clock4, Hourglass, TimerOff } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/hooks/useCountdown";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { formatInTimezone, toUtcFromTimezone } from "@/hooks/useTimezone";
import { POPULAR_TIMEZONES, getTimezoneLabel } from "@/lib/timezones";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";

function getLocalTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

function normalizeTime(value: string): string {
  return /^\d{2}:\d{2}$/.test(value) ? value : "00:00";
}

export function WhenTimeIsWidget() {
  const localTimezone = useMemo(() => getLocalTimezone(), []);
  const [timezoneInput, setTimezoneInput] = useState<string>("UTC");
  const [timeValueInput, setTimeValueInput] = useState<string>("09:00");
  const [calculated, setCalculated] = useState<{ timezone: string; timeValue: string } | null>(null);
  const now = useCurrentTime(1000);

  const activeTimezone = calculated?.timezone ?? timezoneInput;
  const activeTimeValue = calculated?.timeValue ?? timeValueInput;
  const targetDateInZone = useMemo(
    () => formatInTimezone(now, activeTimezone, "yyyy-MM-dd"),
    [activeTimezone, now],
  );
  const normalizedTime = normalizeTime(activeTimeValue);

  const targetMoment = useMemo(
    () => toUtcFromTimezone(targetDateInZone, normalizedTime, activeTimezone),
    [activeTimezone, normalizedTime, targetDateInZone],
  );
  const countdown = useCountdown(targetMoment);
  const hasResult = calculated !== null;

  const localMomentLabel = formatInTimezone(targetMoment, localTimezone, "EEE, MMM d - HH:mm");
  const zoneMomentLabel = formatInTimezone(targetMoment, activeTimezone, "EEE, MMM d - HH:mm");
  const relativeLabel = countdown.isNow
    ? "happens right now"
    : `${countdown.formatted} away`;
  const canCalculate = /^\d{2}:\d{2}$/.test(timeValueInput);

  return (
    <section
      className="glass-panel animate-fade-up relative z-0 space-y-4 p-4 focus-within:z-40 md:p-6"
      aria-labelledby="when-time-is-title"
    >
      <div>
        <h2 id="when-time-is-title" className="text-2xl font-semibold md:text-3xl">
          When Time Is
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter a time and timezone identifier to compare it against your local timezone.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-[180px,1fr]">
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Time value</span>
          <Input
            type="time"
            value={timeValueInput}
            onChange={(event) => {
              setTimeValueInput(event.target.value);
              setCalculated(null);
            }}
            aria-label="Time value"
          />
        </label>

        <div className="grid gap-1 text-sm">
          <span className="font-medium">Timezone</span>
          <SearchableSelect
            id="when-time-is-timezone"
            value={timezoneInput}
            options={POPULAR_TIMEZONES}
            onChange={(nextValue) => {
              setTimezoneInput(nextValue);
              setCalculated(null);
            }}
            placeholder="Select timezone"
            searchPlaceholder="Search timezone identifier..."
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={() =>
            setCalculated({
              timezone: timezoneInput,
              timeValue: normalizeTime(timeValueInput),
            })
          }
          disabled={!canCalculate}
          className="bg-cyan-700 text-white hover:bg-cyan-600 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
        >
          Calculate
        </Button>
        {!hasResult ? (
          <p className="text-sm text-muted-foreground">Results will appear after you click Calculate.</p>
        ) : null}
      </div>

      {hasResult ? (
        <>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-border/70 bg-background/70 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {getTimezoneLabel(activeTimezone)}
              </p>
              <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">{normalizedTime}</p>
              <p className="mt-1 text-sm text-muted-foreground">{zoneMomentLabel}</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/70 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Your local timezone</p>
              <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">
                {formatInTimezone(targetMoment, localTimezone, "HH:mm")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {localMomentLabel} ({getTimezoneLabel(localTimezone, targetMoment)})
              </p>
            </div>
          </div>

          <div
            className={cn(
              "rounded-xl border p-4",
              countdown.isNow && "border-emerald-500/45 bg-emerald-500/10 dark:bg-emerald-500/16",
              !countdown.isNow &&
                countdown.isPast &&
                "border-slate-500/35 bg-slate-500/10 dark:bg-slate-500/16",
              !countdown.isNow &&
                !countdown.isPast &&
                "border-sky-500/35 bg-sky-500/10 dark:bg-sky-500/18",
            )}
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {countdown.isNow ? (
                <Clock4 className="h-4 w-4" />
              ) : countdown.isPast ? (
                <TimerOff className="h-4 w-4" />
              ) : (
                <Hourglass className="h-4 w-4" />
              )}
              <span>
                When time is {normalizedTime} in {getTimezoneLabel(activeTimezone)}, it is {relativeLabel} from your
                timezone current time.
              </span>
            </div>
            <p className="mt-2 font-mono text-3xl font-bold tabular-nums">{countdown.formatted}</p>
          </div>
        </>
      ) : null}
    </section>
  );
}
