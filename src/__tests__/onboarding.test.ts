import { validateOnboarding } from '@/lib/validation';

describe('validateOnboarding', () => {
  const validData = {
    gender: 'MALE' as const,
    age: 28,
    heightCm: 178,
    weightKg: 82,
    experienceLevel: 'INTERMEDIATE' as const,
    gymFocus: 'BODYBUILDING' as const,
    activities: ['FITNESS' as const],
    weeklyDays: 4,
    injuries: [],
  };

  it('returns no errors for valid data', () => {
    expect(validateOnboarding(validData)).toEqual([]);
  });

  it('rejects age below 13', () => {
    const errors = validateOnboarding({ ...validData, age: 12 });
    expect(errors.some((e) => e.field === 'age')).toBe(true);
  });

  it('rejects age above 100', () => {
    const errors = validateOnboarding({ ...validData, age: 101 });
    expect(errors.some((e) => e.field === 'age')).toBe(true);
  });

  it('accepts age at boundary 13', () => {
    expect(validateOnboarding({ ...validData, age: 13 })).toEqual([]);
  });

  it('accepts age at boundary 100', () => {
    expect(validateOnboarding({ ...validData, age: 100 })).toEqual([]);
  });

  it('rejects zero height', () => {
    const errors = validateOnboarding({ ...validData, heightCm: 0 });
    expect(errors.some((e) => e.field === 'heightCm')).toBe(true);
  });

  it('rejects negative height', () => {
    const errors = validateOnboarding({ ...validData, heightCm: -5 });
    expect(errors.some((e) => e.field === 'heightCm')).toBe(true);
  });

  it('rejects zero weight', () => {
    const errors = validateOnboarding({ ...validData, weightKg: 0 });
    expect(errors.some((e) => e.field === 'weightKg')).toBe(true);
  });

  it('rejects empty activities', () => {
    const errors = validateOnboarding({ ...validData, activities: [] });
    expect(errors.some((e) => e.field === 'activities')).toBe(true);
  });

  it('requires experience level', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errors = validateOnboarding({ ...validData, experienceLevel: undefined as any });
    expect(errors.some((e) => e.field === 'experienceLevel')).toBe(true);
  });

  it('rejects weeklyDays of 0', () => {
    const errors = validateOnboarding({ ...validData, weeklyDays: 0 });
    expect(errors.some((e) => e.field === 'weeklyDays')).toBe(true);
  });

  it('rejects weeklyDays of 8', () => {
    const errors = validateOnboarding({ ...validData, weeklyDays: 8 });
    expect(errors.some((e) => e.field === 'weeklyDays')).toBe(true);
  });

  it('accepts weeklyDays at boundary 1', () => {
    expect(validateOnboarding({ ...validData, weeklyDays: 1 })).toEqual([]);
  });

  it('accepts weeklyDays at boundary 7', () => {
    expect(validateOnboarding({ ...validData, weeklyDays: 7 })).toEqual([]);
  });
});
