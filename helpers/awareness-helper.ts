export const getParticipantStatusColor = (statut: string): string => {
  console.log("Statut reçu :", statut);

  if (statut === "in_progress") {
    return "primary";
  } else if (statut === "completed") {
    return "success";
  } else if (statut === "not_started") {
    return "grey";
  } else if (statut === "bloqued") {
    return "error";
  } else {
    return "grey";
  }
};

export const getStatusColor = (statut: string) => {
  switch (statut) {
    case "Active":
      return "success";
    case "Brouillon":
      return "warning";
    case "Suspendue":
      return "error";
    case "Terminée":
      return "info";
    default:
      return "grey";
  }
};

export const getFormationStatusColor = (statut: string) => {
  switch (statut) {
    case "Active":
      return "success";
    case "Inactive":
      return "grey";
    case "Archivée":
      return "warning";
    default:
      return "grey";
  }
};

export const getIncidentTypeColor = (type: string) => {
  switch (type) {
    case "Phishing":
      return "error";
    case "Malware":
      return "deep-orange";
    case "Accès non autorisé":
      return "red";
    case "Fuite de données":
      return "purple";
    default:
      return "grey";
  }
};

export const getIncidentStatusColor = (statut: string) => {
  switch (statut) {
    case "Ouvert":
      return "error";
    case "En cours":
      return "warning";
    case "Résolu":
      return "success";
    case "Fermé":
      return "grey";
    default:
      return "grey";
  }
};
