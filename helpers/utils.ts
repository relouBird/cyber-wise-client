export function areObjectsDifferent(
  obj1: Record<string, any>,
  obj2: Record<string, any>
): boolean {
  const keys = Object.keys(obj1);

  for (const key of keys) {
    if (obj1[key] !== obj2[key]) {
      return true; // au moins une différence
    }
  }

  return false; // tout est identique
}

export function formatDateFirstType(dateString: Date) {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateSecondType(date: string): string {
  const dateF = new Date(date);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(dateF);
}
