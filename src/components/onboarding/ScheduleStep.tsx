'use client';

interface Props {
  weeklyDays: number;
  errors: Record<string, string>;
  onChange: (days: number) => void;
}

export function ScheduleStep({ weeklyDays, errors, onChange }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Your schedule</h2>
      <p className="text-zinc-400">How many days per week can you train?</p>

      <div className="grid grid-cols-7 gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => onChange(day)}
            className={`aspect-square rounded-xl border text-lg font-bold transition-colors ${
              weeklyDays === day
                ? 'border-indigo-500 bg-indigo-600 text-white'
                : 'border-zinc-700 bg-zinc-900 text-zinc-300 active:bg-zinc-800'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <p className="text-center text-zinc-400">
        {weeklyDays} day{weeklyDays !== 1 ? 's' : ''} per week selected
      </p>

      {errors.weeklyDays && <p className="text-sm text-red-400">{errors.weeklyDays}</p>}
    </div>
  );
}
