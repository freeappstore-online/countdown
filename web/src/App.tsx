import { useState, useCallback, useMemo } from "react";
import type { CountdownEvent } from "./lib/types";
import { getTimeRemaining } from "./lib/types";
import {
  loadEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  getBirthday,
  setBirthday,
} from "./lib/storage";
import { PRESETS } from "./lib/presets";
import CountdownCard from "./components/CountdownCard";
import DetailView from "./components/DetailView";
import EventForm from "./components/EventForm";
import BirthdayPrompt from "./components/BirthdayPrompt";
import PresetPicker from "./components/PresetPicker";

type View =
  | { type: "home" }
  | { type: "detail"; id: string }
  | { type: "create" }
  | { type: "edit"; id: string };

export default function App() {
  const [events, setEvents] = useState<CountdownEvent[]>(loadEvents);
  const [view, setView] = useState<View>({ type: "home" });
  const [showBirthdayPrompt, setShowBirthdayPrompt] = useState(false);
  const [pendingPresetIndex, setPendingPresetIndex] = useState<number | null>(null);

  // Split into active and past
  const { active, past } = useMemo(() => {
    const now = Date.now();
    const a: CountdownEvent[] = [];
    const p: CountdownEvent[] = [];
    for (const e of events) {
      if (new Date(e.targetDate).getTime() > now) {
        a.push(e);
      } else {
        p.push(e);
      }
    }
    // Sort active by nearest first
    a.sort(
      (x, y) =>
        new Date(x.targetDate).getTime() - new Date(y.targetDate).getTime(),
    );
    // Sort past by most recent first
    p.sort(
      (x, y) =>
        new Date(y.targetDate).getTime() - new Date(x.targetDate).getTime(),
    );
    return { active: a, past: p };
  }, [events]);

  const handleCreate = useCallback(
    (data: { name: string; emoji: string; targetDate: string; gradient: string }) => {
      const event: CountdownEvent = {
        id: crypto.randomUUID(),
        name: data.name,
        emoji: data.emoji,
        targetDate: data.targetDate,
        gradient: data.gradient,
        createdAt: new Date().toISOString(),
      };
      setEvents(addEvent(event));
      setView({ type: "home" });
    },
    [],
  );

  const handleEdit = useCallback(
    (
      id: string,
      data: { name: string; emoji: string; targetDate: string; gradient: string },
    ) => {
      setEvents(updateEvent(id, data));
      setView({ type: "detail", id });
    },
    [],
  );

  const handleDelete = useCallback(
    (id: string) => {
      setEvents(deleteEvent(id));
      setView({ type: "home" });
    },
    [],
  );

  const handlePresetSelect = useCallback(
    (presetIndex: number) => {
      const preset = PRESETS[presetIndex];
      if (!preset) return;

      if (preset.needsBirthday) {
        const saved = getBirthday();
        if (!saved) {
          setPendingPresetIndex(presetIndex);
          setShowBirthdayPrompt(true);
          return;
        }
        const data = preset.create(saved);
        handleCreate({ ...data });
        return;
      }

      const data = preset.create();
      handleCreate({ ...data });
    },
    [handleCreate],
  );

  const handleBirthdaySave = useCallback(
    (date: string) => {
      setBirthday(date);
      setShowBirthdayPrompt(false);
      if (pendingPresetIndex !== null) {
        const preset = PRESETS[pendingPresetIndex];
        if (preset) {
          const data = preset.create(date);
          handleCreate({ ...data });
        }
        setPendingPresetIndex(null);
      }
    },
    [pendingPresetIndex, handleCreate],
  );

  const selectedEvent = useMemo(() => {
    if (view.type === "detail" || view.type === "edit") {
      return events.find((e) => e.id === view.id);
    }
    return undefined;
  }, [events, view]);

  // Detail view
  if (view.type === "detail" && selectedEvent) {
    return (
      <div className="h-screen flex flex-col" style={{ background: "var(--paper)" }}>
        <DetailView
          event={selectedEvent}
          onBack={() => setView({ type: "home" })}
          onEdit={() => setView({ type: "edit", id: selectedEvent.id })}
          onDelete={() => handleDelete(selectedEvent.id)}
        />
        <footer
          className="shrink-0 flex items-center justify-center px-4 py-2 text-xs"
          style={{ borderTop: "1px solid var(--line)", color: "var(--muted)" }}
        >
          Countdown — Free on FreeAppStore
        </footer>
      </div>
    );
  }

  // Edit form
  if (view.type === "edit" && selectedEvent) {
    return (
      <div className="h-screen" style={{ background: "var(--paper)" }}>
        <EventForm
          initial={selectedEvent}
          onSave={(data) => handleEdit(selectedEvent.id, data)}
          onCancel={() => setView({ type: "detail", id: selectedEvent.id })}
        />
      </div>
    );
  }

  // Home view
  return (
    <div className="h-screen flex flex-col" style={{ background: "var(--paper)" }}>
      {/* Header */}
      <header
        className="shrink-0 flex items-center justify-between px-4 py-3 sm:px-6"
        style={{ borderBottom: "1px solid var(--line)", background: "var(--glass)" }}
      >
        <h1
          className="text-lg font-bold font-display"
          style={{ color: "var(--ink)", fontFamily: "'Fraunces', Georgia, serif" }}
        >
          Countdown
        </h1>
        <button
          onClick={() => setView({ type: "create" })}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-transform hover:scale-105 active:scale-95"
          style={{ background: "var(--accent)", border: "none", color: "#fff" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        {/* Empty state */}
        {events.length === 0 && (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">&#9203;</p>
            <h2
              className="text-xl font-bold mb-2"
              style={{ color: "var(--ink)", fontFamily: "'Fraunces', Georgia, serif" }}
            >
              No countdowns yet
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
              Create your first countdown or pick a preset below.
            </p>
            <PresetPicker onSelect={handlePresetSelect} />
          </div>
        )}

        {/* Active countdowns */}
        {active.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: "var(--muted)" }}
              >
                Upcoming ({active.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {active.map((event) => {
                const tr = getTimeRemaining(event.targetDate);
                const isUrgent = !tr.isPast && tr.total < 24 * 60 * 60 * 1000;
                return (
                  <div
                    key={event.id}
                    className={isUrgent ? "urgent-glow rounded-2xl" : ""}
                  >
                    <CountdownCard
                      event={event}
                      onClick={() => setView({ type: "detail", id: event.id })}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick presets (show when there are events) */}
        {events.length > 0 && (
          <div className="mb-8">
            <h2
              className="text-sm font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--muted)" }}
            >
              Quick Add
            </h2>
            <PresetPicker onSelect={handlePresetSelect} />
          </div>
        )}

        {/* Past countdowns */}
        {past.length > 0 && (
          <div>
            <h2
              className="text-sm font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--muted)" }}
            >
              Past ({past.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 opacity-60">
              {past.map((event) => (
                <CountdownCard
                  key={event.id}
                  event={event}
                  onClick={() => setView({ type: "detail", id: event.id })}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className="shrink-0 flex items-center justify-center px-4 py-2 text-xs"
        style={{ borderTop: "1px solid var(--line)", color: "var(--muted)" }}
      >
        Countdown — Free on FreeAppStore
      </footer>

      {/* Create form modal */}
      {view.type === "create" && (
        <EventForm
          onSave={handleCreate}
          onCancel={() => setView({ type: "home" })}
        />
      )}

      {/* Birthday prompt */}
      {showBirthdayPrompt && (
        <BirthdayPrompt
          onSave={handleBirthdaySave}
          onCancel={() => {
            setShowBirthdayPrompt(false);
            setPendingPresetIndex(null);
          }}
        />
      )}
    </div>
  );
}
