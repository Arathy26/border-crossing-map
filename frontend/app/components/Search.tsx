"use client";
import { useState, useRef, useEffect } from "react";
import { Crossing } from "../types";

type Props = {
  crossings: Crossing[];
  onSelect: (crossing: Crossing) => void;
  onFilter: (filtered: Crossing[]) => void;
};

const riskColors: Record<string, string> = {
  Low: "#4ADE80",
  Medium: "#FBBF24",
  High: "#EF4444",
};

const statusColors: Record<string, string> = {
  Active: "#38BDF8",
  Restricted: "#EF4444",
  Seasonal: "#FBBF24",
};

export default function SmartSearch({ crossings, onSelect, onFilter }: Props) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [focused, setFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.trim()
    ? crossings.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.country.toLowerCase().includes(query.toLowerCase()) ||
        c.commodity.toLowerCase().includes(query.toLowerCase()) ||
        c.risk_level.toLowerCase().includes(query.toLowerCase()) ||
        c.status.toLowerCase().includes(query.toLowerCase()) ||
        c.type.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (query.trim()) {
      onFilter(results);
    } else {
      onFilter(crossings);
    }
  }, [query, crossings]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => prev < results.length - 1 ? prev + 1 : prev);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      handleSelect(results[selectedIndex]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setQuery("");
    }
  }

  function handleSelect(crossing: Crossing) {
    setQuery(crossing.name);
    setShowDropdown(false);
    setSelectedIndex(-1);
    onSelect(crossing);
    onFilter([crossing]);
  }

  function clearSearch() {
    setQuery("");
    setShowDropdown(false);
    setSelectedIndex(-1);
    onFilter(crossings);
    inputRef.current?.focus();
  }

  function highlight(text: string, query: string) {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          style={{
            background: "#38BDF833",
            color: "#38BDF8",
            borderRadius: 2,
          }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  }

  return (
    <div className="relative w-full">

      {/* Input */}
      <div
        className="flex items-center rounded-xl px-4 py-2.5 gap-2 transition-all"
        style={{
          background: "#0B1117",
          border: focused ? "1px solid #38BDF8" : "1px solid #1F2937",
          boxShadow: focused ? "0 0 0 2px #38BDF822" : "none",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => {
            setFocused(true);
            setShowDropdown(true);
          }}
          onBlur={() => {
            setFocused(false);
            setTimeout(() => setShowDropdown(false), 150);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search by name, country, commodity, risk..."
          className="flex-1 text-sm text-white outline-none bg-transparent"
          style={{ caretColor: "#38BDF8" }}
        />

        {query && (
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {results.length} found
          </span>
        )}

        {query && (
          <button onClick={clearSearch} className="text-gray-500 hover:text-white transition">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && query.trim() && (
        <div
          className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-50"
          style={{
            border: "1px solid #1F2937",
            background: "#0B1117",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No crossings found for "{query}"
            </div>
          ) : (
            <>
              <div
                className="px-4 py-2 text-xs text-gray-600 uppercase tracking-widest"
                style={{ borderBottom: "1px solid #1F2937" }}
              >
                {results.length} crossing{results.length !== 1 ? "s" : ""} found
              </div>

              {results.map((crossing, index) => (
                <div
                  key={crossing.id}
                  onClick={() => handleSelect(crossing)}
                  className="flex items-center justify-between px-4 py-3 cursor-pointer transition"
                  style={{
                    background: index === selectedIndex ? "#1F2937" : "transparent",
                    borderBottom: "1px solid #111827",
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: riskColors[crossing.risk_level],
                        flexShrink: 0,
                        boxShadow: `0 0 6px ${riskColors[crossing.risk_level]}`,
                      }}
                    />
                    <div>
                      <p className="text-sm font-medium text-white">
                        {highlight(crossing.name, query)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {highlight(crossing.country, query)} ·{" "}
                        {highlight(crossing.commodity, query)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className="text-xs px-2 py-0.5 rounded-lg"
                      style={{
                        border: `1px solid ${statusColors[crossing.status]}`,
                        color: statusColors[crossing.status],
                      }}
                    >
                      {crossing.status}
                    </span>
                    <span
                      className="text-xs font-bold"
                      style={{
                        color:
                          crossing.wait_time > 60 ? "#EF4444"
                          : crossing.wait_time > 30 ? "#FBBF24"
                          : "#4ADE80",
                      }}
                    >
                      {crossing.wait_time}m
                    </span>
                  </div>
                </div>
              ))}

              <div
                className="px-4 py-2 flex gap-2 flex-wrap"
                style={{ borderTop: "1px solid #1F2937" }}
              >
                <span className="text-xs text-gray-600">Quick:</span>
                {["High", "Low", "Active", "Restricted"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setQuery(tag);
                      setShowDropdown(true);
                    }}
                    className="text-xs px-2 py-0.5 rounded-lg transition"
                    style={{ border: "1px solid #1F2937", color: "#6B7280" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#38BDF8";
                      e.currentTarget.style.color = "#38BDF8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#1F2937";
                      e.currentTarget.style.color = "#6B7280";
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}