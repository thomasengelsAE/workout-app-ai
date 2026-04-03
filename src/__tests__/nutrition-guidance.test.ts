// Mock prisma to avoid DB connection requirement in unit tests
jest.mock('@/lib/prisma', () => ({
  prisma: {
    nutritionNudge: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    workoutSession: {
      findFirst: jest.fn(),
    },
  },
}));

import { getNudgeForSessionType, selectNudgeText } from '@/actions/nutrition';
import { NudgeType } from '@prisma/client';

describe('getNudgeForSessionType', () => {
  it('returns REST for null session type', () => {
    expect(getNudgeForSessionType(null)).toBe(NudgeType.REST);
  });

  it('returns ENDURANCE for running session', () => {
    expect(getNudgeForSessionType('Running — 5km')).toBe(NudgeType.ENDURANCE);
  });

  it('returns ENDURANCE for cycling session', () => {
    expect(getNudgeForSessionType('Cycling Intervals')).toBe(NudgeType.ENDURANCE);
  });

  it('returns ENDURANCE for swimming session', () => {
    expect(getNudgeForSessionType('Swimming')).toBe(NudgeType.ENDURANCE);
  });

  it('returns ENDURANCE for cardio session', () => {
    expect(getNudgeForSessionType('Low-intensity cardio')).toBe(NudgeType.ENDURANCE);
  });

  it('returns STRENGTH for strength session', () => {
    expect(getNudgeForSessionType('Upper Strength')).toBe(NudgeType.STRENGTH);
  });

  it('returns STRENGTH for power session', () => {
    expect(getNudgeForSessionType('Power Clean Day')).toBe(NudgeType.STRENGTH);
  });

  it('returns STRENGTH for hypertrophy session', () => {
    expect(getNudgeForSessionType('Hypertrophy — Chest & Triceps')).toBe(NudgeType.STRENGTH);
  });

  it('returns STRENGTH as default for generic gym session', () => {
    expect(getNudgeForSessionType('Workout A')).toBe(NudgeType.STRENGTH);
  });
});

describe('selectNudgeText', () => {
  it('returns a non-empty string for STRENGTH', () => {
    const text = selectNudgeText(NudgeType.STRENGTH);
    expect(typeof text).toBe('string');
    expect(text.length).toBeGreaterThan(0);
  });

  it('returns a non-empty string for ENDURANCE', () => {
    const text = selectNudgeText(NudgeType.ENDURANCE);
    expect(typeof text).toBe('string');
    expect(text.length).toBeGreaterThan(0);
  });

  it('returns a non-empty string for REST', () => {
    const text = selectNudgeText(NudgeType.REST);
    expect(typeof text).toBe('string');
    expect(text.length).toBeGreaterThan(0);
  });

  it('does not contain calorie counts', () => {
    for (const type of [NudgeType.STRENGTH, NudgeType.ENDURANCE, NudgeType.REST]) {
      const text = selectNudgeText(type);
      expect(text).not.toMatch(/\d+\s*kcal/i);
      expect(text).not.toMatch(/\d+\s*calories/i);
      expect(text).not.toMatch(/\d+g\s*(protein|carbs|fat)/i);
    }
  });
});
