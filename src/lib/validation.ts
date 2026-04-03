import { Activity, ExperienceLevel, Gender, GymFocus } from '@prisma/client';

export interface OnboardingData {
  gender: Gender;
  age: number;
  heightCm: number;
  weightKg: number;
  experienceLevel: ExperienceLevel;
  gymFocus: GymFocus;
  activities: Activity[];
  weeklyDays: number;
  injuries: string[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateOnboarding(data: Partial<OnboardingData>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (data.age !== undefined) {
    if (!Number.isInteger(data.age) || data.age < 13 || data.age > 100) {
      errors.push({ field: 'age', message: 'Age must be between 13 and 100.' });
    }
  }

  if (data.heightCm !== undefined) {
    if (data.heightCm <= 0) {
      errors.push({ field: 'heightCm', message: 'Height must be greater than zero.' });
    }
  }

  if (data.weightKg !== undefined) {
    if (data.weightKg <= 0) {
      errors.push({ field: 'weightKg', message: 'Weight must be greater than zero.' });
    }
  }

  if (data.activities !== undefined) {
    if (data.activities.length === 0) {
      errors.push({ field: 'activities', message: 'Select at least one activity.' });
    }
  }

  if (data.experienceLevel === undefined || data.experienceLevel === null) {
    errors.push({ field: 'experienceLevel', message: 'Experience level is required.' });
  }

  if (data.weeklyDays !== undefined) {
    if (!Number.isInteger(data.weeklyDays) || data.weeklyDays < 1 || data.weeklyDays > 7) {
      errors.push({ field: 'weeklyDays', message: 'Weekly days must be between 1 and 7.' });
    }
  }

  return errors;
}
