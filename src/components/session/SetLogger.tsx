'use client';

import { useState } from 'react';
import { logSet } from '@/actions/session';

interface PrescribedSet {
  id: string;
  setNumber: number;
  proposedReps: number;
  proposedWeight: number;
  restSeconds: number;
  setLog: { actualWeight: number; actualReps: number } | null;
}

interface Props {
  prescribedSet: PrescribedSet;
  sessionId: string;
  onLogged: (restSeconds: number) => void;
}

export function SetLogger({ prescribedSet, sessionId, onLogged }: Props) {
  const [weight, setWeight] = useState(
    prescribedSet.setLog?.actualWeight.toString() ?? prescribedSet.proposedWeight.toString()
  );
  const [reps, setReps] = useState(
    prescribedSet.setLog?.actualReps.toString() ?? prescribedSet.proposedReps.toString()
  );
  const [errors, setErrors] = useState<{ field: string; message: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(!!prescribedSet.setLog);

  async function handleLog() {
    setSaving(true);
    setErrors([]);
    const result = await logSet(prescribedSet.id, sessionId, Number(weight), Number(reps));
    if (!result.success) {
      setErrors(result.errors);
      setSaving(false);
      return;
    }
    setSaved(true);
    setSaving(false);
    onLogged(prescribedSet.restSeconds);
  }

  const weightError = errors.find((e) => e.field === 'actualWeight')?.message;
  const repsError = errors.find((e) => e.field === 'actualReps')?.message;

  return (
    <div
      className={`rounded-xl border p-4 ${saved ? 'border-green-700 bg-green-950' : 'border-zinc-700 bg-zinc-900'}`}
    >
      <p className="mb-3 text-sm font-medium text-zinc-400">
        Set {prescribedSet.setNumber} — Proposed: {prescribedSet.proposedWeight}kg ×{' '}
        {prescribedSet.proposedReps} reps
      </p>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-xs text-zinc-400">Weight (kg)</label>
          <input
            type="number"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            disabled={saved}
            className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-white disabled:opacity-60"
          />
          {weightError && <p className="mt-1 text-xs text-red-400">{weightError}</p>}
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-xs text-zinc-400">Reps</label>
          <input
            type="number"
            inputMode="numeric"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            disabled={saved}
            className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-white disabled:opacity-60"
          />
          {repsError && <p className="mt-1 text-xs text-red-400">{repsError}</p>}
        </div>
      </div>

      {!saved && (
        <button
          type="button"
          onClick={handleLog}
          disabled={saving}
          className="mt-3 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Log Set'}
        </button>
      )}
      {saved && (
        <p className="mt-3 text-center text-sm font-semibold text-green-400">✓ Set logged</p>
      )}
    </div>
  );
}
