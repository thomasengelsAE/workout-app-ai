'use server';

import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/requireAuth';
import { TrainingFocus } from '@prisma/client';
import { generateWorkoutPlan } from '@/lib/workoutGenerator';

export type GoalActionResult =
  | { success: true }
  | { success: false; error: string };

export async function saveGoal(
  trainingFocus: TrainingFocus,
  hybridMode: boolean
): Promise<GoalActionResult> {
  if (!trainingFocus) return { success: false, error: 'Training focus is required.' };

  const user = await requireAuth();

  const goal = await prisma.goal.upsert({
    where: { userId: user.id },
    update: { trainingFocus, hybridMode },
    create: { userId: user.id, trainingFocus, hybridMode },
  });

  // Trigger plan generation (async - fire and forget, handled separately)
  generateWorkoutPlan(user.id, goal.id).catch(console.error);

  return { success: true };
}

export async function getGoal() {
  const user = await requireAuth();
  return prisma.goal.findUnique({ where: { userId: user.id } });
}
