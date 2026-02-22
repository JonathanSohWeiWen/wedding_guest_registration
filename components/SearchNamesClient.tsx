"use client";
import React, { useMemo, useState, useEffect, useRef } from "react";

type Guest = { name: string; arrived: boolean };

type Props = {
  names: Guest[];
};

export default function SearchNamesClient({ names }: Props) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [localNames, setLocalNames] = useState<Guest[]>(names || []);
  const prevQueryLengthRef = useRef(0);

  const guestDetails = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return localNames
      .filter((n) => n.name.toLowerCase().includes(q))
      .slice(0, 5);
  }, [localNames, query]);

  // Auto-fill input when exactly one suggestion remains (only when typing, not backspacing)
  useEffect(() => {
    if (
      guestDetails.length === 1 &&
      query !== guestDetails[0].name &&
      query.length > prevQueryLengthRef.current
    ) {
      setQuery(guestDetails[0].name);
    }
    prevQueryLengthRef.current = query.length;
  }, [guestDetails, query]);

  async function markAttendance(name: string) {
    setStatus(null);
    setLoading(true);
    try {
      const res = await fetch("/api/mark-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) {
        // If already marked, server returns 409 with arrived info
        if (res.status === 409) {
          setLocalNames((prev) =>
            prev.map((g) => (g.name === name ? { ...g, arrived: true } : g)),
          );
          setStatus(data?.error || "Already marked");
          return;
        }
        throw new Error(data?.error || "Mark failed");
      }

      // update local state from server response
      setLocalNames((prev) =>
        prev.map((g) => (g.name === name ? { ...g, arrived: true } : g)),
      );
      setStatus(data?.ok ? "Marked attendance ✅" : data?.message || "Marked");
    } catch (err) {
      if (err instanceof Error) setStatus(err?.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <input
        aria-label="Search name"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setStatus(null);
        }}
        placeholder="Search your name"
        className="w-full rounded-md border p-3 mb-2 text-sage-700 placeholder-sage-400 bg-white"
      />

      {guestDetails.length > 1 && (
        <ul className="absolute left-0 right-0 mt-1 z-50 border rounded-md bg-white max-h-56 overflow-auto text-sage-900 shadow">
          {guestDetails.map((s) => (
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

      {guestDetails.length === 1 && (
        <div className="mt-2 flex items-center gap-3">
          {(() => {
            const single = guestDetails[0];
            const isDisabled = loading || single.arrived;
            const btnClass = `px-4 py-2 bg-sage-600 text-white rounded-md ${isDisabled ? "" : "hover:bg-sage-700"} disabled:opacity-50`;
            return (
              <button
                className={btnClass}
                onClick={() => markAttendance(single.name)}
                disabled={isDisabled}
              >
                {single.arrived
                  ? `Already marked`
                  : loading
                    ? "Marking..."
                    : `Mark attendance for ${single.name}`}
              </button>
            );
          })()}
          <button
            className="px-3 py-2 border rounded-md text-gray-500 text-gray-hover hover:text-gray-800"
            onClick={() => {
              setQuery("");
              setStatus(null);
            }}
          >
            Clear
          </button>
        </div>
      )}

      {status && <p className="mt-2 text-sm text-sage-700">{status}</p>}
    </div>
  );
}
