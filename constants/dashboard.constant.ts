import type { Actions, Activity, Statistics } from "~/types/dashboard.type";

// Données réactives
export const recaps: Array<Statistics> = [
  {
    title: "Utilisateurs",
    number: 0,
    icon: "mdi-account-group",
    color: "primary",
  },
  {
    title: "Formations",
    number: 0,
    icon: "mdi-school",
    color: "success",
  },
  {
    title: "Sensibilisations",
    number: 0,
    icon: "mdi-lightbulb-on",
    color: "warning",
  },
  {
    title: "Incidents",
    number: 0,
    icon: "mdi-alert-circle",
    color: "error",
  },
];

export const rapidActions: Array<Actions> = [
  {
    title: "Ajouter un Utilisateur...",
    color: "primary",
    icon: "mdi-account-plus",
    to: "/enterprise/users",
  },
  {
    title: "Soumettre une formation",
    color: "success",
    icon: "mdi-plus-circle",
    to: "/enterprise/trainings",
  },
  {
    title: "Nouvelle Sensibilisation",
    color: "warning",
    icon: "mdi-bullhorn",
    to: "/enterprise/awareness",
  },
  {
    title: "Génerer un rapport",
    color: "info",
    icon: "mdi-file-chart",
    to: "/enterprise/reports",
  },
];

export const activities: Array<Activity> = [
  {
    id: 1,
    title: "Nouvel utilisateur inscrit",
    subtitle: "John Doe a rejoint la plateforme",
    icon: "mdi-account-plus",
    color: "success",
    time: "2h",
  },
  {
    id: 2,
    title: "Formation complétée",
    subtitle: "Sécurité au travail - 15 participants",
    icon: "mdi-school",
    color: "primary",
    time: "4h",
  },
  {
    id: 3,
    title: "Incident signalé",
    subtitle: "Problème de sécurité - Bureau A",
    icon: "mdi-alert-circle",
    color: "error",
    time: "6h",
  },
  {
    id: 4,
    title: "Rapport généré",
    subtitle: "Rapport mensuel de sécurité",
    icon: "mdi-file-chart",
    color: "info",
    time: "1j",
  },
];
