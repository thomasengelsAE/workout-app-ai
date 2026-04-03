'use client';

import { useState } from 'react';
import { TrainingFocus } from '@prisma/client';
import { FocusSelector } from '@/components/goals/FocusSelector';
import { HybridToggle } from '@/components/goals/HybridToggle';
import { saveGoal } from '@/actions/goals';
import { useRouter } from 'next/navigation';

export default function GoalsPage() {
  const router = useRouter();
  const [focus, setFocus] = useState<TrainingFocus | null>(null);
  const [hybrid, setHybrid] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!focus) {
      setError('Please select a training focus.');
      return;
    }
    setSubmitting(true);
    const result = await saveGoal(focus, hybrid);
    if (!result.success) {
      setError(result.error);
      setSubmitting(false);
      return;
    }
    router.push('/dashboard');
  }

  return (
    <main className="flex min-h-dvh flex-col px-6 pb-8 pt-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Goals</h1>
        <p className="mt-2 text-zinc-400">We'll build a 3-month program around these.</p>
      </div>

      <div className="flex flex-1 flex-col gap-6">
        <FocusSelector selected={focus} onSelect={setFocus} error={error} />
        <HybridToggle enabled={hybrid} onChange={setHybrid} />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="mt-6 w-full rounded-xl bg-indigo-600 py-4 font-semibold text-white active:bg-indigo-700 disabled:opacity-60"
      >
        {submitting ? 'Building your program…' : 'Generate My Program'}
      </button>
    </main>
  );
}
