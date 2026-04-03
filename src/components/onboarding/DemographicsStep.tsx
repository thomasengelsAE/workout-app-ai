'use client';

import { Gender } from '@prisma/client';

interface Props {
  data: { gender: Gender | ''; age: string; heightCm: string; weightKg: string };
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

const genderOptions: { value: Gender; label: string }[] = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'NON_BINARY', label: 'Non-binary' },
  { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
];

export function DemographicsStep({ data, errors, onChange }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">About you</h2>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-300">Gender</label>
        <div className="grid grid-cols-2 gap-2">
          {genderOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange('gender', opt.value)}
              className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                data.gender === opt.value
                  ? 'border-indigo-500 bg-indigo-600 text-white'
                  : 'border-zinc-700 bg-zinc-900 text-zinc-300 active:bg-zinc-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {(['age', 'heightCm', 'weightKg'] as const).map((field) => (
        <div key={field} className="flex flex-col gap-2">
          <label htmlFor={field} className="text-sm font-medium text-zinc-300">
            {field === 'age' ? 'Age' : field === 'heightCm' ? 'Height (cm)' : 'Weight (kg)'}
          </label>
          <input
            id={field}
            type="number"
            inputMode="decimal"
            value={data[field]}
            onChange={(e) => onChange(field, e.target.value)}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
            placeholder={field === 'age' ? 'e.g. 28' : field === 'heightCm' ? 'e.g. 178' : 'e.g. 82'}
          />
          {errors[field] && <p className="text-sm text-red-400">{errors[field]}</p>}
        </div>
      ))}
    </div>
  );
}
