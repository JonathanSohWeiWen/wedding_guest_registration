"use client";

import Link from "next/link";
import FloralBackground from "@/components/FloralBackground";
import FloralDivider from "@/components/FloralDivider";
import { colors } from "./lib/data/constants";

export default function HomePage() {
  return (
    <div
      className="flex flex-col flex-1 items-center justify-center min-h-screen p-4 sm:p-8 relative"
      style={{ backgroundColor: colors.background }}
    >
      <FloralBackground />
      <main className="flex flex-col items-center gap-8 w-full max-w-2xl relative z-10">
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
            Wedding Celebration
          </p>
          <p
            className="text-base sm:text-lg mb-4"
            style={{
              fontFamily: "Inter, sans-serif",
              color: colors.secondary,
              fontWeight: "400",
            }}
          >
            Select an event to begin
          </p>
          <FloralDivider />
        </div>

        <div className="w-full space-y-4">
          {/* Church Option */}
          {process.env.NEXT_PUBLIC_FEATURES_ENABLED?.includes("CHURCH") && (
            <Link
              href="/church"
              className="block w-full p-8 transition-all hover:shadow-lg"
              style={{
                backgroundColor: "#FFFFFF",
                border: `2px solid ${colors.primary}`,
                borderRadius: "12px",
              }}
            >
              <div className="text-center">
                <div
                  className="text-4xl mb-3"
                  style={{ color: colors.primary }}
                >
                  ⛪
                </div>
                <h2
                  className="text-2xl mb-2"
                  style={{
                    fontFamily: "var(--font-script), cursive",
                    color: colors.primary,
                    fontWeight: "400",
                    fontStyle: "italic",
                  }}
                >
                  Church
                </h2>
                <p
                  className="text-sm"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    color: colors.secondary,
                    fontWeight: "400",
                  }}
                >
                  Check in for the ceremony
                </p>
              </div>
            </Link>
          )}

          {/* Dinner Option */}
          {process.env.NEXT_PUBLIC_FEATURES_ENABLED?.includes("DINNER") && (
            <Link
              href="/dinner"
              className="block w-full p-8 transition-all hover:shadow-lg"
              style={{
                backgroundColor: "#FFFFFF",
                border: `2px solid ${colors.accent}`,
                borderRadius: "12px",
              }}
            >
              <div className="text-center">
                <div className="text-4xl mb-3" style={{ color: colors.accent }}>
                  🍽️
                </div>
                <h2
                  className="text-2xl mb-2"
                  style={{
                    fontFamily: "var(--font-script), cursive",
                    color: colors.accent,
                    fontWeight: "400",
                    fontStyle: "italic",
                  }}
                >
                  Dinner & Reception
                </h2>
                <p
                  className="text-sm"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    color: colors.secondary,
                    fontWeight: "400",
                  }}
                >
                  Find your table and seating
                </p>
              </div>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
