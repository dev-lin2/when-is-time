import { X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TIMEZONE_COLORS } from "@/lib/constants";
import {
  formatTimezoneDate,
  formatTimezoneTime,
  getTimezoneOffsetLabel,
  offsetLabelToHours,
  resolveTimezoneBucket,
} from "@/lib/timezones";
import { cn } from "@/lib/utils";

interface TimezoneCardProps {
  timezone: string;
  label: string;
  now: Date;
  onRemove: () => void;
}

export function TimezoneCard({ timezone, label, now, onRemove }: TimezoneCardProps) {
  const offsetLabel = getTimezoneOffsetLabel(now, timezone);
  const offsetHours = offsetLabelToHours(offsetLabel);
  const bucket = resolveTimezoneBucket(offsetHours);
  const colors = TIMEZONE_COLORS[bucket];

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border backdrop-blur-sm transition-transform hover:-translate-y-0.5",
        colors.border,
        colors.bg,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/75 to-transparent dark:via-white/30" />
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-8 w-8 bg-white/60 text-foreground/80 opacity-100 transition hover:bg-white/85 md:opacity-0 md:group-hover:opacity-100 dark:bg-slate-900/55 dark:text-slate-200 dark:hover:bg-slate-900/80"
        onClick={onRemove}
        aria-label={`Remove ${label} timezone`}
      >
        <X className="h-4 w-4" />
      </Button>
      <CardContent className="space-y-2 p-5">
        <div className="space-y-1">
          <p className={cn("font-display text-lg font-semibold", colors.accent)}>{label}</p>
        </div>
        <p className="clock-numbers">{formatTimezoneTime(now, timezone)}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{formatTimezoneDate(now, timezone)}</span>
          <span className={cn("font-mono text-xs", colors.accent)}>{offsetLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}
