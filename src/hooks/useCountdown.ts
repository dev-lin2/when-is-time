import { differenceInSeconds } from "date-fns";
import { useMemo } from "react";
import { formatDuration } from "@/lib/utils";
import { useCurrentTime } from "@/hooks/useCurrentTime";

export interface CountdownResult {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isPast: boolean;
  isNow: boolean;
  formatted: string;
}

export function useCountdown(targetTime: Date): CountdownResult {
  const now = useCurrentTime(1000);

  return useMemo(() => {
    const diff = differenceInSeconds(targetTime, now);
    const isPast = diff < 0;
    const absolute = Math.abs(diff);

    const hours = Math.floor(absolute / 3600);
    const minutes = Math.floor((absolute % 3600) / 60);
    const seconds = absolute % 60;

    return {
      hours,
      minutes,
      seconds,
      totalSeconds: absolute,
      isPast,
      isNow: absolute === 0,
      formatted: formatDuration(absolute),
    };
  }, [now, targetTime]);
}
