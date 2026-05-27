import { useEffect, useState } from "react";
import type { CountdownEvent, TimeRemaining } from "../lib/types";
import {
  GRADIENTS,
  getTimeRemaining,
  getPercentComplete,
  formatShareText,
} from "../lib/types";
import FlipDigit from "./FlipDigit";
import ProgressRing from "./ProgressRing";

interface DetailViewProps {
  event: CountdownEvent;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function DetailView({ event, onBack, onEdit, onDelete }: DetailViewProps) {
  const [tr, setTr] = useState<TimeRemaining>(() => getTimeRemaining(event.targetDate));
  const [percent, setPercent] = useState(() =>
    getPercentComplete(event.createdAt, event.targetDate),
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setTr(getTimeRemaining(event.targetDate));
      setPercent(getPercentComplete(event.createdAt, event.targetDate));
    }, 1000);
    return () => clearInterval(id);
  }, [event.targetDate, event.createdAt]);

  const gradient = GRADIENTS[event.gradient] ?? GRADIENTS["accent"];
  const targetDateStr = new Date(event.targetDate).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const targetTimeStr = new Date(event.targetDate).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const createdStr = new Date(event.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleShare = async () => {
    const text = formatShareText(event, tr);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: do nothing
    }
  };

  const handleConfirmDelete = () => {
    if (window.confirm(`Delete "${event.name}"?`)) {
      onDelete();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Gradient header */}
      <div
        className="shrink-0 px-4 pt-4 pb-8 sm:px-6 sm:pt-6 sm:pb-12"
        style={{ background: gradient }}
      >
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "#fff",
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "#fff",
              }}
            >
              {copied ? "Copied!" : "Share"}
            </button>
            <button
              onClick={onEdit}
              className="px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "#fff",
              }}
            >
              Edit
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "#fff",
              }}
            >
              Delete
            </button>
          </div>
        </div>

        <div className="text-center" style={{ color: "#fff" }}>
          <p className="text-4xl mb-2">{event.emoji}</p>
          <h2
            className="text-xl sm:text-2xl font-bold font-display"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            {event.name}
          </h2>
          <p className="text-sm opacity-80 mt-1">{targetDateStr} at {targetTimeStr}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 -mt-4">
        {/* Flip clock digits */}
        <div
          className="rounded-2xl p-6 sm:p-8 mb-6"
          style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
        >
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <FlipDigit value={tr.days} label="days" large />
            <span
              className="text-2xl sm:text-3xl font-bold mt-[-20px]"
              style={{ color: "var(--muted)" }}
            >
              :
            </span>
            <FlipDigit value={tr.hours} label="hours" large />
            <span
              className="text-2xl sm:text-3xl font-bold mt-[-20px]"
              style={{ color: "var(--muted)" }}
            >
              :
            </span>
            <FlipDigit value={tr.minutes} label="min" large />
            <span
              className="text-2xl sm:text-3xl font-bold mt-[-20px]"
              style={{ color: "var(--muted)" }}
            >
              :
            </span>
            <FlipDigit value={tr.seconds} label="sec" large />
          </div>
          {tr.isPast && (
            <p
              className="text-center text-sm font-semibold mt-4"
              style={{ color: "var(--warning)" }}
            >
              This event has passed
            </p>
          )}
        </div>

        {/* Progress + Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Progress ring */}
          <div
            className="rounded-2xl p-6 flex flex-col items-center justify-center"
            style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
          >
            <ProgressRing percent={percent} />
            <p
              className="text-xs font-semibold mt-3"
              style={{ color: "var(--muted)" }}
            >
              {tr.isPast ? "Complete" : "Progress"}
            </p>
          </div>

          {/* Stats */}
          <div
            className="rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
          >
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--muted)" }}>
                Created
              </p>
              <p className="text-sm font-bold mt-0.5" style={{ color: "var(--ink)" }}>
                {createdStr}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--muted)" }}>
                Total wait
              </p>
              <p className="text-sm font-bold mt-0.5" style={{ color: "var(--ink)" }}>
                {Math.ceil(
                  (new Date(event.targetDate).getTime() - new Date(event.createdAt).getTime()) /
                    (1000 * 60 * 60 * 24),
                )}{" "}
                days
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--muted)" }}>
                Time {tr.isPast ? "since" : "remaining"}
              </p>
              <p className="text-sm font-bold mt-0.5" style={{ color: "var(--ink)" }}>
                {tr.days}d {tr.hours}h {tr.minutes}m
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
