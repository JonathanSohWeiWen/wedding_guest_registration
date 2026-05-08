"use client";

import { useState, useMemo, useEffect } from "react";
import type { Guest } from "../../lib/data/guests";
import FloralBackground from "@/components/FloralBackground";
import { colors } from "../../lib/data/constants";
import FloralDivider from "@/components/FloralDivider";
import Link from "next/link";

export default function DinnerSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [guestList, setGuestList] = useState<Guest[]>([]);

  useEffect(() => {
    void fetch("/api/guests?sheet=Dinner")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
      .then((data: Guest[]) => setGuestList(data))
      .catch((err) => {
        console.error("Failed to load guest list:", err);
        setGuestList([]);
      });
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const term = searchQuery.toLowerCase().trim();
    return guestList.filter(
      (guest) =>
        guest.firstName.toLowerCase().includes(term) ||
        guest.lastName.toLowerCase().includes(term),
    );
  }, [guestList, searchQuery]);

  const showResults = searchQuery.trim() !== "";
  const hasResults = searchResults.length > 0;

  return (
    <div
      className="flex flex-col flex-1 items-center justify-center min-h-screen p-4 sm:p-8 relative"
      style={{ backgroundColor: colors.background }}
    >
      <FloralBackground />
      <main className="flex flex-col items-center gap-6 w-full max-w-2xl relative z-10">
        <div className="text-center">
          <h1
            className="text-4xl sm:text-5xl mb-3"
            style={{
              fontFamily: "var(--font-script), cursive",
              color: colors.primary,
              fontWeight: "400",
              fontStyle: "italic",
              letterSpacing: "1px",
            }}
          >
            {process.env.NEXT_PUBLIC_COUPLE || "Bride & Groom"}
          </h1>
          <p
            className="text-sm uppercase tracking-widest mb-4"
            style={{
              fontFamily: "Inter, sans-serif",
              color: colors.text.secondary,
              fontWeight: "500",
              letterSpacing: "2px",
            }}
          >
            Find your seat
          </p>
          <p
            className="text-base sm:text-lg mb-4"
            style={{
              fontFamily: "Inter, sans-serif",
              color: colors.secondary,
              fontWeight: "400",
            }}
          >
            Search for your name to view your table assignment
          </p>
          <FloralDivider />
        </div>
        {showResults && hasResults && (
          <p
            className="text-sm text-center -my-3"
            style={{
              fontFamily: "Inter, sans-serif",
              color: colors.secondary,
              fontWeight: "400",
            }}
          >
            Found {searchResults.length}{" "}
            {searchResults.length === 1 ? "guest" : "guests"}
          </p>
        )}
        <div
          className="w-full p-6 sm:p-8"
          style={{
            backgroundColor: "rgba(231, 223, 208, 0.5)",
            borderRadius: "12px",
          }}
        >
          <div className="mb-6">
            <input
              type="text"
              placeholder="Enter your name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 text-base sm:text-lg text-center outline-none transition-all focus:shadow-md"
              style={{
                fontFamily: "Inter, sans-serif",
                color: colors.text.primary,
                border: `2px solid ${colors.border}`,
                borderRadius: "8px",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = colors.primary)
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = colors.border)
              }
              autoFocus
            />
          </div>
          {showResults && (
            <div className="space-y-2">
              {hasResults ? (
                <>
                  {searchResults.map((guest) => (
                    <GuestResultCard key={guest.id} guest={guest} />
                  ))}
                </>
              ) : (
                <div className="text-center py-8">
                  <p
                    className="text-lg"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      color: colors.secondary,
                      fontWeight: "400",
                    }}
                  >
                    No guests found matching &quot;{searchQuery}&quot;
                  </p>
                  <p
                    className="text-sm mt-2"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      color: colors.secondary,
                      fontWeight: "400",
                    }}
                  >
                    Try searching by first or last name
                  </p>
                </div>
              )}
            </div>
          )}

          {!showResults && (
            <div className="text-center py-6">
              <p
                className="text-sm"
                style={{
                  fontFamily: "Inter, sans-serif",
                  color: colors.secondary,
                  fontWeight: "400",
                }}
              >
                Start typing to search for a guest
              </p>
            </div>
          )}
        </div>
        <Link
          href="/dinner"
          className="inline-block px-6 py-3 transition-all"
          style={{
            fontFamily: "Inter, sans-serif",
            color: colors.primary,
            backgroundColor: "transparent",
          }}
        >
          Back to Seating Chart
        </Link>
      </main>
    </div>
  );
}

function GuestResultCard({ guest }: { guest: Guest }) {
  const isVIP =
    typeof guest.tableNumber === "string" &&
    guest.tableNumber.startsWith("VIP");

  return (
    <Link
      href={`/dinner/guest/${guest.id}`}
      className="flex items-center justify-between p-4 transition-all hover:bg-opacity-80"
      style={{
        backgroundColor: "#FFFFFF",
        border: `1px solid ${colors.border}`,
        borderRadius: "6px",
      }}
    >
      <div>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "15px",
            fontWeight: "500",
            color: colors.text.primary,
          }}
        >
          {guest.firstName} {guest.lastName}
        </p>
        {isVIP && (
          <p
            className="text-xs uppercase tracking-wider"
            style={{
              fontFamily: "Inter, sans-serif",
              color: colors.accent,
              fontWeight: "600",
              letterSpacing: "1px",
              marginTop: "2px",
            }}
          >
            VIP
          </p>
        )}
      </div>
      <div
        style={{
          color: colors.secondary,
          fontSize: "20px",
        }}
      >
        →
      </div>
    </Link>
  );
}
