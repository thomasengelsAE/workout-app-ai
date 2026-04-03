'use client';

import { AnalysisStatus } from '@prisma/client';

interface Props {
  status: AnalysisStatus;
  analysisText: string;
  laggingAreas: string[];
}

export function AnalysisResult({ status, analysisText, laggingAreas }: Props) {
  if (status === 'PENDING') {
    return (
      <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <p className="text-sm text-zinc-400">Analyzing your progress…</p>
        </div>
      </div>
    );
  }

  if (status === 'FAILED') {
    return (
      <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
        <p className="text-sm text-zinc-500">Analysis unavailable</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-indigo-700 bg-indigo-950 p-4">
      <p className="mb-2 text-sm font-semibold text-indigo-300">AI Progress Insight</p>
      <p className="text-sm text-zinc-300">{analysisText}</p>
      {laggingAreas.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {laggingAreas.map((area) => (
            <span
              key={area}
              className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-medium text-white"
            >
              Focus: {area}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
