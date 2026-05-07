export default function Door() {
  return (
    <div className="flex items-center justify-center h-full">
      <svg
        width="200"
        height="50"
        viewBox="0 0 200 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="40"
          y="8"
          width="120"
          height="32"
          fill="none"
          stroke="#7c7c62"
          strokeWidth="2"
        />
        <line
          x1="100"
          y1="8"
          x2="100"
          y2="40"
          stroke="#7c7c62"
          strokeWidth="2"
        />
        <circle cx="97" cy="12" r="1.5" fill="#7c7c62" />
        <circle cx="103" cy="12" r="1.5" fill="#7c7c62" />
      </svg>
    </div>
  );
}
