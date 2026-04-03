'use client';

import { Activity } from '@prisma/client';

interface Props {
  selected: Activity[];
  errors: Record<string, string>;
  onChange: (activities: Activity[]) => void;
}

const GYM_ACTIVITIES: { value: Activity; label: string; icon: string }[] = [
  { value: 'FITNESS', label: 'Fitness', icon: '🏋️' },
  { value: 'CROSSFIT', label: 'CrossFit', icon: '⚡' },
  { value: 'HYROX', label: 'Hyrox', icon: '🔥' },
  { value: 'PILATES', label: 'Pilates', icon: '🧘' },
  { value: 'YOGA', label: 'Yoga', icon: '🌿' },
];

const CONDITIONING_ACTIVITIES: { value: Activity; label: string; icon: string }[] = [
  { value: 'RUNNING', label: 'Running', icon: '🏃' },
  { value: 'SWIMMING', label: 'Swimming', icon: '🏊' },
  { value: 'CYCLING', label: 'Cycling', icon: '🚴' },
];

function ActivityButton({
  activity,
  selected,
  onToggle,
}: {
  activity: { value: Activity; label: string; icon: string };
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
        selected
          ? 'border-indigo-500 bg-indigo-600 text-white'
          : 'border-zinc-700 bg-zinc-900 text-zinc-300 active:bg-zinc-800'
      }`}
    >
      <span>{activity.icon}</span>
      <span>{activity.label}</span>
    </button>
  );
}

export function ActivitiesStep({ selected, errors, onChange }: Props) {
  const toggle = (value: Activity) => {
    if (selected.includes(value)) {
      onChange(selected.filter((a) => a !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Your activities</h2>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-zinc-400">Gym-based</p>
        <div className="flex flex-wrap gap-2">
          {GYM_ACTIVITIES.map((a) => (
            <ActivityButton
              key={a.value}
              activity={a}
              selected={selected.includes(a.value)}
              onToggle={() => toggle(a.value)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-zinc-400">Conditioning</p>
        <div className="flex flex-wrap gap-2">
          {CONDITIONING_ACTIVITIES.map((a) => (
            <ActivityButton
              key={a.value}
              activity={a}
              selected={selected.includes(a.value)}
              onToggle={() => toggle(a.value)}
            />
          ))}
        </div>
      </div>

      {errors.activities && <p className="text-sm text-red-400">{errors.activities}</p>}
    </div>
  );
}
