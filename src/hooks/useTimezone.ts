import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { resolveTimezone } from "@/lib/timezones";

export function toUtcFromTimezone(date: string, time: string, timezone: string): Date {
  return fromZonedTime(`${date}T${time}:00`, resolveTimezone(timezone));
}

export function formatInTimezone(date: Date, timezone: string, pattern: string): string {
  return formatInTimeZone(date, resolveTimezone(timezone), pattern);
}

export function compareTimezoneDates(date: Date, fromTimezone: string, toTimezone: string): number {
  const from = formatInTimeZone(date, resolveTimezone(fromTimezone), "yyyy-MM-dd");
  const to = formatInTimeZone(date, resolveTimezone(toTimezone), "yyyy-MM-dd");

  if (from === to) return 0;
  return to > from ? 1 : -1;
}
