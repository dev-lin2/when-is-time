import type { TimezoneBucket, WorldClockEntry } from "@/types";

export const APP_NAME = "When Time Is?";
export const MAX_WORLD_CLOCKS = 10;

export const getDefaultTimezones = (): WorldClockEntry[] => {
  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  return [
    { id: "local", timezone: localTz, label: "LOCAL" },
    { id: "utc", timezone: "UTC", label: "UTC" },
    { id: "est", timezone: "EST", label: "EST" },
  ];
};

export const TIMEZONE_COLORS: Record<
  TimezoneBucket,
  { bg: string; border: string; accent: string }
> = {
  americas: {
    bg: "bg-gradient-to-br from-sky-500/18 via-sky-500/8 to-cyan-400/14 dark:from-sky-500/28 dark:via-sky-500/18 dark:to-cyan-400/16",
    border: "border-sky-500/40 dark:border-sky-400/45",
    accent: "text-sky-800 dark:text-sky-200",
  },
  europe: {
    bg: "bg-gradient-to-br from-emerald-500/18 via-emerald-500/8 to-teal-400/12 dark:from-emerald-500/30 dark:via-emerald-500/18 dark:to-teal-400/15",
    border: "border-emerald-500/40 dark:border-emerald-400/45",
    accent: "text-emerald-800 dark:text-emerald-200",
  },
  asia: {
    bg: "bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-orange-400/14 dark:from-amber-500/32 dark:via-amber-500/20 dark:to-orange-400/16",
    border: "border-amber-500/45 dark:border-amber-400/48",
    accent: "text-amber-900 dark:text-amber-200",
  },
  pacific: {
    bg: "bg-gradient-to-br from-fuchsia-500/18 via-fuchsia-500/8 to-violet-400/14 dark:from-fuchsia-500/30 dark:via-fuchsia-500/18 dark:to-violet-400/16",
    border: "border-fuchsia-500/40 dark:border-fuchsia-400/45",
    accent: "text-fuchsia-800 dark:text-fuchsia-200",
  },
};
