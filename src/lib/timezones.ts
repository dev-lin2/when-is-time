import { formatInTimeZone } from "date-fns-tz";
import type { TimezoneBucket, TimezoneOption } from "@/types";

const FALLBACK_FORMAT = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

interface TimezoneIdentifierDefinition {
  id: string;
  timezone: string;
  aliases?: string[];
}

const TIMEZONE_IDENTIFIER_DEFINITIONS: TimezoneIdentifierDefinition[] = [
  { id: "UTC", timezone: "UTC", aliases: ["zulu", "coordinated universal time"] },
  { id: "GMT", timezone: "Etc/GMT", aliases: ["greenwich mean time"] },
  { id: "WET", timezone: "Europe/Lisbon" },
  { id: "WEST", timezone: "Atlantic/Canary" },
  { id: "BST", timezone: "Europe/London" },
  { id: "CET", timezone: "Europe/Paris" },
  { id: "CEST", timezone: "Europe/Berlin" },
  { id: "EET", timezone: "Europe/Helsinki" },
  { id: "EEST", timezone: "Europe/Athens" },
  { id: "MSK", timezone: "Europe/Moscow" },
  { id: "TRT", timezone: "Europe/Istanbul" },
  { id: "AZT", timezone: "Asia/Baku" },
  { id: "GST", timezone: "Asia/Dubai" },
  { id: "IRST", timezone: "Asia/Tehran" },
  { id: "PKT", timezone: "Asia/Karachi" },
  { id: "IST", timezone: "Asia/Kolkata" },
  { id: "NPT", timezone: "Asia/Kathmandu" },
  { id: "BDT", timezone: "Asia/Dhaka" },
  { id: "MMT", timezone: "Asia/Yangon" },
  { id: "ICT", timezone: "Asia/Bangkok" },
  { id: "WIB", timezone: "Asia/Jakarta" },
  { id: "WITA", timezone: "Asia/Makassar" },
  { id: "WIT", timezone: "Asia/Jayapura" },
  { id: "HKT", timezone: "Asia/Hong_Kong" },
  { id: "SGT", timezone: "Asia/Singapore" },
  { id: "MYT", timezone: "Asia/Kuala_Lumpur" },
  { id: "PHT", timezone: "Asia/Manila" },
  { id: "KST", timezone: "Asia/Seoul" },
  { id: "JST", timezone: "Asia/Tokyo" },
  { id: "AWST", timezone: "Australia/Perth" },
  { id: "ACST", timezone: "Australia/Darwin" },
  { id: "ACDT", timezone: "Australia/Adelaide" },
  { id: "AEST", timezone: "Australia/Brisbane" },
  { id: "AEDT", timezone: "Australia/Sydney" },
  { id: "NZST", timezone: "Pacific/Auckland" },
  { id: "NZDT", timezone: "Pacific/Auckland" },
  { id: "CHAST", timezone: "Pacific/Chatham" },
  { id: "FJT", timezone: "Pacific/Fiji" },
  { id: "CHST", timezone: "Pacific/Guam" },
  { id: "HST", timezone: "Pacific/Honolulu" },
  { id: "AKST", timezone: "America/Anchorage" },
  { id: "AKDT", timezone: "America/Anchorage" },
  { id: "PST", timezone: "America/Los_Angeles" },
  { id: "PDT", timezone: "America/Los_Angeles" },
  { id: "MST", timezone: "America/Denver" },
  { id: "MDT", timezone: "America/Denver" },
  { id: "CST", timezone: "America/Chicago" },
  { id: "CDT", timezone: "America/Chicago" },
  { id: "EST", timezone: "America/New_York" },
  { id: "EDT", timezone: "America/New_York" },
  { id: "AST", timezone: "America/Halifax" },
  { id: "NST", timezone: "America/St_Johns" },
  { id: "NDT", timezone: "America/St_Johns" },
  { id: "COT", timezone: "America/Bogota" },
  { id: "PET", timezone: "America/Lima" },
  { id: "CLT", timezone: "America/Santiago" },
  { id: "ART", timezone: "America/Argentina/Buenos_Aires" },
  { id: "BRT", timezone: "America/Sao_Paulo" },
  { id: "CAT", timezone: "Africa/Maputo" },
  { id: "EAT", timezone: "Africa/Nairobi" },
  { id: "SAST", timezone: "Africa/Johannesburg" },
  { id: "WAT", timezone: "Africa/Lagos" },
  { id: "UTC-12", timezone: "Etc/GMT+12" },
  { id: "UTC-11", timezone: "Etc/GMT+11" },
  { id: "UTC-10", timezone: "Etc/GMT+10" },
  { id: "UTC-09", timezone: "Etc/GMT+9" },
  { id: "UTC-08", timezone: "Etc/GMT+8" },
  { id: "UTC-07", timezone: "Etc/GMT+7" },
  { id: "UTC-06", timezone: "Etc/GMT+6" },
  { id: "UTC-05", timezone: "Etc/GMT+5" },
  { id: "UTC-04", timezone: "Etc/GMT+4" },
  { id: "UTC-03", timezone: "Etc/GMT+3" },
  { id: "UTC-02", timezone: "Etc/GMT+2" },
  { id: "UTC-01", timezone: "Etc/GMT+1" },
  { id: "UTC+00", timezone: "Etc/GMT" },
  { id: "UTC+01", timezone: "Etc/GMT-1" },
  { id: "UTC+02", timezone: "Etc/GMT-2" },
  { id: "UTC+03", timezone: "Etc/GMT-3" },
  { id: "UTC+04", timezone: "Etc/GMT-4" },
  { id: "UTC+05", timezone: "Etc/GMT-5" },
  { id: "UTC+05:30", timezone: "Asia/Kolkata" },
  { id: "UTC+05:45", timezone: "Asia/Kathmandu" },
  { id: "UTC+06", timezone: "Etc/GMT-6" },
  { id: "UTC+06:30", timezone: "Asia/Yangon" },
  { id: "UTC+07", timezone: "Etc/GMT-7" },
  { id: "UTC+08", timezone: "Etc/GMT-8" },
  { id: "UTC+08:45", timezone: "Australia/Eucla" },
  { id: "UTC+09", timezone: "Etc/GMT-9" },
  { id: "UTC+09:30", timezone: "Australia/Darwin" },
  { id: "UTC+10", timezone: "Etc/GMT-10" },
  { id: "UTC+10:30", timezone: "Australia/Lord_Howe" },
  { id: "UTC+11", timezone: "Etc/GMT-11" },
  { id: "UTC+12", timezone: "Etc/GMT-12" },
  { id: "UTC+12:45", timezone: "Pacific/Chatham" },
  { id: "UTC+13", timezone: "Etc/GMT-13" },
  { id: "UTC+14", timezone: "Pacific/Kiritimati" },
];

const IDENTIFIER_TO_TIMEZONE = new Map<string, string>();
const TIMEZONE_TO_IDENTIFIER = new Map<string, string>();
const IDENTIFIER_SEARCH_TOKENS = new Map<string, string>();

for (const definition of TIMEZONE_IDENTIFIER_DEFINITIONS) {
  IDENTIFIER_TO_TIMEZONE.set(definition.id, definition.timezone);
  if (!TIMEZONE_TO_IDENTIFIER.has(definition.timezone)) {
    TIMEZONE_TO_IDENTIFIER.set(definition.timezone, definition.id);
  }
  IDENTIFIER_SEARCH_TOKENS.set(
    definition.id,
    [definition.id, ...(definition.aliases ?? [])].join(" ").toLowerCase(),
  );
}

export const POPULAR_TIMEZONES: TimezoneOption[] = TIMEZONE_IDENTIFIER_DEFINITIONS.map((definition) => ({
  value: definition.id,
  label: definition.id,
}));

export function resolveTimezone(timezone: string): string {
  return IDENTIFIER_TO_TIMEZONE.get(timezone) ?? timezone;
}

function getIdentifierFromIntl(timezone: string, date: Date): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).formatToParts(date);
    const shortName = parts.find((part) => part.type === "timeZoneName")?.value ?? "UTC";
    return shortName.replace("GMT", "UTC").replace(/\s+/g, "").toUpperCase();
  } catch {
    return "UTC";
  }
}

export function isValidTimezone(timezone: string): boolean {
  const resolvedTimezone = resolveTimezone(timezone);
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: resolvedTimezone }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

export function formatTimezoneTime(date: Date, timezone: string): string {
  return formatInTimeZone(date, resolveTimezone(timezone), "HH:mm:ss");
}

export function formatTimezoneDate(date: Date, timezone: string): string {
  try {
    return formatInTimeZone(date, resolveTimezone(timezone), "EEE, MMM d");
  } catch {
    return FALLBACK_FORMAT.format(date);
  }
}

export function getTimezoneOffsetLabel(date: Date, timezone: string): string {
  const resolvedTimezone = resolveTimezone(timezone);
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: resolvedTimezone,
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "shortOffset",
    }).formatToParts(date);

    const zoneName = parts.find((part) => part.type === "timeZoneName")?.value ?? "UTC";
    return zoneName.replace("GMT", "UTC");
  } catch {
    return "UTC";
  }
}

export function offsetLabelToHours(offsetLabel: string): number {
  if (offsetLabel === "UTC") {
    return 0;
  }

  const match = offsetLabel.match(/UTC([+-]\d{1,2})(?::?(\d{2}))?/);
  if (!match) {
    return 0;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2] ?? "0");
  const normalizedMinutes = minutes / 60;
  return hours >= 0 ? hours + normalizedMinutes : hours - normalizedMinutes;
}

export function resolveTimezoneBucket(offsetHours: number): TimezoneBucket {
  if (offsetHours <= -3) return "americas";
  if (offsetHours <= 3) return "europe";
  if (offsetHours <= 9) return "asia";
  return "pacific";
}

export function searchTimezones(
  query: string,
  excludedTimezones: string[] = [],
): TimezoneOption[] {
  const normalized = query.trim().toLowerCase();
  const excludedResolved = new Set(excludedTimezones.map((timezone) => resolveTimezone(timezone)));

  return POPULAR_TIMEZONES.filter((option) => {
    if (excludedResolved.has(resolveTimezone(option.value))) return false;
    if (!normalized) return true;
    const searchable = IDENTIFIER_SEARCH_TOKENS.get(option.value) ?? option.label.toLowerCase();
    return searchable.includes(normalized);
  });
}

export function getTimezoneLabel(timezone: string, date: Date = new Date()): string {
  const known = POPULAR_TIMEZONES.find((item) => item.value === timezone);
  if (known) return known.label;

  const resolvedTimezone = resolveTimezone(timezone);
  const byTimezone = TIMEZONE_TO_IDENTIFIER.get(resolvedTimezone);
  if (byTimezone) return byTimezone;

  return getIdentifierFromIntl(resolvedTimezone, date);
}
