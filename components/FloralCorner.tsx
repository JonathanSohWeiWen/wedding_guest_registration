import { colors } from "@/app/lib/data/constants";

interface FloralCornerProps {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export default function FloralCorner({ position }: FloralCornerProps) {
  const positionStyles = {
    "top-left": "top-6 left-6",
    "top-right": "top-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "bottom-right": "bottom-6 right-6",
  };

  const rotation = {
    "top-left": "0",
    "top-right": "90",
    "bottom-left": "-90",
    "bottom-right": "180",
  };

  return (
    <div
      className={`absolute ${positionStyles[position]} hidden sm:block`}
      aria-hidden="true"
      style={{ transform: `rotate(${rotation[position]}deg)` }}
    >
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 5 Q20 10, 30 25 T45 50"
          stroke={colors.primary}
          strokeWidth="1.5"
          opacity="0.15"
        />
        <path
          d="M15 12 Q18 15, 20 18"
          stroke={colors.primary}
          strokeWidth="1"
          opacity="0.12"
          fill="none"
        />
        <path
          d="M25 20 Q28 23, 30 28"
          stroke={colors.primary}
          strokeWidth="1"
          opacity="0.12"
          fill="none"
        />
        <ellipse
          cx="22"
          cy="16"
          rx="3"
          ry="5"
          transform="rotate(25 22 16)"
          stroke={colors.primary}
          strokeWidth="0.8"
          opacity="0.15"
          fill="none"
        />
        <ellipse
          cx="32"
          cy="28"
          rx="4"
          ry="6"
          transform="rotate(35 32 28)"
          stroke={colors.primary}
          strokeWidth="0.8"
          opacity="0.15"
          fill="none"
        />
        <ellipse
          cx="42"
          cy="42"
          rx="3.5"
          ry="3.5"
          transform="rotate(45 42 42)"
          stroke={colors.primary}
          strokeWidth="0.8"
          opacity="0.15"
          fill="none"
        />
        <circle cx="38" cy="35" r="2" fill={colors.accent} opacity="0.2" />
        <circle cx="36" cy="36" r="1" fill={colors.accent} opacity="0.15" />
        <circle cx="40" cy="36" r="1" fill={colors.accent} opacity="0.15" />
      </svg>
    </div>
  );
}
