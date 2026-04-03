'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  restSeconds: number;
  onComplete: () => void;
  onExtend: (extraSeconds: number) => void;
  maxExtensionSeconds: number;
}

export function RestTimer({ restSeconds, onComplete, onExtend, maxExtensionSeconds }: Props) {
  const [remaining, setRemaining] = useState(restSeconds);
  const [extended, setExtended] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setDone(true);
          playBeep();
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, []);

  function playBeep() {
    try {
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.5);
    } catch {}
  }

  function handleExtend() {
    if (extended) return;
    setExtended(true);
    setDone(false);
    setRemaining((prev) => prev + maxExtensionSeconds);
    onExtend(maxExtensionSeconds);

    clearInterval(intervalRef.current!);
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setDone(true);
          playBeep();
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div
      className={`flex flex-col items-center gap-4 rounded-2xl border p-6 ${
        done ? 'border-green-500 bg-green-950' : 'border-zinc-700 bg-zinc-900'
      }`}
    >
      <p className="text-sm font-medium text-zinc-400">Rest Timer</p>
      <p className={`text-5xl font-bold tabular-nums ${done ? 'text-green-400' : 'text-white'}`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </p>
      {done ? (
        <p className="font-semibold text-green-400">✓ Ready for next set!</p>
      ) : (
        <button
          type="button"
          onClick={handleExtend}
          disabled={extended}
          className="rounded-xl border border-zinc-600 px-4 py-2 text-sm text-zinc-400 disabled:opacity-40"
        >
          {extended ? `Extended (+${maxExtensionSeconds}s max)` : `+${maxExtensionSeconds}s extend`}
        </button>
      )}
    </div>
  );
}
