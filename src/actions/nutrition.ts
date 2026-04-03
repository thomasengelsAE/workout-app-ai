'use server';

import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/requireAuth';
import { NudgeType } from '@prisma/client';

const NUDGES: Record<NudgeType, string[]> = {
  STRENGTH: [
    'Fuel up with complex carbs and protein 1–2 hours before your session for optimal strength output.',
    'A banana with peanut butter or oats with eggs make great pre-strength-session meals.',
    'Stay hydrated — aim for at least 500ml of water before you start lifting.',
  ],
  ENDURANCE: [
    'Have a light carb snack and drink 500ml of water before heading out — quick energy is key.',
    'On endurance days, fast-release carbs like fruit or energy gels help sustain your performance.',
    'Remember to sip water throughout your session and refuel with carbs and electrolytes after.',
  ],
  REST: [
    'Rest day — focus on protein-rich meals to support muscle repair and stay hydrated.',
    'Recovery is where growth happens. Prioritise sleep, protein, and light movement today.',
    'A rest day is still a nutrition day — aim for balanced meals to support tomorrow\'s training.',
  ],
};

export function getNudgeForSessionType(sessionType: string | null): NudgeType {
  if (!sessionType) return NudgeType.REST;
  const lower = sessionType.toLowerCase();
  if (lower.includes('run') || lower.includes('endur') || lower.includes('cycl') || lower.includes('swim') || lower.includes('cardio')) {
    return NudgeType.ENDURANCE;
  }
  if (lower.includes('strength') || lower.includes('power') || lower.includes('hypertrophy') || lower.includes('mass')) {
    return NudgeType.STRENGTH;
  }
  return NudgeType.STRENGTH; // default for gym sessions
}

export function selectNudgeText(nudgeType: NudgeType): string {
  const options = NUDGES[nudgeType];
  return options[Math.floor(Math.random() * options.length)];
}

export async function getTodaysNudge(userId: string): Promise<{
  nudgeType: NudgeType;
  nudgeText: string;
  isNew: boolean;
} | null> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if already displayed today
  const existing = await prisma.nutritionNudge.findUnique({
    where: { userId_displayedAt: { userId, displayedAt: today } },
  });
  if (existing) return { nudgeType: existing.nudgeType, nudgeText: existing.nudgeText, isNew: false };

  // Find today's scheduled workout session
  const todayDayOfWeek = (today.getDay() + 6) % 7; // convert Sun=0 to Mon=0
  const activeSession = await prisma.workoutSession.findFirst({
    where: {
      dayOfWeek: todayDayOfWeek,
      completedAt: null,
      week: { plan: { userId, endDate: { gte: today } } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const nudgeType = getNudgeForSessionType(activeSession?.sessionType ?? null);
  const nudgeText = selectNudgeText(nudgeType);

  await prisma.nutritionNudge.create({
    data: { userId, nudgeType, nudgeText, displayedAt: today },
  });

  return { nudgeType, nudgeText, isNew: true };
}
