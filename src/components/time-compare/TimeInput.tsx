import { Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TimeInputProps {
  date: string;
  time: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onUseNow: () => void;
}

export function TimeInput({ date, time, onDateChange, onTimeChange, onUseNow }: TimeInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Select Date & Time</h3>
        <Button variant="secondary" size="sm" className="gap-1" onClick={onUseNow}>
          <Clock3 className="h-3.5 w-3.5" />
          Now
        </Button>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Input
          type="date"
          value={date}
          onChange={(event) => onDateChange(event.target.value)}
          aria-label="Target date"
        />
        <Input
          type="time"
          value={time}
          onChange={(event) => onTimeChange(event.target.value)}
          aria-label="Target time"
        />
      </div>
    </div>
  );
}
