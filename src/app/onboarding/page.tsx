'use client';

import { useState } from 'react';
import { Activity, ExperienceLevel, Gender, GymFocus } from '@prisma/client';
import { DemographicsStep } from '@/components/onboarding/DemographicsStep';
import { ExperienceStep } from '@/components/onboarding/ExperienceStep';
import { ActivitiesStep } from '@/components/onboarding/ActivitiesStep';
import { ScheduleStep } from '@/components/onboarding/ScheduleStep';
import { InjuriesStep } from '@/components/onboarding/InjuriesStep';
import { saveOnboarding } from '@/actions/onboarding';
import { useRouter } from 'next/navigation';

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const [gender, setGender] = useState<Gender | ''>('');
  const [age, setAge] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | ''>('');
  const [gymFocus, setGymFocus] = useState<GymFocus | ''>('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [weeklyDays, setWeeklyDays] = useState(3);
  const [injuries, setInjuries] = useState<string[]>([]);

  const demographicsData = { gender, age, heightCm, weightKg };

  const handleDemographicsChange = (field: string, value: string) => {
    if (field === 'gender') setGender(value as Gender);
    else if (field === 'age') setAge(value);
    else if (field === 'heightCm') setHeightCm(value);
    else if (field === 'weightKg') setWeightKg(value);
  };

  const experienceData = { experienceLevel, gymFocus };
  const handleExperienceChange = (field: string, value: string) => {
    if (field === 'experienceLevel') setExperienceLevel(value as ExperienceLevel);
    else if (field === 'gymFocus') setGymFocus(value as GymFocus);
  };

  async function handleSubmit() {
    setSubmitting(true);
    setErrors({});

    const result = await saveOnboarding({
      gender: gender as Gender,
      age: Number(age),
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      experienceLevel: experienceLevel as ExperienceLevel,
      gymFocus: gymFocus as GymFocus,
      activities,
      weeklyDays,
      injuries,
    });

    if (!result.success) {
      const errMap: Record<string, string> = {};
      result.errors.forEach((e) => (errMap[e.field] = e.message));
      setErrors(errMap);
      // Navigate back to the first step with an error
      setStep(1);
      setSubmitting(false);
      return;
    }

    router.push('/goals');
  }

  return (
    <main className="flex min-h-dvh flex-col px-6 pb-8 pt-12">
      {/* Progress bar */}
      <div className="mb-8 flex gap-1">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < step ? 'bg-indigo-500' : 'bg-zinc-800'
            }`}
          />
        ))}
      </div>

      <div className="flex-1">
        {step === 1 && (
          <DemographicsStep
            data={demographicsData}
            errors={errors}
            onChange={handleDemographicsChange}
          />
        )}
        {step === 2 && (
          <ExperienceStep
            data={experienceData}
            errors={errors}
            onChange={handleExperienceChange}
          />
        )}
        {step === 3 && (
          <ActivitiesStep selected={activities} errors={errors} onChange={setActivities} />
        )}
        {step === 4 && (
          <ScheduleStep weeklyDays={weeklyDays} errors={errors} onChange={setWeeklyDays} />
        )}
        {step === 5 && <InjuriesStep injuries={injuries} onChange={setInjuries} />}
      </div>

      <div className="flex gap-3 pt-6">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="flex-1 rounded-xl border border-zinc-700 py-4 font-semibold text-zinc-300 active:bg-zinc-900"
          >
            Back
          </button>
        )}
        {step < TOTAL_STEPS ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="flex-1 rounded-xl bg-indigo-600 py-4 font-semibold text-white active:bg-indigo-700"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 rounded-xl bg-indigo-600 py-4 font-semibold text-white active:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? 'Saving…' : 'Complete Setup'}
          </button>
        )}
      </div>
    </main>
  );
}
