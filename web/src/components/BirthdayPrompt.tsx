import { useState } from "react";

interface BirthdayPromptProps {
  onSave: (date: string) => void;
  onCancel: () => void;
}

export default function BirthdayPrompt({ onSave, onCancel }: BirthdayPromptProps) {
  const [date, setDate] = useState("");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-3xl text-center mb-3">🎂</p>
        <h2
          className="text-lg font-bold text-center mb-2"
          style={{ color: "var(--ink)", fontFamily: "'Fraunces', Georgia, serif" }}
        >
          When is your birthday?
        </h2>
        <p className="text-xs text-center mb-4" style={{ color: "var(--muted)" }}>
          We'll create a countdown to your next birthday. This is stored only on your device.
        </p>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-xl px-4 py-3 text-sm font-medium outline-none mb-4"
          style={{
            background: "var(--panel)",
            border: "1px solid var(--line)",
            color: "var(--ink)",
          }}
        />
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer"
            style={{
              background: "var(--panel)",
              border: "1px solid var(--line)",
              color: "var(--ink)",
            }}
          >
            Skip
          </button>
          <button
            onClick={() => {
              if (date) onSave(date);
            }}
            disabled={!date}
            className="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer"
            style={{
              background: date ? "var(--accent)" : "var(--line)",
              border: "none",
              color: date ? "#fff" : "var(--muted)",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
