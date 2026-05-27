import { PRESETS } from "../lib/presets";

interface PresetPickerProps {
  onSelect: (presetIndex: number) => void;
}

export default function PresetPicker({ onSelect }: PresetPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {PRESETS.map((preset, i) => (
        <button
          key={preset.label}
          onClick={() => onSelect(i)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-transform hover:scale-105 active:scale-95"
          style={{
            background: "var(--panel)",
            border: "1px solid var(--line)",
            color: "var(--ink)",
          }}
        >
          <span>{preset.emoji}</span>
          <span>{preset.label}</span>
        </button>
      ))}
    </div>
  );
}
