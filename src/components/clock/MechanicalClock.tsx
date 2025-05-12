// src/components/clock/MechanicalClock.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MechanicalClockProps {
  hours: number;
  minutes: number;
  seconds: number;
  className?: string;
  size?: number;
}

const MechanicalClock: React.FC<MechanicalClockProps> = ({
  hours,
  minutes,
  seconds,
  className,
  size = 200, // Default size
}) => {
  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5 + seconds * (0.5 / 60);

  const clockSize = size;
  const center = clockSize / 2;
  const handBaseWidth = Math.max(2, clockSize / 50);

  const primaryHandColor = "var(--card-foreground)";
  const secondaryHandColor = "var(--destructive)";
  const tickColorMajor = "var(--card-foreground)";
  const tickColorMinor = "var(--muted-foreground)";
  const centerDotColor = "var(--destructive)";

  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <svg
        width={clockSize}
        height={clockSize}
        viewBox={`0 0 ${clockSize} ${clockSize}`}
        className="bg-card border-2 border-border rounded-full shadow-lg overflow-visible"
      >
        {[...Array(12)].map((_, i) => {
          const angle = i * 30;
          const isMajor = i % 3 === 0;
          const markLength = isMajor ? clockSize * 0.08 : clockSize * 0.05;
          const markWidth = isMajor
            ? Math.max(1.5, clockSize / 100)
            : Math.max(1, clockSize / 150);

          const x1 =
            center +
            (center - markLength - clockSize * 0.04) *
              Math.sin((angle * Math.PI) / 180);
          const y1 =
            center -
            (center - markLength - clockSize * 0.04) *
              Math.cos((angle * Math.PI) / 180);
          const x2 =
            center +
            (center - clockSize * 0.04) * Math.sin((angle * Math.PI) / 180);
          const y2 =
            center -
            (center - clockSize * 0.04) * Math.cos((angle * Math.PI) / 180);
          return (
            <line
              key={`mark-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isMajor ? tickColorMajor : tickColorMinor}
              strokeWidth={markWidth}
              className="transition-colors duration-300 ease-in-out"
            />
          );
        })}
        {[...Array(60)].map((_, i) => {
          if (i % 5 === 0) return null;
          const angle = i * 6;
          const markLength = clockSize * 0.03;
          const markWidth = Math.max(0.5, clockSize / 200);

          const x1 =
            center +
            (center - markLength - clockSize * 0.04) *
              Math.sin((angle * Math.PI) / 180);
          const y1 =
            center -
            (center - markLength - clockSize * 0.04) *
              Math.cos((angle * Math.PI) / 180);
          const x2 =
            center +
            (center - clockSize * 0.04) * Math.sin((angle * Math.PI) / 180);
          const y2 =
            center -
            (center - clockSize * 0.04) * Math.cos((angle * Math.PI) / 180);
          return (
            <line
              key={`minute-mark-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={tickColorMinor}
              strokeWidth={markWidth}
              className="transition-colors duration-300 ease-in-out"
            />
          );
        })}

        <line
          x1={center}
          y1={center}
          x2={center}
          y2={center - clockSize * 0.25}
          stroke={primaryHandColor}
          strokeWidth={handBaseWidth + clockSize / 100}
          strokeLinecap="round"
          transform={`rotate(${hourDeg} ${center} ${center})`}
          className="transition-transform duration-500 ease-out"
        />
        <line
          x1={center}
          y1={center}
          x2={center}
          y2={center - clockSize * 0.38}
          stroke={primaryHandColor}
          strokeWidth={handBaseWidth}
          strokeLinecap="round"
          transform={`rotate(${minuteDeg} ${center} ${center})`}
          className="transition-transform duration-300 ease-out"
        />
        <line
          x1={center}
          y1={center}
          x2={center}
          y2={center - clockSize * 0.42}
          stroke={secondaryHandColor}
          strokeWidth={Math.max(1, handBaseWidth / 2)}
          strokeLinecap="round"
          transform={`rotate(${secondDeg} ${center} ${center})`}
          className="transition-transform duration-1000 ease-linear"
        />
        <circle
          cx={center}
          cy={center}
          r={Math.max(2, handBaseWidth * 0.8)}
          fill={centerDotColor}
        />
      </svg>
    </div>
  );
};

export default MechanicalClock;
