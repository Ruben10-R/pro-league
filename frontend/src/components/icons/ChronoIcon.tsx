interface ChronoIconProps {
  width?: number;
  height?: number;
  className?: string;
}

export function ChronoIcon({
  width = 200,
  height = 200,
  className,
}: ChronoIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="200" height="200" fill="transparent" />

      <path
        d="M160 100C160 66.8629 133.137 40 100 40C66.8629 40 40 66.8629 40 100"
        stroke="#007bff"
        strokeWidth="12"
        strokeLinecap="round"
      />

      <path
        d="M100 160C133.137 160 160 133.137 160 100"
        stroke="#6610f2"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray="20 20"
      />

      <circle cx="100" cy="40" r="15" fill="#007bff" />
      <circle cx="100" cy="40" r="7" fill="#ffffff" />

      <line
        x1="100"
        y1="100"
        x2="140"
        y2="60"
        stroke="#a0a0a0"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 4"
      />
      <line
        x1="100"
        y1="100"
        x2="60"
        y2="60"
        stroke="#a0a0a0"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 4"
      />
    </svg>
  );
}
