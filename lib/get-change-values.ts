export function getChangedValues<T extends Record<string, any>>(
  original: T,
  updated: T
): Partial<T> {
  const changes: Partial<T> = {};

  for (const key in updated) {
    if (updated.hasOwnProperty(key) && original[key] !== updated[key]) {
      changes[key] = updated[key];
    }
  }

  return changes;
}
