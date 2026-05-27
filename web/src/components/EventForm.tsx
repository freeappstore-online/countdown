import { useState, useEffect } from "react";
import type { CountdownEvent } from "../lib/types";
import { GRADIENTS, GRADIENT_KEYS, EMOJI_OPTIONS } from "../lib/types";

interface EventFormProps {
  initial?: CountdownEvent;
  onSave: (data: {
    name: string;
    emoji: string;
    targetDate: string;
    gradient: string;
  }) => void;
  onCancel: () => void;
}

export default function EventForm({ initial, onSave, onCancel }: EventFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [emoji, setEmoji] = useState(initial?.emoji ?? "📅");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("00:00");
  const [gradient, setGradient] = useState(initial?.gradient ?? "ocean");

  useEffect(() => {
    if (initial) {
      const d = new Date(initial.targetDate);
      setDate(d.toISOString().split("T")[0] ?? "");
      setTime(
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
      );
    }
  }, [initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date) return;
    const targetDate = new Date(`${date}T${time}:00`).toISOString();
    onSave({ name: name.trim(), emoji, targetDate, gradient });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
        style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-lg font-bold"
            style={{ color: "var(--ink)", fontFamily: "'Fraunces', Georgia, serif" }}
          >
            {initial ? "Edit Countdown" : "New Countdown"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer"
            style={{ background: "var(--panel)", border: "none", color: "var(--ink)" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Event name */}
        <label className="block mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            Event Name
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Summer Vacation"
            maxLength={50}
            required
            className="mt-1 w-full rounded-xl px-4 py-3 text-sm font-medium outline-none"
            style={{
              background: "var(--panel)",
              border: "1px solid var(--line)",
              color: "var(--ink)",
            }}
          />
        </label>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Date
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="mt-1 w-full rounded-xl px-4 py-3 text-sm font-medium outline-none"
              style={{
                background: "var(--panel)",
                border: "1px solid var(--line)",
                color: "var(--ink)",
              }}
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Time
            </span>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 w-full rounded-xl px-4 py-3 text-sm font-medium outline-none"
              style={{
                background: "var(--panel)",
                border: "1px solid var(--line)",
                color: "var(--ink)",
              }}
            />
          </label>
        </div>

        {/* Emoji picker */}
        <div className="mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            Emoji
          </span>
          <div className="flex flex-wrap gap-2 mt-2">
            {EMOJI_OPTIONS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-lg cursor-pointer transition-transform"
                style={{
                  background: emoji === e ? "var(--accent)" : "var(--panel)",
                  border: emoji === e ? "2px solid var(--accent)" : "1px solid var(--line)",
                  transform: emoji === e ? "scale(1.1)" : "scale(1)",
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Gradient picker */}
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            Color
          </span>
          <div className="flex flex-wrap gap-2 mt-2">
            {GRADIENT_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setGradient(key)}
                className="w-10 h-10 rounded-xl cursor-pointer transition-transform"
                style={{
                  background: GRADIENTS[key],
                  border: gradient === key ? "3px solid var(--ink)" : "2px solid transparent",
                  transform: gradient === key ? "scale(1.1)" : "scale(1)",
                }}
                title={key}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer"
            style={{
              background: "var(--panel)",
              border: "1px solid var(--line)",
              color: "var(--ink)",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer"
            style={{
              background: "var(--accent)",
              border: "none",
              color: "#fff",
            }}
          >
            {initial ? "Save" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
