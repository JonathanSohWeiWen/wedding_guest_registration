import { colors } from "@/app/lib/data/constants";

export default function FloralBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      aria-hidden="true"
      style={{ zIndex: 0 }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="floral-pattern"
            x="0"
            y="0"
            width="200"
            height="200"
            patternUnits="useSpaceOnUse"
          >
            <g opacity="0.08">
              <path
                d="M40 50 Q45 48, 50 50"
                stroke={colors.primary}
                strokeWidth="0.8"
                fill="none"
              />
              <ellipse
                cx="42"
                cy="48"
                rx="2"
                ry="3"
                transform="rotate(30,42, 48)"
                stroke={colors.primary}
                strokeWidth="0.5"
                fill="none"
              />
              <ellipse
                cx="48"
                cy="48"
                rx="2"
                ry="3"
                transform="rotate(-30,48, 48)"
                stroke={colors.primary}
                strokeWidth="0.5"
                fill="none"
              />
            </g>
            <g opacity="0.08">
              <path
                d="M140 120 Q145 118, 150 120"
                stroke={colors.primary}
                strokeWidth="0.8"
                fill="none"
              />
              <ellipse
                cx="142"
                cy="118"
                rx="1.5"
                ry="2.5"
                transform="rotate(45,142, 118)"
                stroke={colors.primary}
                strokeWidth="0.5"
                fill="none"
              />
              <ellipse
                cx="148"
                cy="118"
                rx="1.5"
                ry="2.5"
                transform="rotate(-45,148, 118)"
                stroke={colors.primary}
                strokeWidth="0.5"
                fill="none"
              />
            </g>
            <circle
              cx="100"
              cy="100"
              r="1"
              fill={colors.accent}
              opacity="0.05"
            />
            <g opacity="0.05">
              <path
                d="M160 60 L165 70"
                stroke={colors.primary}
                strokeWidth="0.6"
                fill="none"
              />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#floral-pattern)" />
      </svg>
    </div>
  );
}
