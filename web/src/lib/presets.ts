import type { CountdownEvent } from "./types";

function nextOccurrence(month: number, day: number): string {
  const now = new Date();
  const thisYear = new Date(now.getFullYear(), month - 1, day);
  if (thisYear.getTime() > now.getTime()) {
    return thisYear.toISOString();
  }
  return new Date(now.getFullYear() + 1, month - 1, day).toISOString();
}

export function getNewYearPreset(): Omit<CountdownEvent, "id" | "createdAt"> {
  const year = new Date().getFullYear() + 1;
  return {
    name: `New Year ${year}`,
    emoji: "🎆",
    targetDate: new Date(year, 0, 1).toISOString(),
    gradient: "midnight",
  };
}

export function getChristmasPreset(): Omit<CountdownEvent, "id" | "createdAt"> {
  return {
    name: "Christmas",
    emoji: "🎄",
    targetDate: nextOccurrence(12, 25),
    gradient: "forest",
  };
}

export function getBirthdayPreset(
  birthdayDate: string,
): Omit<CountdownEvent, "id" | "createdAt"> {
  const d = new Date(birthdayDate);
  return {
    name: "My Birthday",
    emoji: "🎂",
    targetDate: nextOccurrence(d.getMonth() + 1, d.getDate()),
    gradient: "lavender",
  };
}

export function getHalloweenPreset(): Omit<CountdownEvent, "id" | "createdAt"> {
  return {
    name: "Halloween",
    emoji: "🎃",
    targetDate: nextOccurrence(10, 31),
    gradient: "fire",
  };
}

export function getValentinesPreset(): Omit<CountdownEvent, "id" | "createdAt"> {
  return {
    name: "Valentine's Day",
    emoji: "❤️",
    targetDate: nextOccurrence(2, 14),
    gradient: "rose",
  };
}

export interface Preset {
  label: string;
  emoji: string;
  create: (birthday?: string) => Omit<CountdownEvent, "id" | "createdAt">;
  needsBirthday?: boolean;
}

export const PRESETS: Preset[] = [
  { label: "New Year", emoji: "🎆", create: getNewYearPreset },
  { label: "Christmas", emoji: "🎄", create: getChristmasPreset },
  {
    label: "My Birthday",
    emoji: "🎂",
    create: (birthday) => getBirthdayPreset(birthday ?? "2000-01-01"),
    needsBirthday: true,
  },
  { label: "Halloween", emoji: "🎃", create: getHalloweenPreset },
  { label: "Valentine's", emoji: "❤️", create: getValentinesPreset },
];
