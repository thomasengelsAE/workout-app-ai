'use client';

import { ExperienceLevel, GymFocus } from '@prisma/client';

interface Props {
  data: { experienceLevel: ExperienceLevel | ''; gymFocus: GymFocus | '' };
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

const experienceLevels: { value: ExperienceLevel; label: string; description: string }[] = [
  { value: 'BEGINNER', label: 'Beginner', description: '0–1 year training' },
  { value: 'INTERMEDIATE', label: 'Intermediate', description: '1–3 years' },
  { value: 'ADVANCED', label: 'Advanced', description: '3–5 years' },
  { value: 'ELITE', label: 'Elite', description: '5+ years' },
];

const gymFocusOptions: { value: GymFocus; label: string }[] = [
  { value: 'BODYBUILDING', label: 'Bodybuilding' },
  { value: 'POWERLIFTING', label: 'Powerlifting' },
  { value: 'CROSSFIT', label: 'CrossFit' },
  { value: 'GENERAL_FITNESS', label: 'General Fitness' },
  { value: 'SPORT_SPECIFIC', label: 'Sport-Specific' },
];

export function ExperienceStep({ data, errors, onChange }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Your experience</h2>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-300">Experience Level</label>
        <div className="flex flex-col gap-2">
          {experienceLevels.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange('experienceLevel', opt.value)}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                data.experienceLevel === opt.value
                  ? 'border-indigo-500 bg-indigo-600 text-white'
                  : 'border-zinc-700 bg-zinc-900 text-zinc-300 active:bg-zinc-800'
              }`}
            >
              <span className="font-medium">{opt.label}</span>
              <span className="text-sm opacity-70">{opt.description}</span>
            </button>
          ))}
        </div>
        {errors.experienceLevel && (
          <p className="text-sm text-red-400">{errors.experienceLevel}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-300">Primary Gym Focus</label>
        <div className="grid grid-cols-2 gap-2">
          {gymFocusOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange('gymFocus', opt.value)}
              className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                data.gymFocus === opt.value
                  ? 'border-indigo-500 bg-indigo-600 text-white'
                  : 'border-zinc-700 bg-zinc-900 text-zinc-300 active:bg-zinc-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
