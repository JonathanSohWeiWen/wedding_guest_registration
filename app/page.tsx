"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { TableId, tableLayout } from "./lib/data/constants";
import { isVIPTable } from "./lib/utils";
import Link from "next/link";
import FloralBackground from "@/components/FloralBackground";
import Door from "@/components/Door";
import DoorWide from "@/components/DoorWide";

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const highlightTable = searchParams.get("highlight") || "";

  const scrollToSection = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth;
      const newScrollPosition =
        direction === "left"
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;
      container.scrollTo({ left: newScrollPosition, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      let section = 1;
      if (highlightTable) section = getTableSection(highlightTable);
      const scrollAmount = container.clientWidth * section;

      setTimeout(() => {
        container.scrollTo({
          left: scrollAmount,
          behavior: "smooth",
        });
      });
    }
  }, [highlightTable]);

  return (
    <div
      className="flex flex-col flex-1 items-center justify-center min-h-screen p-2 sm:p-8 relative"
      style={{ backgroundColor: "#e7dfd0" }}
    >
      <FloralBackground />
      <main className="flex flex-col items-center gap-8 sm:gap-16 w-full max-w-6xl relative z-10">
        <div className="text-center" style={{ marginTop: "48px" }}>
          <h1
            className="text-4xl sm:text-5xl px-4 mb-4"
            style={{
              fontFamily: "cursive",
              color: "#758857",
              fontWeight: "400",
              fontStyle: "italic",
              letterSpacing: "1px",
            }}
          >
            {process.env.NEXT_PUBLIC_COUPLE}
          </h1>
          <p
            className="text-base sm:text-lg"
            style={{
              fontFamily: "Inter, sans-serif",
              color: "#7c7c62",
              fontWeight: "400",
            }}
          >
            Seating Arrangement
          </p>
        </div>
        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-auto px-2 sm:px-0 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex gap-4 sm:gap-8">
            <div className="shrink-0 w-full snap-center">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div
                  className="w-full px-6 sm:px-8 py-4 sm:py-6 text-center rounded-lg"
                  style={{
                    backgroundColor: "#758857",
                    color: "#e7dfd0",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: "500",
                    letterSpacing: "1px",
                  }}
                >
                  STAGE
                </div>
                <div
                  className="grid grid-cols-3 gap-3 sm:gap-4 p-6 sm:p-8 auto-rows-fr relative"
                  style={{
                    backgroundColor: "rgba(231, 223, 208, 0.5",
                    borderRadius: "12px",
                  }}
                >
                  {tableLayout.map((row, rowIndex) =>
                    row
                      .slice(0, 3)
                      .map((table, colIndex) =>
                        rendertTable(
                          highlightTable,
                          table,
                          rowIndex,
                          colIndex,
                          0,
                        ),
                      ),
                  )}
                  <div
                    className="absolute left-2 bottom-2 px-3 py-2 rounded text-xs"
                    style={{
                      backgroundColor: "#333333",
                      color: "#e7dfd0",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "10px",
                      fontWeight: "500",
                      letterSpacing: "0.5px",
                    }}
                  >
                    AV CONSOLE
                  </div>
                </div>
                <div className="px-6 sm:px-8">
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    <div></div>
                    <div></div>
                    <div>
                      <Door />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="shrink-0 w-full snap-center">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div
                  className="w-full px-6 sm:px-8 py-4 sm:py-6 text-center rounded-lg"
                  style={{
                    backgroundColor: "#758857",
                    color: "#e7dfd0",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: "500",
                    letterSpacing: "1px",
                  }}
                >
                  STAGE
                </div>
                <div
                  className="grid grid-cols-3 gap-3 sm:gap-4 p-6 sm:p-8 auto-rows-fr"
                  style={{
                    backgroundColor: "rgba(231, 223, 208, 0.5)",
                    borderRadius: "12px",
                  }}
                >
                  {tableLayout.map((row, rowIndex) =>
                    row.slice(3, 6).map((table, colIndex) => {
                      // Skip rendering if this is a continuation of table 30 or 31
                      if (rowIndex > 1 && (table === 30 || table === 31))
                        return null;
                      // Long vertical tables (30 and 31)
                      if (table === 30 || table === 31) {
                        const gridColumn = table === 30 ? 1 : 3;
                        const seats = 25,
                          leftSeats = 13,
                          rightSeats = 12;
                        const isHighlighted = String(table) === highlightTable;

                        return (
                          <div
                            key={`${rowIndex}-${colIndex + 3}`}
                            className="relative"
                            style={{ gridColumn: gridColumn, gridRow: "2 / 6" }}
                          >
                            {Array.from({ length: leftSeats }, (_, i) => (
                              <div
                                key={`${table}-left-${i}`}
                                className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-sm"
                                style={{
                                  left: "5%",
                                  top: `${5 + i * 7.3}%`,
                                  transform: "translateX(-50%) rotate(-90deg)",
                                  backgroundColor: "#7c7c62",
                                }}
                              ></div>
                            ))}
                            {Array.from({ length: rightSeats }, (_, i) => (
                              <div
                                key={`${table}-right-${i}`}
                                className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-sm"
                                style={{
                                  right: "5%",
                                  top: `${5 + i * 7.3}%`,
                                  transform: "translateX(50%) rotate(90deg)",
                                  backgroundColor: "#7c7c62",
                                }}
                              ></div>
                            ))}
                            <Link
                              href={`/tables/${table}`}
                              className="absolute inset-0 text-xs sm:text-sm rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer gap-1"
                              style={{
                                fontFamily: "Inter, sans-serif",
                                fontWeight: "400",
                                backgroundColor: "#e7dfd0",
                                color: "#758857",
                                border: "1px solid #7c7c62",
                                transitionDuration: "0.15s",
                                transitionTimingFunction:
                                  "cubic-bezier(0.23, 1, 0.32, 1)",
                                margin: "0 15%",
                                boxShadow: isHighlighted
                                  ? "0 0 20px 8px rgba(201, 168, 106, 0.6), 0 0 40px 16px rgba(201, 168, 106, 0.3)"
                                  : "none",
                                animation: isHighlighted
                                  ? "pulse-glow 2s ease-in-out infinite"
                                  : "none",
                              }}
                            >
                              <span className="font-medium text-sm sm:text-base">
                                {table}
                              </span>
                              <span
                                className="text-xs"
                                style={{ color: "#7c7c62", fontSize: "10px" }}
                              >
                                {seats} seats
                              </span>
                            </Link>
                          </div>
                        );
                      }
                      return rendertTable(
                        highlightTable,
                        table,
                        rowIndex,
                        colIndex,
                        3,
                      );
                    }),
                  )}
                </div>
                <div className="px-6 sm:px-8">
                  <DoorWide />
                </div>
              </div>
            </div>
            <div className="shrink-0 w-full snap-center">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div
                  className="w-full px-6 sm:px-8 py-4 sm:py-6 text-center rounded-lg"
                  style={{
                    backgroundColor: "#758857",
                    color: "#e7dfd0",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: "500",
                    letterSpacing: "1px",
                  }}
                >
                  STAGE
                </div>
                <div
                  className="grid grid-cols-3 gap-3 sm:gap-4 p-6 sm:p-8 auto-rows-fr relative"
                  style={{
                    backgroundColor: "rgba(231, 223, 208, 0.5",
                    borderRadius: "12px",
                  }}
                >
                  {tableLayout.map((row, rowIndex) =>
                    row
                      .slice(0, 3)
                      .map((table, colIndex) =>
                        rendertTable(
                          highlightTable,
                          table,
                          rowIndex,
                          colIndex,
                          0,
                        ),
                      ),
                  )}
                </div>
                <div className="px-6 sm:px-8">
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    <div></div>
                    <div></div>
                    <div>
                      <Door />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mt-6">
          <button
            onClick={() => scrollToSection("left")}
            className="p-3 rounded-full transition-all hover:bg-opacity-10"
            style={{
              backgroundColor: "transparent",
              border: `1px solid #7c7c62`,
              color: "#758857",
              cursor: "pointer",
              transitionDuration: "0.15s",
              transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(117, 136, 87, 0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            aria-label="Previous section"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            onClick={() => scrollToSection("right")}
            className="p-3 rounded-full transition-all hover:bg-opacity-10"
            style={{
              backgroundColor: "transparent",
              border: `1px solid #7c7c62`,
              color: "#758857",
              cursor: "pointer",
              transitionDuration: "0.15s",
              transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(117, 136, 87, 0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            aria-label="Previous section"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        <p
          className="text-sm sm:text-base text-center px-4 mt-4"
          style={{
            fontFamily: "Inter, sans-serif",
            color: "#7c7c62",
            fontWeight: "400",
          }}
        >
          Click on any table to view details
        </p>
        <Link
          href="/search"
          className="inline-block px-6 py-3 transition-all"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            fontWeight: "500",
            color: "#758857",
            backgroundColor: "transparent",
            border: "2px solid #758857",
            borderRadius: "8px",
            transitionDuration: "0.15s",
            transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32,1)",
            marginBottom: "64px",
          }}
        >
          Guest List
        </Link>
      </main>
    </div>
  );
}

const getTableSection = (table: TableId): number => {
  for (let rowIndex = 0; rowIndex < tableLayout.length; rowIndex++) {
    const row = tableLayout[rowIndex];
    const colIndex = row.indexOf(table);
    if (colIndex !== -1) {
      if (colIndex <= 2) return 0;
      if (colIndex <= 5) return 1;
      return 2;
    }
  }
  return 0;
};

const renderChairs = (seats: number) => {
  const angleStep = 360 / seats;
  return Array.from({ length: seats }, (_, i) => {
    const angle = (i * angleStep - 90) * (Math.PI / 180);
    const x = 50 + 45 * Math.cos(angle);
    const y = 50 + 45 * Math.sin(angle);
    const rotation = i * angleStep;
    return (
      <div
        key={`chair-${i}`}
        className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-sm"
        style={{
          left: `${x}`,
          top: `${y}`,
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          backgroundColor: "#7c7c62",
        }}
      />
    );
  });
};

const rendertTable = (
  highlightTable: string,
  table: TableId,
  rowIndex: number,
  colIndex: number,
  sectionOffset: number = 0,
) => {
  if (table === 0)
    return (
      <div
        key={`${rowIndex}-${colIndex + sectionOffset}`}
        className="aspect-square"
      />
    );

  const isVIP = isVIPTable(table);
  const seats = 10; // default amount
  const isHighlighted = String(table) === highlightTable;

  return (
    <div
      key={`${rowIndex}-${colIndex + sectionOffset}`}
      className="aspect-square relative"
    >
      {renderChairs(seats)}
      <Link
        href={`/tables/${table}`}
        className="absolute inset-0 rounded-full flex flex-col items-center justify-center text-xs sm:text-sm transition-all cursor-pointer"
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: "400",
          backgroundColor: "#e7dfd0",
          color: "#758857",
          border: isVIP ? "2px solid #758857" : "1px solid #7c7c62",
          transitionDuration: "0.15s",
          transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
          margin: "10%",
          boxShadow: isHighlighted
            ? "0 0 20px 8px rgba(201, 168, 106, 0.6) 0 0 40px 16px rgba(201, 168, 106, 0.3)"
            : "none",
          animation: isHighlighted
            ? "pulse-glow 2s ease-in-out infinite"
            : "none",
        }}
      >
        <span className="font-medium text-sm sm:text-base">{table}</span>
        <span
          className="text-xs"
          style={{ color: "#7c7c62", fontSize: "10px", marginTop: "2px" }}
        >
          {seats} seats
        </span>
      </Link>
    </div>
  );
};
