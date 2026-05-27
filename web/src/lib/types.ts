export interface CountdownEvent {
  id: string;
  name: string;
  emoji: string;
  targetDate: string; // ISO 8601
  createdAt: string; // ISO 8601
  gradient: string; // gradient key or "accent"
}

export interface TimeRemaining {
  total: number; // milliseconds (negative = past)
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const GRADIENTS: Record<string, string> = {
  sunset: "linear-gradient(135deg, #f97316, #ec4899)",
  ocean: "linear-gradient(135deg, #06b6d4, #3b82f6)",
  forest: "linear-gradient(135deg, #22c55e, #0d9488)",
  lavender: "linear-gradient(135deg, #a78bfa, #ec4899)",
  fire: "linear-gradient(135deg, #ef4444, #f97316)",
  midnight: "linear-gradient(135deg, #1e3a5f, #6366f1)",
  aurora: "linear-gradient(135deg, #34d399, #818cf8)",
  rose: "linear-gradient(135deg, #fb7185, #f472b6)",
  accent: "linear-gradient(135deg, var(--accent), var(--accent))",
};

export const GRADIENT_KEYS = Object.keys(GRADIENTS);

export const EMOJI_OPTIONS = [
  "🎉", "🎂", "🎄", "🎆", "✈️", "🏖️", "💍", "🎓",
  "🏆", "🚀", "❤️", "⭐", "🌸", "🎃", "🎵", "📅",
];

export function getTimeRemaining(targetDate: string): TimeRemaining {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const total = target - now;
  const absDiff = Math.abs(total);

  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

  return { total, days, hours, minutes, seconds, isPast: total < 0 };
}

export function getPercentComplete(createdAt: string, targetDate: string): number {
  const created = new Date(createdAt).getTime();
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const totalDuration = target - created;
  if (totalDuration <= 0) return 100;
  const elapsed = now - created;
  return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
}

export function formatCompactTime(tr: TimeRemaining): string {
  if (tr.isPast) {
    if (tr.days > 0) return `${tr.days}d ago`;
    if (tr.hours > 0) return `${tr.hours}h ago`;
    if (tr.minutes > 0) return `${tr.minutes}m ago`;
    return "just now";
  }
  if (tr.days > 0) return `${tr.days}d ${tr.hours}h`;
  if (tr.hours > 0) return `${tr.hours}h ${tr.minutes}m`;
  if (tr.minutes > 0) return `${tr.minutes}m ${tr.seconds}s`;
  return `${tr.seconds}s`;
}

export function formatShareText(event: CountdownEvent, tr: TimeRemaining): string {
  if (tr.isPast) {
    return `${tr.days} days since ${event.name}!`;
  }
  if (tr.days > 0) {
    return `${tr.days} days until ${event.name}!`;
  }
  if (tr.hours > 0) {
    return `${tr.hours} hours until ${event.name}!`;
  }
  return `${tr.minutes} minutes until ${event.name}!`;
}
