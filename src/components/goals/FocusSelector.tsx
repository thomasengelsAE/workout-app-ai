'use client';

import { TrainingFocus } from '@prisma/client';

interface Props {
  selected: TrainingFocus | null;
  onSelect: (focus: TrainingFocus) => void;
  error?: string;
}

const FOCUS_OPTIONS: { value: TrainingFocus; label: string; description: string; icon: string }[] = [
  { value: 'STRENGTH', label: 'Strength', description: 'Build maximal strength', icon: '🏋️' },
  { value: 'POWER', label: 'Power', description: 'Explosive performance', icon: '⚡' },
  { value: 'ENDURANCE', label: 'Endurance', description: 'Aerobic capacity', icon: '🏃' },
  { value: 'WEIGHT_LOSS', label: 'Weight Loss', description: 'Fat loss & conditioning', icon: '🔥' },
  { value: 'WEIGHT_MAINTENANCE', label: 'Maintenance', description: 'Keep current level', icon: '⚖️' },
  { value: 'MASS_GAIN', label: 'Mass Gain', description: 'Hypertrophy & size', icon: '💪' },
];

export function FocusSelector({ selected, onSelect, error }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-zinc-300">Primary Training Focus</label>
      <div className="flex flex-col gap-2">
        {FOCUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={`flex items-center gap-3 rounded-xl border px-4 py-4 text-left transition-colors ${
              selected === opt.value
                ? 'border-indigo-500 bg-indigo-600 text-white'
                : 'border-zinc-700 bg-zinc-900 text-zinc-300 active:bg-zinc-800'
            }`}
          >
            <span className="text-2xl">{opt.icon}</span>
            <div>
              <p className="font-semibold">{opt.label}</p>
              <p className="text-sm opacity-70">{opt.description}</p>
            </div>
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
