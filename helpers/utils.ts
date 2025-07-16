import type { FormationSub, ThirdFormation } from "~/types/trainings.type";

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
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateF);
}

export function getActivityColor(type: string) {
  if (type == "user") {
    return "success";
  } else if (type == "training") {
    return "primary";
  } else if (type == "incident") {
    return "error";
  } else if (type == "campaign") {
    return "warning";
  }
  return "info";
}

export function getActivityIcon(type: string) {
  if (type == "user") {
    return "mdi-account-plus";
  } else if (type == "training") {
    return "mdi-school";
  } else if (type == "incident") {
    return "mdi-alert-circle";
  } else if (type == "campaign") {
    return "mdi-farm";
  }
  return "mdi-file-chart";
}

export function timeSince(date: Date | string): string {
  const now = new Date();
  const inputDate = typeof date === "string" ? new Date(date) : date;

  const seconds = Math.floor((now.getTime() - inputDate.getTime()) / 1000);

  if (seconds < 60) return `${seconds} s`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} d`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} m`;

  const years = Math.floor(months / 12);
  return `${years}y`;
}

export function formatCourseContent(raw: string): string {
  const lines = raw.split("\n");

  return lines
    .map((line) => {
      const trimmed = line.trim();

      if (trimmed.startsWith("## ")) {
        return `<h3>${trimmed.slice(3)}</h3>`;
      }

      if (trimmed.startsWith("- ")) {
        return `<li>${trimmed.slice(2)}</li>`;
      }

      if (trimmed.startsWith("ATTENTION:")) {
        return `<div class="warning-box"><strong>⚠️ Attention :</strong> ${trimmed
          .slice(10)
          .trim()}</div>`;
      }

      if (trimmed.startsWith("ASTUCE:")) {
        return `<div class="tip-box"><strong>💡 Astuce :</strong> ${trimmed
          .slice(7)
          .trim()}</div>`;
      }

      if (trimmed.startsWith("RESULTAT:")) {
        return `<div class="success-box"><strong>✅ Résultat :</strong> ${trimmed
          .slice(12)
          .trim()}</div>`;
      }

      if (trimmed === "") {
        return "";
      }

      return `<p>${trimmed}</p>`;
    })
    .reduce((acc, line, idx, arr) => {
      if (line.startsWith("<li>")) {
        const prev = idx > 0 ? arr[idx - 1] : "";
        const next = idx < arr.length - 1 ? arr[idx + 1] : "";

        const open = !prev.startsWith("<li>") ? "<ul>" : "";
        const close = !next.startsWith("<li>") ? "</ul>" : "";

        return acc + open + line + close;
      }

      return acc + line;
    }, "");
}

export function transformToThirdFormation(
  formation: FormationSub
): ThirdFormation {
  return {
    id: formation.id ?? formation.sub ?? Date.now(),
    name: formation.title,
    description: formation.description,
    totalCourses: 1, // valeur arbitraire ou logique à adapter
    completedCourses: formation.status === "completed" ? 1 : 0,
    userProgress: formation.progress,
    userStatus: formation.status,
    estimatedTime: formation.duration,
    points: calculatePoints(formation), // fonction utilitaire
  };
}

function calculatePoints(formation: FormationSub): number {
  const base = 100;
  const levelMultiplier = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
  };

  const progressFactor = formation.progress / 100;
  return Math.round(base * levelMultiplier[formation.level] * progressFactor);
}
