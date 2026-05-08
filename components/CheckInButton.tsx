"use client";

import { useState, useEffect } from "react";
import { colors } from "@/app/lib/data/constants";
import { usePathname } from "next/navigation";

interface CheckInButtonProps {
  guestId: string;
  guestName: string;
}

type ButtonState = "not-checked-in" | "checking-in" | "checked-in";

export default function CheckInButton({
  guestId,
  guestName,
}: CheckInButtonProps) {
  const [buttonState, setButtonState] = useState<ButtonState>("not-checked-in");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sheet = usePathname().split("/")[1] === "church" ? "Church" : "Dinner";

  useEffect(() => {
    // Check if guest has already arrived by querying the sheet
    checkArrivalStatus();
  }, [guestName]);

  const checkArrivalStatus = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/check-arrival?sheet=${sheet}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: guestName }),
      });

      if (!res.ok) {
        console.error("Failed to check arrival status");
        return;
      }

      const data = await res.json();
      if (data.arrived) {
        setButtonState("checked-in");
      }
    } catch (err) {
      console.error("checkArrivalStatus error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (buttonState !== "not-checked-in") return;
    setButtonState("checking-in");
    setError(null);

    try {
      const res = await fetch(`/api/mark-attendance?sheet=${sheet}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: guestName }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message =
          body?.error || res.statusText || "Failed to mark attendance";
        setError(message);
        setButtonState("not-checked-in");
        return;
      }

      // Check the updated arrival status from the sheet
      await checkArrivalStatus();
      setButtonState("checked-in");
    } catch (err) {
      console.error("handleCheckIn error:", err);
      setError("An error occurred. Please try again.");
      setButtonState("not-checked-in");
    }
  };

  if (error) {
    return (
      <div
        className="w-full px-6 py-4 text-center text-sm"
        style={{
          fontFamily: "Inter, sans-serif",
          backgroundColor: "#FEE",
          color: "#C33",
          borderRadius: "8px",
          border: "1px solid #FCC",
        }}
      >
        {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <button
        disabled
        className="w-full px-6 py-3"
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "15px",
          fontWeight: "400",
          color: colors.text.secondary,
          backgroundColor: "transparent",
          borderRadius: "6px",
          border: `1px solid ${colors.border}`,
          cursor: "not-allowed",
          opacity: 0.6,
        }}
      >
        Loading...
      </button>
    );
  }

  if (buttonState === "not-checked-in") {
    return (
      <button
        onClick={handleCheckIn}
        className="w-full px-6 py-3 transition-all"
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "15px",
          fontWeight: "400",
          color: colors.primary,
          backgroundColor: "transparent",
          borderRadius: "6px",
          border: `1px solid ${colors.border}`,
          cursor: "pointer",
          transitionDuration: "0.15s",
          transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        Mark as arrived
      </button>
    );
  }

  if (buttonState === "checking-in") {
    return (
      <button
        disabled
        className="w-full px-6 py-3"
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "15px",
          fontWeight: "400",
          color: colors.text.secondary,
          backgroundColor: "transparent",
          borderRadius: "6px",
          border: `1px solid ${colors.border}`,
          cursor: "not-allowed",
          opacity: 0.6,
        }}
      >
        Checking in...
      </button>
    );
  }

  return (
    <button
      disabled
      className="w-full px-6 py-3"
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "15px",
        fontWeight: "400",
        color: colors.accent,
        backgroundColor: `${colors.accent}10`,
        borderRadius: "6px",
        border: `1px solid ${colors.accent}`,
        cursor: "not-allowed",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        justifyContent: "center",
      }}
    >
      <span>✓</span>
      <span>Arrived</span>
    </button>
  );
}
