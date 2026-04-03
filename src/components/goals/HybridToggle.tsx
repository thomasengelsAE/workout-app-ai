'use client';

interface Props {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function HybridToggle({ enabled, onChange }: Props) {
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">Hybrid Athlete Mode</p>
          <p className="mt-1 text-sm text-zinc-400">
            Alternates strength and endurance cycles — maintains both qualities throughout the program.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onChange(!enabled)}
          className={`relative ml-4 h-7 w-12 flex-shrink-0 rounded-full transition-colors ${
            enabled ? 'bg-indigo-600' : 'bg-zinc-700'
          }`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
              enabled ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
