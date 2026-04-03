import { Activity, ExperienceLevel, GymFocus, PhaseType, TrainingFocus } from '@prisma/client';

export interface WorkoutPlanSchema {
  weeks: WeekSchema[];
}

export interface WeekSchema {
  weekNumber: number;
  phase: PhaseType;
  sessions: SessionSchema[];
}

export interface SessionSchema {
  dayOfWeek: number; // 0=Mon … 6=Sun
  sessionType: string;
  exercises: ExerciseSchema[];
}

export interface ExerciseSchema {
  name: string;
  muscleGroup: string;
  description: string;
  orderIndex: number;
  sets: SetSchema[];
}

export interface SetSchema {
  setNumber: number;
  proposedReps: number;
  proposedWeight: number; // kg
  restSeconds: number;
}

export function buildSystemPrompt(): string {
  return `You are an expert strength and conditioning coach. 
Generate a 12-week periodized training program as valid JSON matching the provided schema exactly.
Rules:
- proposedWeight is in kilograms
- restSeconds is typically 60-180 for strength, 30-90 for endurance
- muscleGroup must be one of: chest, back, shoulders, biceps, triceps, legs, glutes, core, full_body, cardio
- Include exactly the number of sessions per week specified
- Substitute any exercise that stresses an injured area
- Respond with ONLY the JSON object — no prose, no markdown fences`;
}

export function buildUserPrompt({
  trainingFocus,
  hybridMode,
  experienceLevel,
  gymFocus,
  activities,
  weeklyDays,
  injuryDescriptions,
}: {
  trainingFocus: TrainingFocus;
  hybridMode: boolean;
  experienceLevel: ExperienceLevel;
  gymFocus: GymFocus;
  activities: Activity[];
  weeklyDays: number;
  injuryDescriptions: string[];
}): string {
  const injuryNote =
    injuryDescriptions.length > 0
      ? `User injuries (MUST be accommodated): ${injuryDescriptions.join('; ')}`
      : 'No injuries.';

  const hybridNote = hybridMode
    ? `This is a hybrid athlete program. Alternate between STRENGTH_DOMINANT phases (weeks 1-3, 7-9) and ENDURANCE_DOMINANT phases (weeks 4-6, 10-12). During endurance phases include at least 1 strength maintenance session per week. During strength phases include at least 1 aerobic conditioning session per week.`
    : `Use STANDARD phase throughout. Primary focus: ${trainingFocus}.`;

  return `Generate a 12-week training program with these parameters:
- Training Focus: ${trainingFocus}
- Experience Level: ${experienceLevel}
- Gym Focus: ${gymFocus}
- Activities: ${activities.join(', ')}
- Sessions per week: ${weeklyDays}
- ${injuryNote}
- ${hybridNote}

Return JSON with this exact structure:
{
  "weeks": [
    {
      "weekNumber": 1,
      "phase": "STANDARD",
      "sessions": [
        {
          "dayOfWeek": 0,
          "sessionType": "Upper Strength",
          "exercises": [
            {
              "name": "Barbell Bench Press",
              "muscleGroup": "chest",
              "description": "Keep shoulder blades retracted, lower bar to mid-chest, press to lockout.",
              "orderIndex": 1,
              "sets": [
                { "setNumber": 1, "proposedReps": 5, "proposedWeight": 80, "restSeconds": 180 }
              ]
            }
          ]
        }
      ]
    }
  ]
}`;
}

/**
 * Determines the alternating cycle schedule for hybrid programs.
 * Weeks 1-3, 7-9 → STRENGTH_DOMINANT; Weeks 4-6, 10-12 → ENDURANCE_DOMINANT
 */
export function getPhaseForWeek(weekNumber: number, hybridMode: boolean): PhaseType {
  if (!hybridMode) return PhaseType.STANDARD;
  const position = ((weekNumber - 1) % 6) + 1;
  return position <= 3 ? PhaseType.STRENGTH_DOMINANT : PhaseType.ENDURANCE_DOMINANT;
}
