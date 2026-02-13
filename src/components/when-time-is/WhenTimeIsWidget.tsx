import { Clock4, Hourglass, TimerOff } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/hooks/useCountdown";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { formatInTimezone } from "@/hooks/useTimezone";
import { getTimezoneLabel } from "@/lib/timezones";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface CalculatedState {
  reference: string;
  offsetSlot: string;
  timeValue: string;
}

const REFERENCE_OPTIONS = [
  { value: "UTC", label: "UTC" },
  { value: "GMT", label: "GMT" },
  { value: "UT", label: "UT" },
];

function buildOffsetOptions(): Array<{ value: string; label: string }> {
  const options: Array<{ value: string; label: string }> = [];
  for (let minutes = -12 * 60; minutes <= 14 * 60; minutes += 15) {
    const sign = minutes < 0 ? "-" : "+";
    const absolute = Math.abs(minutes);
    const hours = Math.floor(absolute / 60);
    const remainder = absolute % 60;
    const slot = `${sign}${String(hours).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
    options.push({ value: slot, label: slot });
  }
  return options;
}

const OFFSET_OPTIONS = buildOffsetOptions();

function getLocalTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

function normalizeTime(value: string): string {
  return /^\d{2}:\d{2}$/.test(value) ? value : "00:00";
}

function parseOffsetToMinutes(offsetSlot: string): number {
  const match = offsetSlot.match(/^([+-])(\d{2}):(\d{2})$/);
  if (!match) return 0;

  const sign = match[1] === "-" ? -1 : 1;
  const hours = Number(match[2]);
  const minutes = Number(match[3]);
  return sign * (hours * 60 + minutes);
}

function toUtcFromOffsetTime(now: Date, timeValue: string, offsetMinutes: number): Date {
  const [hoursPart, minutesPart] = timeValue.split(":");
  const hours = Number(hoursPart);
  const minutes = Number(minutesPart);

  const zoneNow = new Date(now.getTime() + offsetMinutes * 60_000);
  const year = zoneNow.getUTCFullYear();
  const month = zoneNow.getUTCMonth();
  const day = zoneNow.getUTCDate();

  const utcTimestamp = Date.UTC(year, month, day, hours, minutes, 0, 0) - offsetMinutes * 60_000;
  return new Date(utcTimestamp);
}

export function WhenTimeIsWidget() {
  const localTimezone = useMemo(() => getLocalTimezone(), []);
  const [referenceInput, setReferenceInput] = useState<string>("UTC");
  const [offsetSlotInput, setOffsetSlotInput] = useState<string>("+00:00");
  const [timeValueInput, setTimeValueInput] = useState<string>("09:00");
  const [calculated, setCalculated] = useState<CalculatedState | null>(null);
  const now = useCurrentTime(1000);

  const activeReference = calculated?.reference ?? referenceInput;
  const activeOffsetSlot = calculated?.offsetSlot ?? offsetSlotInput;
  const activeTimeValue = calculated?.timeValue ?? timeValueInput;
  const normalizedTime = normalizeTime(activeTimeValue);
  const activeOffsetMinutes = useMemo(
    () => parseOffsetToMinutes(activeOffsetSlot),
    [activeOffsetSlot],
  );

  const targetMoment = useMemo(
    () => toUtcFromOffsetTime(now, normalizedTime, activeOffsetMinutes),
    [activeOffsetMinutes, normalizedTime, now],
  );

  const countdown = useCountdown(targetMoment);
  const hasResult = calculated !== null;

  const localMomentLabel = formatInTimezone(targetMoment, localTimezone, "EEE, MMM d - HH:mm");
  const zoneMomentLabel = useMemo(() => {
    const shiftedDate = new Date(targetMoment.getTime() + activeOffsetMinutes * 60_000);
    return formatInTimezone(shiftedDate, "UTC", "EEE, MMM d - HH:mm");
  }, [activeOffsetMinutes, targetMoment]);

  const relativeLabel = countdown.isNow
    ? "is right now"
    : countdown.isPast
      ? `was ${countdown.formatted} ago`
      : `will be in ${countdown.formatted}`;

  const canCalculate = /^\d{2}:\d{2}$/.test(timeValueInput);
  const referenceWithOffset = `${activeReference} ${activeOffsetSlot}`;

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
          Choose a reference and offset slot, then compare that time against your local timezone.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-[170px,1fr,1fr]">
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
          <span className="font-medium">Reference</span>
          <SearchableSelect
            id="when-time-is-reference"
            value={referenceInput}
            options={REFERENCE_OPTIONS}
            onChange={(nextValue) => {
              setReferenceInput(nextValue);
              setCalculated(null);
            }}
            placeholder="Select reference"
            searchPlaceholder="Search reference..."
          />
        </div>

        <div className="grid gap-1 text-sm">
          <span className="font-medium">Offset slot</span>
          <SearchableSelect
            id="when-time-is-offset-slot"
            value={offsetSlotInput}
            options={OFFSET_OPTIONS}
            onChange={(nextValue) => {
              setOffsetSlotInput(nextValue);
              setCalculated(null);
            }}
            placeholder="Select offset slot"
            searchPlaceholder="Search offset (e.g. +07:30)..."
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={() =>
            setCalculated({
              reference: referenceInput,
              offsetSlot: offsetSlotInput,
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
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{referenceWithOffset}</p>
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
                When time is {normalizedTime} in {referenceWithOffset}, it {relativeLabel} compared to your local
                timezone.
              </span>
            </div>
            <p className="mt-2 font-mono text-3xl font-bold tabular-nums">{countdown.formatted}</p>
          </div>
        </>
      ) : null}
    </section>
  );
}
