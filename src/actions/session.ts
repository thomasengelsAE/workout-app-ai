'use server';

import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/requireAuth';
import { validateSetDeviation, capRestExtension } from '@/lib/sessionConstraints';

export type LogSetResult =
  | { success: true; setLogId: string }
  | { success: false; errors: { field: string; message: string }[] };

export async function logSet(
  prescribedSetId: string,
  sessionId: string,
  actualWeight: number,
  actualReps: number,
  restExtensionSeconds: number = 0
): Promise<LogSetResult> {
  await requireAuth();

  const prescribed = await prisma.prescribedSet.findUnique({
    where: { id: prescribedSetId },
  });
  if (!prescribed) return { success: false, errors: [{ field: 'set', message: 'Set not found.' }] };

  const errors: { field: string; message: string }[] = [];

  const weightError = validateSetDeviation(actualWeight, prescribed.proposedWeight, 'weight');
  if (weightError) errors.push({ field: 'actualWeight', message: weightError });

  const repsError = validateSetDeviation(actualReps, prescribed.proposedReps, 'reps');
  if (repsError) errors.push({ field: 'actualReps', message: repsError });

  if (errors.length > 0) return { success: false, errors };

  const permittedExtension = capRestExtension(restExtensionSeconds, prescribed.restSeconds);

  const setLog = await prisma.setLog.upsert({
    where: { prescribedSetId },
    update: { actualWeight, actualReps, restExtensionSeconds: permittedExtension, loggedAt: new Date() },
    create: { prescribedSetId, sessionId, actualWeight, actualReps, restExtensionSeconds: permittedExtension },
  });

  return { success: true, setLogId: setLog.id };
}

export async function getSession(sessionId: string) {
  await requireAuth();
  return prisma.workoutSession.findUnique({
    where: { id: sessionId },
    include: {
      exercises: {
        orderBy: { orderIndex: 'asc' },
        include: {
          prescribedSets: {
            orderBy: { setNumber: 'asc' },
            include: { setLog: true },
          },
        },
      },
    },
  });
}

export async function completeSession(sessionId: string) {
  await requireAuth();
  return prisma.workoutSession.update({
    where: { id: sessionId },
    data: { completedAt: new Date() },
  });
}
