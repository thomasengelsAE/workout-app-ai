import { prisma } from '@/lib/prisma';
import { openai } from '@/lib/openai';
import {
  buildSystemPrompt,
  buildUserPrompt,
  type WorkoutPlanSchema,
} from '@/lib/workoutPrompts';

export async function generateWorkoutPlan(userId: string, goalId: string): Promise<void> {
  const [profile, goal, injuries] = await Promise.all([
    prisma.onboardingProfile.findUnique({ where: { userId } }),
    prisma.goal.findUnique({ where: { id: goalId } }),
    prisma.injury.findMany({ where: { userId } }),
  ]);

  if (!profile || !goal) throw new Error('Missing profile or goal for plan generation');

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.3,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: buildSystemPrompt() },
      {
        role: 'user',
        content: buildUserPrompt({
          trainingFocus: goal.trainingFocus,
          hybridMode: goal.hybridMode,
          experienceLevel: profile.experienceLevel,
          gymFocus: profile.gymFocus,
          activities: profile.activities,
          weeklyDays: profile.weeklyDays,
          injuryDescriptions: injuries.map((i) => i.description),
        }),
      },
    ],
  });

  const raw = completion.choices[0]?.message.content;
  if (!raw) throw new Error('Empty response from OpenAI');

  const plan: WorkoutPlanSchema = JSON.parse(raw);

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 84); // 12 weeks

  await prisma.$transaction(async (tx) => {
    const workoutPlan = await tx.workoutPlan.create({
      data: {
        name: `12-Week ${goal.trainingFocus} Program`,
        startDate,
        endDate,
        userId,
        goalId,
      },
    });

    for (const week of plan.weeks) {
      const workoutWeek = await tx.workoutWeek.create({
        data: {
          weekNumber: week.weekNumber,
          phase: week.phase,
          planId: workoutPlan.id,
        },
      });

      for (const session of week.sessions) {
        const workoutSession = await tx.workoutSession.create({
          data: {
            dayOfWeek: session.dayOfWeek,
            sessionType: session.sessionType,
            weekId: workoutWeek.id,
          },
        });

        for (const exercise of session.exercises) {
          const ex = await tx.exercise.create({
            data: {
              name: exercise.name,
              muscleGroup: exercise.muscleGroup,
              description: exercise.description,
              orderIndex: exercise.orderIndex,
              sessionId: workoutSession.id,
            },
          });

          await tx.prescribedSet.createMany({
            data: exercise.sets.map((set) => ({
              setNumber: set.setNumber,
              proposedReps: set.proposedReps,
              proposedWeight: set.proposedWeight,
              restSeconds: set.restSeconds,
              exerciseId: ex.id,
            })),
          });
        }
      }
    }
  });
}
