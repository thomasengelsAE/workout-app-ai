/**
 * Enforces the ±10% deviation rule for set logging.
 * Returns null if valid, or an error message if invalid.
 */
export function validateSetDeviation(
  actual: number,
  proposed: number,
  field: 'weight' | 'reps'
): string | null {
  const min = proposed * 0.9;
  const max = proposed * 1.1;

  if (actual < min) {
    return field === 'weight'
      ? `Minimum allowed weight is ${min.toFixed(1)} kg (90% of ${proposed} kg).`
      : `Minimum allowed reps is ${Math.ceil(min)} (90% of ${proposed}).`;
  }
  if (actual > max) {
    return field === 'weight'
      ? `Maximum allowed weight is ${max.toFixed(1)} kg (110% of ${proposed} kg).`
      : `Maximum allowed reps is ${Math.floor(max)} (110% of ${proposed}).`;
  }
  return null;
}

/**
 * Caps a rest extension to 30% of the original rest duration.
 * Returns the permitted extension in seconds.
 */
export function capRestExtension(requestedExtension: number, originalRest: number): number {
  const maxExtension = Math.floor(originalRest * 0.3);
  return Math.min(requestedExtension, maxExtension);
}
