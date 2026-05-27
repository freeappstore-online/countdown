import { useEffect, useState } from "react";
import type { CountdownEvent, TimeRemaining } from "../lib/types";
import { GRADIENTS, getTimeRemaining, formatCompactTime } from "../lib/types";

interface CountdownCardProps {
  event: CountdownEvent;
  onClick: () => void;
}

export default function CountdownCard({ event, onClick }: CountdownCardProps) {
  const [tr, setTr] = useState<TimeRemaining>(() => getTimeRemaining(event.targetDate));

  useEffect(() => {
    const id = setInterval(() => {
      setTr(getTimeRemaining(event.targetDate));
    }, 1000);
    return () => clearInterval(id);
  }, [event.targetDate]);

  const gradient = GRADIENTS[event.gradient] ?? GRADIENTS["accent"];
  const isUrgent = !tr.isPast && tr.total < 24 * 60 * 60 * 1000;
  const targetDateStr = new Date(event.targetDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left rounded-2xl p-4 sm:p-5 cursor-pointer
        transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]
        ${isUrgent ? "ring-2 ring-offset-2 urgent-pulse" : ""}
      `}
      style={{
        background: gradient,
        border: "none",
        color: "#fff",
        ...(isUrgent
          ? { ringColor: "var(--warning)", ringOffsetColor: "var(--paper)" }
          : {}),
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{event.emoji}</span>
            <h3 className="text-base sm:text-lg font-bold truncate" style={{ color: "#fff" }}>
              {event.name}
            </h3>
          </div>
          <p className="text-xs opacity-80">{targetDateStr}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl sm:text-3xl font-display font-bold leading-none">
            {formatCompactTime(tr)}
          </p>
          {tr.isPast ? (
            <p className="text-xs opacity-70 mt-1">passed</p>
          ) : isUrgent ? (
            <p className="text-xs font-semibold mt-1 opacity-90">soon!</p>
          ) : null}
        </div>
      </div>

      {/* Compact digit row */}
      {!tr.isPast && (
        <div className="flex gap-3 mt-3 text-xs opacity-90">
          <span>{tr.days}d</span>
          <span>{tr.hours}h</span>
          <span>{tr.minutes}m</span>
          <span>{tr.seconds}s</span>
        </div>
      )}
    </button>
  );
}
