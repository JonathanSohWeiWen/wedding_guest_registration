"use client";

import FloralBackground from "@/components/FloralBackground";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Guest } from "../lib/data/guests";
import { getProgressColor, isVIPTable, sortTables } from "../lib/utils";
import Link from "next/link";

export default function DashboardContent() {
  const searchParams = useSearchParams();
  const password = searchParams.get("password");

  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<"Church" | "Dinner">(
    process.env.NEXT_PUBLIC_FEATURES_ENABLED?.includes("CHURCH")
      ? "Church"
      : "Dinner",
  );

  useEffect(() => {
    if (password !== "WAJ2026") {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    void fetch(`/api/guests?sheet=${tab}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
      .then((data: Guest[]) => setGuests(data))
      .catch((err) => {
        console.error("Failed to load guest data:", err);
        setGuests([]);
      })
      .finally(() => setIsLoading(false));
  }, [password, tab]);

  // Password protection
  if (password !== "WAJ2026") {
    return (
      <div
        className="flex flex-col min-h-screen items-center justify-center p-6"
        style={{ backgroundColor: "#e7dfd0" }}
      >
        <FloralBackground />
        <div className="text-center relative z-10">
          <h1
            className="text-2xl mb-4"
            style={{
              fontFamily: "var(--font-script), cursive",
              color: "#758857",
              fontWeight: "400",
              fontStyle: "italic",
            }}
          >
            Access Denied
          </h1>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              color: "#7c7c62",
              fontSize: "14px",
            }}
          >
            Invalid or missing password
          </p>
        </div>
      </div>
    );
  }

  if (isLoading)
    return (
      <div
        className="flex flex-col min-h-screen items-center justify-center"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div className="text-center">
          <div
            className="text-lg"
            style={{ fontFamily: "Inter, sans-serif", color: "#758857" }}
          >
            Loading...
          </div>
        </div>
      </div>
    );

  const allTables = sortTables(
    Array.from(new Set(guests.map((g) => g.tableNumber))),
  );

  const totalGuests = guests.length;
  const arrivedGuests = guests.filter((g) => g.arrived).length;
  const pendingGuests = totalGuests - arrivedGuests;
  const arrivalRate =
    totalGuests > 0 ? Math.round((arrivedGuests / totalGuests) * 100) : 0;

  // Group guest by table
  const guestsByTable = allTables
    .map((table) => {
      const tableGuests = guests.filter(
        (g) => String(g.tableNumber) === String(table),
      );
      const arrived = tableGuests.filter((g) => g.arrived).length;
      const total = tableGuests.length;
      return {
        table,
        arrived,
        total,
        percentage: total > 0 ? Math.round((arrived / total) * 100) : 0,
      };
    })
    .filter((t) => t.total > 0);

  return (
    <div
      className="flex flex-col min-h-screen relative"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div style={{ opacity: 0.03 }}>
        <FloralBackground />
      </div>
      <main className="flex flex-col w-full relative z-10 flex-1 p-4 sm:p-6 max-w-2xl mx-auto">
        <div className="text-center mb-6 pt-4">
          <h1
            className="text-3xl mb-2"
            style={{
              fontFamily: "var(--font-script), cursive",
              color: "#758857",
              fontWeight: "400",
              fontStyle: "italic",
              letterSpacing: "1px",
            }}
          >
            Dashboard
          </h1>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              color: "#7c7c62",
              fontSize: "14px",
              fontWeight: "400",
            }}
          >
            Real-time arrival tracking
          </p>
        </div>
        <div
          className="flex justify-center items-center text-center"
          style={{
            backgroundColor: "#f9f8f6",
            border: "1px solid #E0E0DE",
          }}
        >
          <button
            onClick={() => setTab("Church")}
            className="text-3xl p-4 w-full border-2 border-emerald-200"
            style={{
              backgroundColor: tab === "Church" ? "#c6d4ae" : "#f9f8f6",
              fontFamily: "Inter, sans-serif",
              color: "#7c7c62",
              fontSize: "14px",
              fontWeight: tab === "Church" ? "600" : "400",
            }}
          >
            Church
          </button>
          <button
            onClick={() => setTab("Dinner")}
            className="text-3xl p-4 w-full border-2 border-emerald-200"
            style={{
              backgroundColor: tab === "Dinner" ? "#c6d4ae" : "#f9f8f6",
              fontFamily: "Inter, sans-serif",
              color: "#7c7c62",
              fontSize: "14px",
              fontWeight: tab === "Dinner" ? "600" : "400",
            }}
          >
            Dinner
          </button>
        </div>
        <div className="mb-6">
          <h2
            className="text-sm uppercase mb-3"
            style={{
              fontFamily: "Inter, sans-serif",
              color: "#758857",
              letterSpacing: "1px",
              fontWeight: "500",
            }}
          >
            Overall Metrics
          </h2>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: "#f9f8f6",
                border: "1px solid #E0E0DE",
              }}
            >
              <div
                className="text-3xl font-bold mb-1"
                style={{ color: "#758857" }}
              >
                {totalGuests}
              </div>
              <div
                className="text-xs"
                style={{
                  fontFamily: "Inter, sans-serif",
                  color: "#7c7c62",
                  fontWeight: "400",
                }}
              >
                Total Guests
              </div>
            </div>
            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: "#f9f8f6",
                border: "1px solid #E0E0DE",
              }}
            >
              <div
                className="text-3xl font-bold mb-1"
                style={{ color: "#758857" }}
              >
                {arrivalRate}%
              </div>
              <div
                className="text-xs"
                style={{
                  fontFamily: "Inter, sans-serif",
                  color: "#7c7c62",
                  fontWeight: "400",
                }}
              >
                Arrival Rate
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: "#E8F5E9",
                border: "1px solid #C8E6C9",
              }}
            >
              <div
                className="text-3xl font-bold mb-1"
                style={{ color: "#2e7d32" }}
              >
                {arrivedGuests}
              </div>
              <div
                className="text-xs"
                style={{
                  fontFamily: "Inter, sans-serif",
                  color: "#2e7d32",
                  fontWeight: "400",
                }}
              >
                Arrived
              </div>
            </div>
            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: "#fff3e0",
                border: "1px solid #ffe0b2",
              }}
            >
              <div
                className="text-3xl font-bold mb-1"
                style={{ color: "#e65100" }}
              >
                {pendingGuests}
              </div>
              <div
                className="text-xs"
                style={{
                  fontFamily: "Inter, sans-serif",
                  color: "#e65100",
                  fontWeight: "400",
                }}
              >
                Pending
              </div>
            </div>
          </div>
        </div>
        {tab === "Dinner" && (
          <div className="mb-6 flex-1">
            <h2
              className="text-sm uppercase mb-3"
              style={{
                fontFamily: "Inter, sans-serif",
                color: "#758857",
                letterSpacing: "1px",
                fontWeight: "500",
              }}
            >
              Breakdown by Table
            </h2>
            <div className="space-y-2">
              {guestsByTable.map(({ table, arrived, total, percentage }) => {
                const isVIP = isVIPTable(table);
                return (
                  <div
                    key={String(table)}
                    className="p-3 rounded-lg"
                    style={{
                      backgroundColor: "#f9f8f6",
                      border: "1px solid #E0E0DE",
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-medium"
                          style={{
                            fontFamily: "Inter, sans-serif",
                            color: isVIP ? "#C9A86A" : "#758857",
                          }}
                        >
                          {isVIP ? table : `Table ${table}`}
                        </span>
                        {isVIP && (
                          <span
                            className="text-xs px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: "#C9A86A",
                              color: "#ffffff",
                              fontFamily: "Inter, sans-serif",
                              fontWeight: "500",
                              fontSize: "9px",
                            }}
                          >
                            VIP
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontFamily: "Inter, sans-serif",
                          color: "#7c7c62",
                          fontSize: "13px",
                        }}
                      >
                        {arrived}/{total} ({percentage}%)
                      </div>
                    </div>
                    <div
                      className="w-full rounded-full h-2"
                      style={{ backgroundColor: "#E0E0DE" }}
                    >
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: getProgressColor(percentage),
                          transition:
                            "width 0.3s ease, background-color 0.3 ease",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div className="mt-auto pt-6 pb-4 text-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 transition-all"
            style={{
              backgroundColor: "#transparent",
              color: "#758857",
              fontFamily: "Inter, sans-serif",
              fontWeight: "500",
              borderRadius: "8px",
              border: "2px solid #758857",
              transitionDuration: "0.15s",
              transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
            }}
          >
            Back to Floor Plan
          </Link>
        </div>
      </main>
    </div>
  );
}
