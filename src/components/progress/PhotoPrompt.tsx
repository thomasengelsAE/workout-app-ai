'use client';

import { useState, useRef } from 'react';
import { PhotoView } from '@prisma/client';
import { uploadProgressPhoto } from '@/actions/progress';

const VIEWS: { view: PhotoView; label: string; icon: string }[] = [
  { view: 'FRONT', label: 'Front', icon: '⬆️' },
  { view: 'SIDE', label: 'Side', icon: '➡️' },
  { view: 'REAR', label: 'Rear', icon: '⬇️' },
];

interface Props {
  onDismiss: () => void;
}

export function PhotoPrompt({ onDismiss }: Props) {
  const [captured, setCaptured] = useState<Record<PhotoView, string | null>>({
    FRONT: null,
    SIDE: null,
    REAR: null,
  });
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const fileInputs = useRef<Record<PhotoView, HTMLInputElement | null>>({
    FRONT: null,
    SIDE: null,
    REAR: null,
  });

  function handleCapture(view: PhotoView, file: File) {
    const reader = new FileReader();
    reader.onload = () => setCaptured((prev) => ({ ...prev, [view]: reader.result as string }));
    reader.readAsDataURL(file);
  }

  async function handleUpload() {
    setUploading(true);
    for (const { view } of VIEWS) {
      const data = captured[view];
      if (!data) continue;
      await uploadProgressPhoto(view, data, 'image/jpeg');
    }
    setUploading(false);
    setDone(true);
    setTimeout(onDismiss, 1500);
  }

  const anyCaptures = Object.values(captured).some(Boolean);

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-green-700 bg-green-950 p-6 text-center">
        <p className="text-2xl">✅</p>
        <p className="font-semibold text-green-400">Photos uploaded! Analyzing your progress…</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Morning Check-in</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Take your daily progress photos — front, side, and rear.
        </p>
      </div>

      <div className="flex gap-3">
        {VIEWS.map(({ view, label, icon }) => (
          <div key={view} className="flex flex-1 flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputs.current[view]?.click()}
              className={`flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-xl border text-sm transition-colors ${
                captured[view]
                  ? 'border-green-500 bg-green-950'
                  : 'border-zinc-600 bg-zinc-800 active:bg-zinc-700'
              }`}
            >
              {captured[view] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={captured[view]!}
                  alt={label}
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <>
                  <span className="text-2xl">{icon}</span>
                  <span className="text-xs text-zinc-400">{label}</span>
                </>
              )}
            </button>
            <input
              ref={(el) => { fileInputs.current[view] = el; }}
              type="file"
              accept="image/*"
              capture="user"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleCapture(view, file);
              }}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onDismiss}
          className="flex-1 rounded-xl border border-zinc-600 py-3 text-zinc-400"
        >
          Skip today
        </button>
        {anyCaptures && (
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="flex-1 rounded-xl bg-indigo-600 py-3 font-semibold text-white disabled:opacity-60"
          >
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
        )}
      </div>
    </div>
  );
}
