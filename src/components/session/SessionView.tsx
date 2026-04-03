'use client';

import { useState } from 'react';
import { ExerciseDemo } from '@/components/session/ExerciseDemo';
import { SetLogger } from '@/components/session/SetLogger';
import { RestTimer } from '@/components/session/RestTimer';
import { completeSession } from '@/actions/session';
import { useRouter } from 'next/navigation';
import { capRestExtension } from '@/lib/sessionConstraints';

interface PrescribedSet {
  id: string;
  setNumber: number;
  proposedReps: number;
  proposedWeight: number;
  restSeconds: number;
  setLog: { actualWeight: number; actualReps: number } | null;
}

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  description: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
  orderIndex: number;
  prescribedSets: PrescribedSet[];
}

interface Props {
  sessionId: string;
  sessionType: string;
  exercises: Exercise[];
}

export function SessionView({ sessionId, sessionType, exercises }: Props) {
  const router = useRouter();
  const [activeRest, setActiveRest] = useState<{ restSeconds: number; maxExtension: number } | null>(null);
  const [completing, setCompleting] = useState(false);

  function handleSetLogged(restSeconds: number) {
    setActiveRest({
      restSeconds,
      maxExtension: Math.floor(restSeconds * 0.3),
    });
  }

  async function handleComplete() {
    setCompleting(true);
    await completeSession(sessionId);
    router.push('/dashboard');
  }

  return (
    <main className="flex min-h-dvh flex-col px-4 pb-8 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{sessionType}</h1>
        <p className="text-sm text-zinc-400">{exercises.length} exercises</p>
      </div>

      {activeRest && (
        <div className="mb-6">
          <RestTimer
            restSeconds={activeRest.restSeconds}
            maxExtensionSeconds={activeRest.maxExtension}
            onComplete={() => setActiveRest(null)}
            onExtend={(extra) =>
              setActiveRest((prev) =>
                prev
                  ? { ...prev, restSeconds: prev.restSeconds + extra }
                  : null
              )
            }
          />
        </div>
      )}

      <div className="flex flex-col gap-8">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="flex flex-col gap-4">
            <ExerciseDemo
              name={exercise.name}
              muscleGroup={exercise.muscleGroup}
              description={exercise.description}
              mediaUrl={exercise.mediaUrl}
              mediaType={exercise.mediaType}
            />
            <div className="flex flex-col gap-3">
              {exercise.prescribedSets.map((set) => (
                <SetLogger
                  key={set.id}
                  prescribedSet={set}
                  sessionId={sessionId}
                  onLogged={handleSetLogged}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleComplete}
        disabled={completing}
        className="mt-8 w-full rounded-xl bg-green-600 py-4 font-semibold text-white active:bg-green-700 disabled:opacity-60"
      >
        {completing ? 'Finishing…' : 'Complete Workout'}
      </button>
    </main>
  );
}
