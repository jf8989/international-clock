// src/hooks/useTimeInTimezone.ts
import { useState, useEffect } from "react";

interface TimeParts {
  hours: number;
  minutes: number;
  seconds: number;
}

export function useTimeInTimezone(timezone: string): TimeParts {
  const [timeParts, setTimeParts] = useState<TimeParts>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      try {
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: timezone,
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: false, // Use 24-hour format for easier calculations
        });
        const parts = formatter.formatToParts(now);

        let h = 0,
          m = 0,
          s = 0;
        parts.forEach((part) => {
          if (part.type === "hour") h = parseInt(part.value, 10);
          else if (part.type === "minute") m = parseInt(part.value, 10);
          else if (part.type === "second") s = parseInt(part.value, 10);
        });
        setTimeParts({ hours: h, minutes: m, seconds: s });
      } catch (error) {
        console.error(`Error formatting time for timezone ${timezone}:`, error);
        // Fallback to local time parts if timezone is invalid
        const localHours = now.getHours();
        const localMinutes = now.getMinutes();
        const localSeconds = now.getSeconds();
        setTimeParts({
          hours: localHours,
          minutes: localMinutes,
          seconds: localSeconds,
        });
      }
    };

    updateClock(); // Initial update
    const intervalId = setInterval(updateClock, 1000);

    return () => clearInterval(intervalId);
  }, [timezone]);

  return timeParts;
}
