import { colors } from "@/app/lib/data/constants";

export default function FloralDivider() {
  return (
    <div className="flex justify-Center my-3" aria-hidden="true">
      <svg
        width="120"
        height="24"
        viewBox="0 0 120 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="60" cy="12" r="2.5" fill={colors.accent} opacity="0.3" />
        <path
          d="M20 12 Q35 10, 50 12"
          stroke={colors.primary}
          strokeWidth="1"
          opacity="0.25"
          fill="none"
        />
        <path
          d="M70 12 Q85 10, 100 12"
          stroke={colors.primary}
          strokeWidth="1"
          opacity="0.25"
          fill="none"
        />
        <path
          d="M35 11 Q32 8, 35 10"
          stroke={colors.primary}
          strokeWidth="0.8"
          opacity="0.2"
          fill="none"
        />
        <path
          d="M40 11 Q37 14, 40 12"
          stroke={colors.primary}
          strokeWidth="0.8"
          opacity="0.2"
          fill="none"
        />
        <path
          d="M85 11 Q88 8, 85 10"
          stroke={colors.primary}
          strokeWidth="0.8"
          opacity="0.2"
          fill="none"
        />
        <path
          d="M80 11 Q83 14, 80 12"
          stroke={colors.primary}
          strokeWidth="0.8"
          opacity="0.2"
          fill="none"
        />
        <circle cx="45" cy="12" r="1" fill={colors.accent} opacity="0.2" />
        <circle cx="75" cy="12" r="1" fill={colors.accent} opacity="0.2" />
      </svg>
    </div>
  );
}
