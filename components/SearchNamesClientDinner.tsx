"use client";
import React, { useMemo, useState, useEffect, useRef } from "react";

type Guest = { name: string; arrived: boolean; table?: string };

type Props = { names: Guest[] };

export default function SearchNamesClientDinner({ names }: Props) {
  const [query, setQuery] = useState("");
  const [localNames, setLocalNames] = useState<Guest[]>(names || []);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const prevQueryLengthRef = useRef(0);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return localNames
      .filter((g) => g.name.toLowerCase().includes(q))
      .slice(0, 5);
  }, [localNames, query]);

  // Auto-fill input when exactly one suggestion remains (only when typing, not backspacing)
  useEffect(() => {
    if (
      suggestions.length === 1 &&
      query !== suggestions[0].name &&
      query.length > prevQueryLengthRef.current
    ) {
      setQuery(suggestions[0].name);
    }
    prevQueryLengthRef.current = query.length;
  }, [suggestions, query]);

  async function markDinner(name: string) {
    setStatus(null);
    setLoading(true);
    try {
      const res = await fetch("/api/mark-attendance-dinner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          // already marked
          setLocalNames((prev) =>
            prev.map((g) =>
              g.name === name
                ? { ...g, arrived: true, table: data?.table || g.table }
                : g,
            ),
          );
          setStatus(
            data?.table
              ? `Already marked — Table ${data.table}`
              : data?.error || "Already marked",
          );
          return;
        }
        throw new Error(data?.error || "Mark failed");
      }

      // update local state using returned table if present
      setLocalNames((prev) =>
        prev.map((g) =>
          g.name === name
            ? { ...g, arrived: true, table: data?.table || g.table }
            : g,
        ),
      );
      setStatus(
        data?.table ? `Marked — Table ${data.table}` : "Marked attendance ✅",
      );
    } catch (err) {
      if (err instanceof Error) setStatus(err.message);
      else setStatus("Error marking attendance");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <input
        aria-label="Search dinner name"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setStatus(null);
        }}
        placeholder="Search your name for dinner"
        className="w-full rounded-md border p-3 mb-2 text-sage-700 placeholder-sage-400 bg-white"
      />

      {suggestions.length > 1 && (
        <ul className="absolute left-0 right-0 mt-1 z-50 border rounded-md bg-white max-h-56 overflow-auto text-sage-900 shadow">
          {suggestions.map((s) => (
            <li
              key={s.name}
              className="flex justify-between items-center p-2 hover:bg-sage-50 cursor-pointer"
              onClick={() => setQuery(s.name)}
            >
              <span>{s.name}</span>
              {s.arrived && (
                <span className="text-xs text-sage-600">Arrived</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {suggestions.length === 1 && (
        <div className="mt-2 flex items-center gap-3">
          {(() => {
            const single = suggestions[0];
            const isDisabled = loading || single.arrived;
            const btnClass = `px-4 py-2 bg-sage-600 text-white rounded-md ${isDisabled ? "" : "hover:bg-sage-700"} disabled:opacity-50`;
            return (
              <button
                className={btnClass}
                onClick={() => markDinner(single.name)}
                disabled={isDisabled}
              >
                {single.arrived
                  ? `Already marked`
                  : loading
                    ? "Marking..."
                    : `Mark dinner for ${single.name}`}
              </button>
            );
          })()}
          <button
            className="px-3 py-2 border rounded-md"
            onClick={() => {
              setQuery("");
              setStatus(null);
            }}
          >
            Clear
          </button>
          {suggestions[0] && suggestions[0].arrived && suggestions[0].table && (
            <div className="text-sm text-sage-700">
              Table {suggestions[0].table}
            </div>
          )}
        </div>
      )}

      {status && <p className="mt-2 text-sm text-sage-700">{status}</p>}
    </div>
  );
}
