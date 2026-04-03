import { getPhaseForWeek } from '@/lib/workoutPrompts';
import { PhaseType } from '@prisma/client';

describe('getPhaseForWeek', () => {
  describe('non-hybrid mode', () => {
    it('always returns STANDARD', () => {
      for (let week = 1; week <= 12; week++) {
        expect(getPhaseForWeek(week, false)).toBe(PhaseType.STANDARD);
      }
    });
  });

  describe('hybrid mode', () => {
    it('weeks 1-3 are STRENGTH_DOMINANT', () => {
      expect(getPhaseForWeek(1, true)).toBe(PhaseType.STRENGTH_DOMINANT);
      expect(getPhaseForWeek(2, true)).toBe(PhaseType.STRENGTH_DOMINANT);
      expect(getPhaseForWeek(3, true)).toBe(PhaseType.STRENGTH_DOMINANT);
    });

    it('weeks 4-6 are ENDURANCE_DOMINANT', () => {
      expect(getPhaseForWeek(4, true)).toBe(PhaseType.ENDURANCE_DOMINANT);
      expect(getPhaseForWeek(5, true)).toBe(PhaseType.ENDURANCE_DOMINANT);
      expect(getPhaseForWeek(6, true)).toBe(PhaseType.ENDURANCE_DOMINANT);
    });

    it('weeks 7-9 are STRENGTH_DOMINANT', () => {
      expect(getPhaseForWeek(7, true)).toBe(PhaseType.STRENGTH_DOMINANT);
      expect(getPhaseForWeek(8, true)).toBe(PhaseType.STRENGTH_DOMINANT);
      expect(getPhaseForWeek(9, true)).toBe(PhaseType.STRENGTH_DOMINANT);
    });

    it('weeks 10-12 are ENDURANCE_DOMINANT', () => {
      expect(getPhaseForWeek(10, true)).toBe(PhaseType.ENDURANCE_DOMINANT);
      expect(getPhaseForWeek(11, true)).toBe(PhaseType.ENDURANCE_DOMINANT);
      expect(getPhaseForWeek(12, true)).toBe(PhaseType.ENDURANCE_DOMINANT);
    });
  });
});
