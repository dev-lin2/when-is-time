import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { AddTimezoneDialog } from "@/components/world-clock/AddTimezoneDialog";
import { TimezoneCard } from "@/components/world-clock/TimezoneCard";
import { Button } from "@/components/ui/button";
import { MAX_WORLD_CLOCKS, getDefaultTimezones } from "@/lib/constants";
import { resolveTimezone } from "@/lib/timezones";
import { makeId } from "@/lib/utils";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import type { WorldClockEntry } from "@/types";

export function WorldClockSection() {
  const [items, setItems] = useState<WorldClockEntry[]>(() => getDefaultTimezones());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const now = useCurrentTime(1000);

  const canAdd = items.length < MAX_WORLD_CLOCKS;
  const timezoneValues = useMemo(() => items.map((item) => item.timezone), [items]);

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAdd = (timezone: string, label: string) => {
    setItems((prev) => {
      const resolvedCandidate = resolveTimezone(timezone);
      if (
        prev.some((item) => resolveTimezone(item.timezone) === resolvedCandidate) ||
        prev.length >= MAX_WORLD_CLOCKS
      ) {
        return prev;
      }
      return [...prev, { id: makeId("tz"), timezone, label }];
    });
  };

  return (
    <section className="glass-panel animate-fade-up relative z-0 p-4 md:p-6" aria-labelledby="world-clock-title">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="world-clock-title" className="text-2xl font-semibold md:text-3xl">
            World Clock Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            Track live times across regions. Up to {MAX_WORLD_CLOCKS} cards.
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          disabled={!canAdd}
          className="gap-2 bg-cyan-700 text-white hover:bg-cyan-600 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
          aria-label="Add timezone card"
        >
          <Plus className="h-4 w-4" />
          Add Timezone
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <TimezoneCard
            key={item.id}
            timezone={item.timezone}
            label={item.label}
            now={now}
            onRemove={() => handleRemove(item.id)}
          />
        ))}
      </div>

      {!canAdd ? (
        <p className="mt-3 text-sm text-muted-foreground">Maximum cards reached. Remove one to add another.</p>
      ) : null}

      <AddTimezoneDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        existingTimezones={timezoneValues}
        onAdd={handleAdd}
      />
    </section>
  );
}
