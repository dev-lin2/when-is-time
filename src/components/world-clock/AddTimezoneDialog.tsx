import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { searchTimezones } from "@/lib/timezones";
import { TimezoneSearch } from "@/components/world-clock/TimezoneSearch";

interface AddTimezoneDialogProps {
  open: boolean;
  existingTimezones: string[];
  onOpenChange: (open: boolean) => void;
  onAdd: (timezone: string, label: string) => void;
}

export function AddTimezoneDialog({
  open,
  existingTimezones,
  onOpenChange,
  onAdd,
}: AddTimezoneDialogProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (open) {
      setQuery("");
    }
  }, [open]);

  const options = useMemo(() => searchTimezones(query, existingTimezones), [existingTimezones, query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-cyan-500/25 bg-white/95 dark:border-cyan-300/20 dark:bg-slate-900/95">
        <DialogCloseButton aria-label="Close add timezone dialog">
          <X className="h-4 w-4" />
        </DialogCloseButton>
        <DialogHeader>
          <DialogTitle>Add Timezone</DialogTitle>
          <DialogDescription>
            Pick a timezone identifier to add another live clock card to your dashboard.
          </DialogDescription>
        </DialogHeader>
        <TimezoneSearch
          query={query}
          onQueryChange={setQuery}
          options={options}
          onSelect={(option) => {
            onAdd(option.value, option.label);
            onOpenChange(false);
          }}
        />
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
