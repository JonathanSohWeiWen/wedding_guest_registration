"use client";
import React, { useMemo, useState, useEffect, useRef } from "react";
import SearchInput from "./SearchInput";
import SuggestionsList from "./SuggestionsList";
import ActionButtons from "./ActionButtons";
import StatusMessage from "./StatusMessage";

type Guest = { name: string; arrived: boolean; table?: string };

type Props<T extends Guest> = {
  names: T[];
  placeholder: string;
  ariaLabel: string;
  apiEndpoint: string;
  getButtonText: (guest: T, loading: boolean) => string;
  renderExtraContent?: (guest: T) => React.ReactNode;
};

export default function SearchGuestClient<T extends Guest>({
  names,
  placeholder,
  ariaLabel,
  apiEndpoint,
  getButtonText,
  renderExtraContent,
}: Props<T>) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [localNames, setLocalNames] = useState<T[]>(names || []);
  const prevQueryLengthRef = useRef(0);

  // Sync localNames whenever names prop changes
  useEffect(() => {
    setLocalNames(names || []);
  }, [names]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return localNames
      .filter((n) => n.name.toLowerCase().includes(q))
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

  async function markGuest(name: string) {
    setStatus(null);
    setLoading(true);
    try {
      const res = await fetch(apiEndpoint, {
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
                ? {
                    ...g,
                    arrived: true,
                    table: (data?.table as T["table"]) || g.table,
                  }
                : g,
            ),
          );
          setStatus(
            data?.table
              ? `Already here! — Table ${data.table}`
              : data?.error || "Already here!",
          );
          return;
        }
        throw new Error(data?.error || "Mark failed");
      }

      // update local state using returned table if present
      setLocalNames((prev) =>
        prev.map((g) =>
          g.name === name
            ? {
                ...g,
                arrived: true,
                table: (data?.table as T["table"]) || g.table,
              }
            : g,
        ),
      );
      setStatus("Marked attendance ✅");
    } catch (err) {
      if (err instanceof Error) setStatus(err?.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  const handleClear = () => {
    setQuery("");
    setStatus(null);
  };

  return (
    <div className="relative">
      <SearchInput
        value={query}
        onChange={(value) => {
          setQuery(value);
          setStatus(null);
        }}
        placeholder={placeholder}
        ariaLabel={ariaLabel}
      />

      <SuggestionsList
        suggestions={suggestions}
        onSelect={(name) => setQuery(name)}
      />

      {suggestions.length === 1 && (
        <ActionButtons
          buttonText={getButtonText(suggestions[0], loading)}
          isDisabled={loading || suggestions[0].arrived}
          isLoading={loading}
          onMark={() => markGuest(suggestions[0].name)}
          onClear={handleClear}
        >
          {renderExtraContent &&
            suggestions[0].arrived &&
            renderExtraContent(suggestions[0])}
        </ActionButtons>
      )}

      <StatusMessage message={status} />
    </div>
  );
}
