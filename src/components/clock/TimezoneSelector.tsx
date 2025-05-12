/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/clock/TimezoneSelector.tsx
"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

const MagnifyingGlassIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export interface TimezoneGroup {
  id: string;
  offset: string;
  offsetValue: number;
  displayLabel: string;
  representativeIanaName: string;
  searchTerms: string[];
  continent: string;
}

interface TimezoneSelectorProps {
  selectedTimezoneName: string;
  onTimezoneChange: (timezoneName: string) => void;
  className?: string;
}

const MAX_CITIES_IN_LABEL = 5; // Increased slightly, but wrapping is key

const parseOffsetToNumber = (offsetStr: string): number => {
  if (offsetStr === "GMT" || offsetStr === "N/A") return 0;
  const match = offsetStr.match(/GMT([+-])(\d{1,2}):?(\d{2})?/);
  if (!match) return 0;
  const sign = match[1] === "+" ? 1 : -1;
  const hours = parseInt(match[2], 10);
  const minutes = match[3] ? parseInt(match[3], 10) : 0;
  return sign * (hours + minutes / 60);
};

const formatOffsetMinutesToString = (offsetMinutes: number): string => {
  if (offsetMinutes === 0) return "GMT";
  const sign = offsetMinutes > 0 ? "-" : "+";
  const absOffset = Math.abs(offsetMinutes);
  const hours = Math.floor(absOffset / 60);
  const minutes = absOffset % 60;
  return `GMT${sign}${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}`;
};

const ianaToCommonCities: Record<string, string[]> = {
  "America/Chicago": [
    "chicago",
    "dallas",
    "houston",
    "minneapolis",
    "new orleans",
    "winnipeg",
    "mexico city",
  ],
  "America/Denver": [
    "denver",
    "salt lake city",
    "edmonton",
    "boise",
    "phoenix (no DST)",
  ], // Phoenix is tricky due to DST
  "America/Los_Angeles": [
    "los angeles",
    "san francisco",
    "seattle",
    "las vegas",
    "vancouver",
    "san diego",
    "portland",
  ],
  "America/New_York": [
    "new york",
    "boston",
    "philadelphia",
    "washington dc",
    "miami",
    "toronto",
    "montreal",
    "atlanta",
    "detroit",
  ],
  "America/Phoenix": ["phoenix", "tucson"], // Explicitly for Arizona areas that don't observe DST
  "Europe/London": ["london", "dublin", "lisbon"],
  "Europe/Paris": [
    "paris",
    "berlin",
    "rome",
    "madrid",
    "amsterdam",
    "brussels",
  ],
  // Add more as needed
};

const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({
  selectedTimezoneName,
  onTimezoneChange,
  className,
}) => {
  const [allTimezoneGroups, setAllTimezoneGroups] = useState<TimezoneGroup[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    console.log(
      "LOG_GROUP: TimezoneSelector - Starting to fetch and process timezones."
    );
    setIsLoading(true);
    let ianaTimezones: string[] = []; // Keep as let due to potential reassignment in catch
    try {
      const supportedValues = Intl.supportedValuesOf?.("timeZone");
      if (!Intl.DateTimeFormat().resolvedOptions().timeZone) {
        throw new Error(
          "Intl.DateTimeFormat().resolvedOptions().timeZone is undefined, Intl may not be fully supported."
        );
      }
      if (supportedValues && supportedValues.length > 0) {
        ianaTimezones = [...supportedValues].sort(); // Create a new sorted array
      } else {
        console.warn(
          "LOG_GROUP: TimezoneSelector - Intl.supportedValuesOf('timeZone') returned empty or not available. Using fallback list."
        );
        ianaTimezones = [
          "UTC",
          "America/New_York",
          "America/Chicago",
          "America/Denver",
          "America/Los_Angeles",
          "America/Phoenix",
          "Europe/London",
          "Asia/Tokyo",
          "Australia/Sydney",
        ].sort();
      }
      console.log(
        `LOG_GROUP: TimezoneSelector - Initial IANA list size: ${ianaTimezones.length}.`
      );
    } catch (e: unknown) {
      // Use unknown for better type safety in catch
      const errorMessage = e instanceof Error ? e.message : String(e);
      console.error(
        `LOG_GROUP: TimezoneSelector - Error getting IANA timezones: ${errorMessage}. Using fallback.`,
        e
      );
      ianaTimezones = [
        "UTC",
        "America/New_York",
        "Europe/London",
        "Asia/Tokyo",
        "Australia/Sydney",
      ].sort();
    }

    const now = new Date();
    const timezoneDetails: {
      ianaName: string;
      offsetStr: string;
      city: string;
      continent: string;
    }[] = [];

    ianaTimezones.forEach((tzName) => {
      if (tzName.toLowerCase().startsWith("etc/")) return;

      let currentOffsetStr = "N/A"; // Keep as let due to reassignment in try/catch
      try {
        const offsetFormatter = new Intl.DateTimeFormat("en-US", {
          timeZone: tzName,
          timeZoneName: "longOffset",
        });
        const parts = offsetFormatter.formatToParts(now);
        const offsetPart = parts.find((part) => part.type === "timeZoneName");

        if (
          offsetPart &&
          offsetPart.value &&
          (offsetPart.value.startsWith("GMT") ||
            offsetPart.value.startsWith("UTC"))
        ) {
          currentOffsetStr = offsetPart.value.replace("UTC", "GMT");
        } else {
          console.warn(
            `LOG_GROUP: TimezoneSelector - 'longOffset' for ${tzName} was '${offsetPart?.value}'. Using manual calculation.`
          );
          // Use toLocaleString to get a date string in the target timezone, then parse it back to a Date object
          // This is a common way to get a Date object representing "now" in another timezone
          const localNowInTimezoneStr = now.toLocaleString("en-US", {
            timeZone: tzName,
          });
          const dateInTimezone = new Date(localNowInTimezoneStr);
          // getTimezoneOffset on *this new Date object* gives its offset from UTC in minutes
          const offsetMinutes = dateInTimezone.getTimezoneOffset();
          currentOffsetStr = formatOffsetMinutesToString(offsetMinutes);
        }
      } catch (err: unknown) {
        // Use unknown
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.warn(
          `LOG_GROUP: TimezoneSelector - Error processing offset for ${tzName}: ${errorMessage}. Skipping.`
        );
        return;
      }

      if (currentOffsetStr === "N/A") {
        console.warn(
          `LOG_GROUP: TimezoneSelector - Final offset for ${tzName} is N/A. Skipping.`
        );
        return;
      }

      const nameParts = tzName.split("/");
      const city = (
        nameParts.length > 1 ? nameParts.slice(1).join("/") : nameParts[0]
      ).replace(/_/g, " ");
      const continent = nameParts[0].replace(/_/g, " ");
      timezoneDetails.push({
        ianaName: tzName,
        offsetStr: currentOffsetStr,
        city,
        continent,
      });
    });

    console.log(
      `LOG_GROUP: TimezoneSelector - Successfully processed ${timezoneDetails.length} timezones with offsets.`
    );

    const groupsByOffset: {
      [offset: string]: { ianaName: string; city: string; continent: string }[];
    } = {};
    timezoneDetails.forEach((detail) => {
      if (!groupsByOffset[detail.offsetStr]) {
        groupsByOffset[detail.offsetStr] = [];
      }
      groupsByOffset[detail.offsetStr].push(detail);
    });

    const processedGroups: TimezoneGroup[] = Object.entries(groupsByOffset)
      .map(([offset, zonesInGroup]) => {
        if (zonesInGroup.length === 0) return null;

        zonesInGroup.sort((a, b) => {
          const isAmericaA = a.continent === "America";
          const isAmericaB = b.continent === "America";
          if (isAmericaA && !isAmericaB) return -1;
          if (!isAmericaA && isAmericaB) return 1;
          if (a.continent !== b.continent)
            return a.continent.localeCompare(b.continent);
          return a.city.localeCompare(b.city);
        });

        const representativeIanaName = zonesInGroup[0].ianaName;
        const cityNamesInGroup = [
          ...new Set(zonesInGroup.map((z) => z.city)),
        ].sort();

        // For display label, we show all cities now, wrapping will handle it.
        // MAX_CITIES_IN_LABEL is no longer strictly enforced for truncation here.
        const displayLabel = `(${offset}) ${cityNamesInGroup.join(", ")}`;

        const searchTermsForGroup = [
          offset.toLowerCase(),
          ...zonesInGroup.flatMap((z) => {
            const commonCities = ianaToCommonCities[z.ianaName] || [];
            return [
              z.city.toLowerCase(),
              z.continent.toLowerCase(),
              z.ianaName.toLowerCase(),
              ...commonCities,
            ];
          }),
        ].filter((term, index, self) => self.indexOf(term) === index && term);

        return {
          id: offset,
          offset,
          offsetValue: parseOffsetToNumber(offset),
          displayLabel,
          representativeIanaName,
          searchTerms: searchTermsForGroup,
          continent: zonesInGroup[0].continent,
        };
      })
      .filter((group): group is TimezoneGroup => group !== null); // Type guard for filter

    processedGroups.sort((a, b) => {
      if (a.offsetValue !== b.offsetValue) return a.offsetValue - b.offsetValue;
      return a.displayLabel.localeCompare(b.displayLabel);
    });

    console.log(
      `LOG_GROUP: TimezoneSelector - Created ${processedGroups.length} timezone groups.`
    );
    setAllTimezoneGroups(processedGroups);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Explicit type
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      )
        setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
      setActiveIndex(-1);
    }
  }, [isDropdownOpen]);

  const filteredTimezoneGroups = useMemo((): TimezoneGroup[] => {
    if (!searchTerm) return allTimezoneGroups;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return allTimezoneGroups.filter(
      (group) =>
        group.searchTerms.some((term) => term.includes(lowerSearchTerm)) ||
        group.displayLabel.toLowerCase().includes(lowerSearchTerm)
    );
  }, [allTimezoneGroups, searchTerm]);

  const handleSelectTimezoneGroup = (group: TimezoneGroup) => {
    console.log(
      `LOG_GROUP: TimezoneSelector - Selected Group: "${group.displayLabel}", using IANA: ${group.representativeIanaName}`
    );
    onTimezoneChange(group.representativeIanaName);
    setSearchTerm("");
    setIsDropdownOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Explicit type
    if (!isDropdownOpen) return;
    const currentList = filteredTimezoneGroups;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((prevIndex) =>
          Math.min(prevIndex + 1, currentList.length - 1)
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        break;
      case "Enter":
        event.preventDefault();
        if (activeIndex >= 0 && activeIndex < currentList.length)
          handleSelectTimezoneGroup(currentList[activeIndex]);
        break;
      case "Escape":
        event.preventDefault();
        setIsDropdownOpen(false);
        break;
    }
  };

  useEffect(() => {
    if (!isDropdownOpen || !listRef.current) return;
    if (activeIndex === -1) return;
    if (
      listRef.current.children.length > activeIndex &&
      listRef.current.children[activeIndex]
    ) {
      const listItem = listRef.current.children[activeIndex] as HTMLLIElement;
      listItem.scrollIntoView({ block: "nearest" });
    } else if (
      activeIndex >= filteredTimezoneGroups.length &&
      filteredTimezoneGroups.length > 0
    ) {
      setActiveIndex(filteredTimezoneGroups.length - 1);
    } else if (filteredTimezoneGroups.length === 0 && activeIndex !== -1) {
      setActiveIndex(-1);
    }
  }, [activeIndex, isDropdownOpen, filteredTimezoneGroups]);

  let displayValue = selectedTimezoneName; // Keep as let for reassignment
  if (isLoading) {
    displayValue = "Loading...";
  } else {
    const currentGroup = allTimezoneGroups.find(
      (group) => group.representativeIanaName === selectedTimezoneName
    );
    if (currentGroup) {
      displayValue = currentGroup.displayLabel;
    } else if (allTimezoneGroups.length > 0 && selectedTimezoneName) {
      // Ensure selectedTimezoneName is not empty
      const nameParts = selectedTimezoneName.split("/");
      const tempCityDisplay = (
        nameParts.length > 1 ? nameParts.slice(1).join("/") : nameParts[0]
      ).replace(/_/g, " ");
      try {
        const localNowInTimezoneStr = new Date().toLocaleString("en-US", {
          timeZone: selectedTimezoneName,
        });
        const dateInTz = new Date(localNowInTimezoneStr);
        const offsetMinutes = dateInTz.getTimezoneOffset();
        const offsetStr = formatOffsetMinutesToString(offsetMinutes);
        displayValue = `(${offsetStr}) ${tempCityDisplay}`;
      } catch {
        displayValue = tempCityDisplay;
      }
    } else if (!selectedTimezoneName && allTimezoneGroups.length > 0) {
      // Handle case where selectedTimezoneName is initially empty or invalid but we have groups
      displayValue = "Select a timezone";
    }
  }

  return (
    <div
      ref={wrapperRef}
      className={cn("my-4 w-full max-w-md relative", className)}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isDropdownOpen}
        aria-controls="timezone-listbox"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center justify-between w-full p-2 border border-input rounded-md shadow-sm bg-card text-card-foreground focus:ring-primary focus:border-primary text-left min-h-[40px]"
      >
        {" "}
        {/* Added min-h for button */}
        <span className="flex items-center">
          {" "}
          {/* Removed truncate */}
          <MagnifyingGlassIcon />
          <span className="ml-2" id="timezone-selected-value">
            {displayValue}
          </span>
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="absolute z-10 w-full bg-card border border-border rounded-md shadow-lg mt-1">
          <div className="p-2">
            <input
              ref={searchInputRef}
              type="text"
              aria-label="Search timezones"
              placeholder="Type to search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setActiveIndex(-1);
              }}
              className="block w-full p-2 border border-input rounded-md shadow-sm bg-background text-foreground focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
          <ul
            ref={listRef}
            id="timezone-listbox"
            role="listbox"
            aria-activedescendant={
              activeIndex >= 0 && filteredTimezoneGroups[activeIndex]
                ? filteredTimezoneGroups[activeIndex].id
                : undefined
            }
            className="max-h-60 overflow-y-auto custom-scrollbar"
          >
            {isLoading ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">
                Loading...
              </li>
            ) : filteredTimezoneGroups.length > 0 ? (
              filteredTimezoneGroups.map((group, index) => (
                <li
                  key={group.id}
                  id={group.id}
                  role="option"
                  aria-selected={activeIndex === index}
                  onClick={() => handleSelectTimezoneGroup(group)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    "px-3 py-2 cursor-pointer text-sm", // Removed truncate
                    activeIndex === index
                      ? "bg-muted text-muted-foreground"
                      : "hover:bg-muted/50"
                  )}
                >
                  {group.displayLabel}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-sm text-muted-foreground">
                {searchTerm
                  ? "No timezones match your search."
                  : "No timezones available."}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

const MemoizedTimezoneSelector = React.memo(TimezoneSelector);
export default MemoizedTimezoneSelector;
