import { Check, ChevronsUpDown, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchableSelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  id?: string;
  value: string;
  options: SearchableSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
}

export function SearchableSelect({
  id,
  value,
  options,
  onChange,
  placeholder = "Select option",
  searchPlaceholder = "Search...",
  className,
  disabled = false,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((option) => option.label.toLowerCase().includes(normalized));
  }, [options, query]);

  useEffect(() => {
    if (!open) return;

    const handleMouseDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", open && "z-[90]", className)}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border border-border/80 bg-background px-3 text-left text-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/35 disabled:cursor-not-allowed disabled:opacity-50",
          open && "border-ring ring-2 ring-ring/35",
        )}
      >
        <span className="truncate">{selectedOption?.label ?? placeholder}</span>
        <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
      </button>

      {open ? (
        <div className="absolute z-[95] mt-1 w-full rounded-xl border border-border/80 bg-background shadow-xl">
          <div className="relative border-b border-border/70 p-2">
            <Search className="pointer-events-none absolute left-5 top-5 h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9"
              aria-label="Search options"
            />
          </div>
          <div className="max-h-64 space-y-1 overflow-y-auto p-1">
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                  setQuery("");
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                  option.value === value && "bg-muted",
                )}
              >
                <span>{option.label}</span>
                {option.value === value ? <Check className="h-4 w-4 text-primary" /> : null}
              </button>
            ))}
            {filteredOptions.length === 0 ? (
              <p className="px-3 py-2 text-sm text-muted-foreground">No matching options.</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
