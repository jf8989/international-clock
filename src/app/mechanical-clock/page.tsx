/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/mechanical-clock/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import MechanicalClock from "@/components/clock/MechanicalClock";
import TimezoneSelector from "@/components/clock/TimezoneSelector";
import { useTimeInTimezone } from "@/hooks/useTimeInTimezone"; // Assuming you create this hook directory

export default function MechanicalClockPage() {
  const [mounted, setMounted] = useState(false);
  const [defaultTimezone, setDefaultTimezone] = useState("UTC");

  useEffect(() => {
    // Determine user's default timezone on client-side to avoid hydration mismatch
    // and to ensure Intl.DateTimeFormat().resolvedOptions() is available.
    try {
      setDefaultTimezone(
        Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
      );
    } catch (e) {
      console.warn(
        "Could not determine user's default timezone, defaulting to UTC."
      );
      setDefaultTimezone("UTC");
    }
    setMounted(true);
  }, []);

  const [selectedTimezone, setSelectedTimezone] = useState(defaultTimezone);
  const { hours, minutes, seconds } = useTimeInTimezone(selectedTimezone);

  useEffect(() => {
    // Update selectedTimezone if defaultTimezone changes after mount
    // This handles the case where defaultTimezone is determined client-side
    if (mounted) {
      setSelectedTimezone(defaultTimezone);
    }
  }, [defaultTimezone, mounted]);

  const handleTimezoneChange = (newTimezone: string) => {
    setSelectedTimezone(newTimezone);
  };

  if (!mounted) {
    // Render nothing or a loading indicator until client-side determination of timezone is complete
    // This helps prevent hydration errors with timezone-sensitive components.
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
        <p>Loading clock...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-8 text-primary">Mechanical Clock</h1>
      <TimezoneSelector
        selectedTimezoneName={selectedTimezone}
        onTimezoneChange={handleTimezoneChange}
      />
      <MechanicalClock hours={hours} minutes={minutes} seconds={seconds} />
      <div className="mt-4 text-lg">
        Current Time ({selectedTimezone.replace(/_/g, " ")}):
        <span className="font-mono ml-2">
          {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
          {String(seconds).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
