import { useEffect, useRef, useState } from "react";

interface FlipDigitProps {
  value: number;
  label: string;
  large?: boolean;
}

export default function FlipDigit({ value, label, large }: FlipDigitProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [flipping, setFlipping] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      setFlipping(true);
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setFlipping(false);
      }, 150);
      prevValue.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  const padded = String(displayValue).padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`
          relative overflow-hidden rounded-xl font-display
          flex items-center justify-center
          ${large ? "w-20 h-24 sm:w-28 sm:h-32 text-4xl sm:text-5xl" : "w-14 h-16 sm:w-16 sm:h-20 text-2xl sm:text-3xl"}
          ${flipping ? "flip-tick" : ""}
        `}
        style={{
          background: "var(--panel)",
          border: "1px solid var(--line)",
          color: "var(--ink)",
          fontFamily: "'Fraunces', Georgia, serif",
          fontWeight: 800,
        }}
      >
        <span className="relative z-10">{padded}</span>
        <div
          className="absolute inset-x-0 top-1/2 h-px"
          style={{ background: "var(--line)" }}
        />
      </div>
      <span
        className={`uppercase tracking-wider font-semibold ${large ? "text-[10px] sm:text-xs" : "text-[9px] sm:text-[10px]"}`}
        style={{ color: "var(--muted)" }}
      >
        {label}
      </span>
    </div>
  );
}
