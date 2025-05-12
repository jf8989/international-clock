// src/app/page.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import MechanicalClock from "@/components/clock/MechanicalClock";
import TimezoneSelector from "@/components/clock/TimezoneSelector";
import { useTimeInTimezone } from "@/hooks/useTimeInTimezone";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [currentTimezoneName, setCurrentTimezoneName] = useState("UTC");
  const [displayableOffset, setDisplayableOffset] = useState("GMT");

  // Ref to store the previous timezone name to log changes effectively
  const prevTimezoneForLogRef = useRef<string | null>(null);

  useEffect(() => {
    // Initial mount: determine user's timezone
    let initialTzName = "UTC";
    try {
      initialTzName = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    } catch (e) {
      console.warn(
        "LOG_GROUP: HomePage - Could not determine user's default timezone, defaulting to UTC.",
        e
      );
    }
    setCurrentTimezoneName(initialTzName);
    setMounted(true);
    // Initial log will be handled by the main logging effect below
  }, []);

  useEffect(() => {
    // Effect to update displayableOffset when currentTimezoneName changes
    if (!currentTimezoneName) return;
    let offset = "GMT";
    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: currentTimezoneName,
        timeZoneName: "longOffset",
      });
      const parts = formatter.formatToParts(now);
      const offsetPart = parts.find((part) => part.type === "timeZoneName");
      if (offsetPart) offset = offsetPart.value;
    } catch (e) {
      console.warn(
        `LOG_GROUP: HomePage - Could not get offset for "${currentTimezoneName}", using GMT. Error:`,
        e
      );
    }
    setDisplayableOffset(offset);
  }, [currentTimezoneName]);

  const { hours, minutes, seconds } = useTimeInTimezone(currentTimezoneName);

  // Effect for logging timezone and time changes
  useEffect(() => {
    if (mounted && currentTimezoneName !== prevTimezoneForLogRef.current) {
      console.log(
        `LOG_GROUP: HomePage - Timezone Display Update: Name="${currentTimezoneName}", Offset="${displayableOffset}", Time=${String(
          hours
        ).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
          seconds
        ).padStart(2, "0")}`
      );
      prevTimezoneForLogRef.current = currentTimezoneName;
    }
  }, [
    currentTimezoneName,
    displayableOffset,
    hours,
    minutes,
    seconds,
    mounted,
  ]);

  const handleTimezoneChange = useCallback((newTimezoneName: string) => {
    console.log(
      `LOG_GROUP: HomePage - handleTimezoneChange called with: "${newTimezoneName}"`
    );
    setCurrentTimezoneName(newTimezoneName);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center min-h-screen p-4",
          "bg-background text-foreground"
        )}
      >
        <p className="text-lg">Loading Clock Interface...</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-screen p-4 pt-10 sm:pt-16",
        "bg-background text-foreground transition-colors duration-300 ease-in-out"
      )}
    >
      <header className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
          Mechanical Timekeeper
        </h1>
        <p className="text-md sm:text-lg text-muted-foreground mt-2">
          Select a timezone to see the current time.
        </p>
      </header>
      <TimezoneSelector
        selectedTimezoneName={currentTimezoneName}
        onTimezoneChange={handleTimezoneChange}
        className="mb-6 sm:mb-8"
      />
      <MechanicalClock
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        size={280}
        className="mb-6 sm:mb-8"
      />
      <footer className="mt-auto pt-8 text-center">
        <div className="text-xl sm:text-2xl font-medium text-foreground mb-2">
          {currentTimezoneName.replace(/_/g, " ")} ({displayableOffset})
        </div>
        <div className="text-3xl sm:text-4xl font-mono text-accent-foreground tracking-wider">
          {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
          {String(seconds).padStart(2, "0")}
        </div>
      </footer>
    </div>
  );
}
