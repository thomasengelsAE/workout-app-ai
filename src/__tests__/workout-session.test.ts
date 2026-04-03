import { validateSetDeviation, capRestExtension } from '@/lib/sessionConstraints';

describe('validateSetDeviation', () => {
  describe('weight', () => {
    it('accepts exact proposed weight', () => {
      expect(validateSetDeviation(80, 80, 'weight')).toBeNull();
    });

    it('accepts exactly 10% above', () => {
      expect(validateSetDeviation(88, 80, 'weight')).toBeNull();
    });

    it('accepts exactly 10% below', () => {
      expect(validateSetDeviation(72, 80, 'weight')).toBeNull();
    });

    it('rejects just over 10% above', () => {
      expect(validateSetDeviation(88.1, 80, 'weight')).not.toBeNull();
    });

    it('rejects just under 10% below', () => {
      expect(validateSetDeviation(71.9, 80, 'weight')).not.toBeNull();
    });

    it('returns an error message containing min weight on too low', () => {
      const error = validateSetDeviation(60, 80, 'weight');
      expect(error).toContain('72.0');
    });
  });

  describe('reps', () => {
    it('accepts exact proposed reps', () => {
      expect(validateSetDeviation(10, 10, 'reps')).toBeNull();
    });

    it('accepts exactly 10% above', () => {
      expect(validateSetDeviation(11, 10, 'reps')).toBeNull();
    });

    it('accepts exactly 10% below', () => {
      expect(validateSetDeviation(9, 10, 'reps')).toBeNull();
    });

    it('rejects above 10% upper bound', () => {
      expect(validateSetDeviation(12, 10, 'reps')).not.toBeNull();
    });

    it('rejects below 10% lower bound', () => {
      expect(validateSetDeviation(8, 10, 'reps')).not.toBeNull();
    });
  });
});

describe('capRestExtension', () => {
  it('allows extension within 30%', () => {
    expect(capRestExtension(30, 100)).toBe(30);
  });

  it('caps extension at exactly 30%', () => {
    expect(capRestExtension(30, 100)).toBe(30);
  });

  it('caps extension above 30%', () => {
    expect(capRestExtension(60, 100)).toBe(30);
  });

  it('floors the max extension', () => {
    // 30% of 70 = 21
    expect(capRestExtension(50, 70)).toBe(21);
  });

  it('returns 0 when 0 extension requested', () => {
    expect(capRestExtension(0, 180)).toBe(0);
  });

  it('handles a typical rest of 180s — max extension is 54s', () => {
    expect(capRestExtension(100, 180)).toBe(54);
  });
});
