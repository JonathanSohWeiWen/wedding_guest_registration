export default function Door() {
  return (
    <div className="flex items-center justify-center h-full">
      <svg
        width="100"
        height="50"
        viewBox="0 0 100 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="15"
          y="8"
          width="70"
          height="32"
          fill="none"
          stroke="#7c7c62"
          strokeWidth="2"
        />
        <line x1="50" y1="8" x2="50" y2="40" stroke="#7c7c62" strokeWidth="2" />
        <circle cx="47" cy="12" r="1.5" fill="#7c7c62" />
        <circle cx="53" cy="12" r="1.5" fill="#7c7c62" />
      </svg>
    </div>
  );
}
