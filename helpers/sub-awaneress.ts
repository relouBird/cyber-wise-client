export const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "success";
    case "in_progress":
      return "warning";
    default:
      return "grey";
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case "completed":
      return "Terminé";
    case "in_progress":
      return "En cours";
    default:
      return "Non commencé";
  }
};

export const getProgressColor = (progress: number) => {
  if (progress === 100) return "success";
  if (progress > 50) return "warning";
  return "primary";
};

export const getFormationStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "success";
    case "in_progress":
      return "warning";
    default:
      return "grey";
  }
};

export const getFormationStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return "mdi-check";
    case "in_progress":
      return "mdi-progress-clock";
    default:
      return "mdi-circle-outline";
  }
};

export const getFormationStatusLabel = (status: string) => {
  switch (status) {
    case "completed":
      return "Terminé";
    case "in_progress":
      return "En cours";
    default:
      return "Non commencé";
  }
};

export const getFormationActionIcon = (status: string) => {
  switch (status) {
    case "completed":
      return "mdi-refresh";
    case "in_progress":
      return "mdi-play";
    default:
      return "mdi-play";
  }
};

export const getFormationActionLabel = (status: string) => {
  switch (status) {
    case "completed":
      return "Revoir";
    case "in_progress":
      return "Continuer";
    default:
      return "Commencer";
  }
};

export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};