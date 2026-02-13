import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { CountdownDisplay } from "@/components/time-compare/CountdownDisplay";
import { TimeInput } from "@/components/time-compare/TimeInput";
import { TimezoneSelector } from "@/components/time-compare/TimezoneSelector";
import { Card, CardContent } from "@/components/ui/card";
import { compareTimezoneDates, formatInTimezone, toUtcFromTimezone } from "@/hooks/useTimezone";
import { getTimezoneLabel } from "@/lib/timezones";

function getLocalTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

function dayDifferenceLabel(dayDifference: number): string {
  if (dayDifference === 1) return "Next day";
  if (dayDifference === -1) return "Previous day";
  return "Same day";
}

export function TimeCompareSection() {
  const [fromTimezone, setFromTimezone] = useState<string>(() => getLocalTimezone());
  const [toTimezone, setToTimezone] = useState<string>("UTC");
  const [date, setDate] = useState<string>(() => formatInTimezone(new Date(), getLocalTimezone(), "yyyy-MM-dd"));
  const [time, setTime] = useState<string>(() => formatInTimezone(new Date(), getLocalTimezone(), "HH:mm"));

  const targetTime = useMemo(() => toUtcFromTimezone(date, time, fromTimezone), [date, fromTimezone, time]);
  const dayDiff = useMemo(
    () => compareTimezoneDates(targetTime, fromTimezone, toTimezone),
    [fromTimezone, targetTime, toTimezone],
  );

  return (
    <section
      className="glass-panel animate-fade-up relative z-0 space-y-5 p-4 focus-within:z-40 md:p-6"
      aria-labelledby="time-compare-title"
    >
      <div>
        <h2 id="time-compare-title" className="text-2xl font-semibold md:text-3xl">
          Time Comparison
        </h2>
        <p className="text-sm text-muted-foreground">
          Convert a scheduled moment between two zones with a live countdown or countup.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <TimezoneSelector id="from-timezone" label="From" value={fromTimezone} onChange={setFromTimezone} />
        <TimezoneSelector id="to-timezone" label="To" value={toTimezone} onChange={setToTimezone} />
      </div>

      <TimeInput
        date={date}
        time={time}
        onDateChange={setDate}
        onTimeChange={setTime}
        onUseNow={() => {
          const now = new Date();
          setDate(formatInTimezone(now, fromTimezone, "yyyy-MM-dd"));
          setTime(formatInTimezone(now, fromTimezone, "HH:mm"));
        }}
      />

      <Card className="border-border/70 bg-card/80">
        <CardContent className="space-y-4 p-4 md:p-5">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground md:text-sm">
            <span className="rounded-full bg-muted px-3 py-1">{getTimezoneLabel(fromTimezone, targetTime)}</span>
            <ArrowRight className="h-4 w-4" />
            <span className="rounded-full bg-muted px-3 py-1">{getTimezoneLabel(toTimezone, targetTime)}</span>
            <span className="rounded-full border border-border px-3 py-1">{dayDifferenceLabel(dayDiff)}</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border/70 bg-background/70 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">From</p>
              <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">
                {formatInTimezone(targetTime, fromTimezone, "HH:mm:ss")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatInTimezone(targetTime, fromTimezone, "EEE, MMM d")}
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-background/70 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">To</p>
              <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">
                {formatInTimezone(targetTime, toTimezone, "HH:mm:ss")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatInTimezone(targetTime, toTimezone, "EEE, MMM d")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <CountdownDisplay targetTime={targetTime} timezone={fromTimezone} />
    </section>
  );
}
