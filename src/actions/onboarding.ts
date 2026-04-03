'use server';

import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/requireAuth';
import { validateOnboarding, type OnboardingData } from '@/lib/validation';
import { Activity, ExperienceLevel, Gender, GymFocus } from '@prisma/client';
import { redirect } from 'next/navigation';

export type OnboardingActionResult =
  | { success: true }
  | { success: false; errors: { field: string; message: string }[] };

export async function saveOnboarding(data: OnboardingData): Promise<OnboardingActionResult> {
  const user = await requireAuth();

  const errors = validateOnboarding(data);
  if (errors.length > 0) return { success: false, errors };

  await prisma.$transaction(async (tx) => {
    // Upsert the onboarding profile
    await tx.onboardingProfile.upsert({
      where: { userId: user.id },
      update: {
        gender: data.gender,
        age: data.age,
        heightCm: data.heightCm,
        weightKg: data.weightKg,
        experienceLevel: data.experienceLevel,
        gymFocus: data.gymFocus,
        activities: data.activities,
        weeklyDays: data.weeklyDays,
      },
      create: {
        userId: user.id,
        gender: data.gender,
        age: data.age,
        heightCm: data.heightCm,
        weightKg: data.weightKg,
        experienceLevel: data.experienceLevel,
        gymFocus: data.gymFocus,
        activities: data.activities,
        weeklyDays: data.weeklyDays,
      },
    });

    // Replace injury records
    await tx.injury.deleteMany({ where: { userId: user.id } });
    if (data.injuries.length > 0) {
      await tx.injury.createMany({
        data: data.injuries
          .filter((d) => d.trim())
          .map((description) => ({ userId: user.id, description: description.trim() })),
      });
    }
  });

  return { success: true };
}

export async function getOnboardingProfile() {
  const user = await requireAuth();
  return prisma.onboardingProfile.findUnique({
    where: { userId: user.id },
    include: { user: { include: { injuries: true } } },
  });
}
