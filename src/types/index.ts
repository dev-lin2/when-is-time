export type Theme = "light" | "dark" | "system";

export interface TimezoneOption {
  value: string;
  label: string;
}

export interface WorldClockEntry {
  id: string;
  timezone: string;
  label: string;
}

export type TimezoneBucket = "americas" | "europe" | "asia" | "pacific";
