import type { CountdownEvent } from "./types";

const STORAGE_KEY = "countdown-events";
const BIRTHDAY_KEY = "countdown-birthday";

export function loadEvents(): CountdownEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CountdownEvent[];
  } catch {
    return [];
  }
}

export function saveEvents(events: CountdownEvent[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function addEvent(event: CountdownEvent): CountdownEvent[] {
  const events = loadEvents();
  events.push(event);
  saveEvents(events);
  return events;
}

export function updateEvent(id: string, updates: Partial<CountdownEvent>): CountdownEvent[] {
  const events = loadEvents();
  const idx = events.findIndex((e) => e.id === id);
  if (idx !== -1) {
    const existing = events[idx];
    if (existing) {
      events[idx] = { ...existing, ...updates };
    }
  }
  saveEvents(events);
  return events;
}

export function deleteEvent(id: string): CountdownEvent[] {
  const events = loadEvents().filter((e) => e.id !== id);
  saveEvents(events);
  return events;
}

export function getBirthday(): string | null {
  return localStorage.getItem(BIRTHDAY_KEY);
}

export function setBirthday(date: string): void {
  localStorage.setItem(BIRTHDAY_KEY, date);
}
