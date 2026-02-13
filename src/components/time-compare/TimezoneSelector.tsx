import { POPULAR_TIMEZONES, getTimezoneLabel } from "@/lib/timezones";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface TimezoneSelectorProps {
  id: string;
  label: string;
  value: string;
  onChange: (timezone: string) => void;
}

export function TimezoneSelector({ id, label, value, onChange }: TimezoneSelectorProps) {
  const includesSelected = POPULAR_TIMEZONES.some((timezone) => timezone.value === value);
  const options = includesSelected
    ? POPULAR_TIMEZONES
    : [{ value, label: getTimezoneLabel(value) }, ...POPULAR_TIMEZONES];

  return (
    <div className="grid gap-1 text-sm">
      <span className="font-medium">{label}</span>
      <SearchableSelect
        id={id}
        value={value}
        options={options}
        onChange={onChange}
        placeholder="Select timezone"
        searchPlaceholder="Search timezone identifier..."
      />
    </div>
  );
}
