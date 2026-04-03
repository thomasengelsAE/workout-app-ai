'use client';

import { NudgeType } from '@prisma/client';
import { useState } from 'react';

interface Props {
  nudgeType: NudgeType;
  nudgeText: string;
}

const NUDGE_ICONS: Record<NudgeType, string> = {
  STRENGTH: '💪',
  ENDURANCE: '🏃',
  REST: '🌙',
};

const NUDGE_LABELS: Record<NudgeType, string> = {
  STRENGTH: 'Strength Day Fuel',
  ENDURANCE: 'Endurance Day Fuel',
  REST: 'Recovery Day',
};

export function NutritionNudge({ nudgeType, nudgeText }: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="rounded-2xl border border-amber-700 bg-amber-950 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{NUDGE_ICONS[nudgeType]}</span>
          <p className="text-sm font-semibold text-amber-300">{NUDGE_LABELS[nudgeType]}</p>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-amber-600 hover:text-amber-400"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
      <p className="mt-2 text-sm text-zinc-300">{nudgeText}</p>
    </div>
  );
}
