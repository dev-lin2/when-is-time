import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { TimezoneOption } from "@/types";

interface TimezoneSearchProps {
  query: string;
  onQueryChange: (value: string) => void;
  options: TimezoneOption[];
  onSelect: (timezone: TimezoneOption) => void;
}

export function TimezoneSearch({ query, onQueryChange, options, onSelect }: TimezoneSearchProps) {
  return (
    <div className="space-y-3">
      <label className="relative block">
        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="pl-9"
          placeholder="Search timezone identifier (e.g. UTC, GMT, EST)"
        />
      </label>
      <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
        {options.map((option) => (
          <Button
            key={option.value}
            variant="ghost"
            className="h-auto w-full justify-start whitespace-normal rounded-xl border border-transparent px-3 py-2 text-left hover:border-cyan-500/30 hover:bg-cyan-500/10 dark:hover:bg-cyan-500/20"
            onClick={() => onSelect(option)}
          >
            <span className="font-medium text-foreground">{option.label}</span>
          </Button>
        ))}
        {options.length === 0 ? (
          <p className="rounded-lg bg-muted px-3 py-4 text-sm text-muted-foreground">
            No matching timezones.
          </p>
        ) : null}
      </div>
    </div>
  );
}
