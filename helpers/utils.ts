export function areObjectsDifferent(obj1: Record<string, any>, obj2: Record<string, any>): boolean {
  const keys = Object.keys(obj1);

  for (const key of keys) {
    if (obj1[key] !== obj2[key]) {
      return true; // au moins une différence
    }
  }

  return false; // tout est identique
}