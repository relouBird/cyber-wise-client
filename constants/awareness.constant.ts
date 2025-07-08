import type { Campaign, Incident } from "~/types/awareness.type";

export const mockUsersConstant = [
  {
    id: "user1",
    name: "Jean Dupont",
    email: "jean.dupont@company.com",
    department: "IT",
  },
  {
    id: "user2",
    name: "Marie Martin",
    email: "marie.martin@company.com",
    department: "HR",
  },
  {
    id: "user3",
    name: "Pierre Durand",
    email: "pierre.durand@company.com",
    department: "Finance",
  },
  {
    id: "user4",
    name: "Sophie Bernard",
    email: "sophie.bernard@company.com",
    department: "Marketing",
  },
  {
    id: "user5",
    name: "Thomas Petit",
    email: "thomas.petit@company.com",
    department: "IT",
  },
];

export const mockFormationsConstant = [
  {
    id: "formation1",
    name: "Sécurité des mots de passe",
    description: "Apprenez à créer et gérer des mots de passe sécurisés",
    image: "/images/password-security.jpg",
    domain: "password",
    duration: "45 min",
  },
  {
    id: "formation2",
    name: "Phishing et arnaques",
    description: "Identifiez et évitez les tentatives de phishing",
    image: "/images/phishing-training.jpg",
    domain: "phishing",
    duration: "30 min",
  },
  {
    id: "formation3",
    name: "Navigation sécurisée",
    description: "Bonnes pratiques pour naviguer en sécurité",
    image: "/images/safe-browsing.jpg",
    domain: "browsing",
    duration: "25 min",
  },
];

export const headersAwarenessConst = [
  { title: "Image", key: "image", sortable: false },
  { title: "Nom", key: "name" },
  { title: "Statut", key: "status" },
  { title: "Progression", key: "progress" },
  { title: "Participants", key: "participants" },
  { title: "Dates", key: "dates" },
  { title: "Actions", key: "actions", sortable: false },
];

export const sortAwarenessConst = [
  { title: "Date de création", value: "createdAt" },
  { title: "Date de début", value: "startDate" },
  { title: "Nom", value: "name" },
  { title: "Statut", value: "status" },
];

export const participantHeadersConst = [
  { title: "", key: "avatar", sortable: false },
  { title: "Nom", key: "nom" },
  { title: "Prénom", key: "prenom" },
  { title: "Email", key: "email" },
  { title: "Statut", key: "statut" },
  { title: "Progression", key: "progression" },
  { title: "Dernière connexion", key: "derniereConnexion" },
  { title: "Actions", key: "actions", sortable: false },
];

export const incidentHeadersConst = [
  { title: "Type", key: "type" },
  { title: "Description", key: "description" },
  { title: "Utilisateur", key: "utilisateur" },
  { title: "Gravité", key: "gravite" },
  { title: "Statut", key: "statut" },
  { title: "Date", key: "date" },
  { title: "Actions", key: "actions", sortable: false },
];

export const mockCampaignsConstant: Campaign[] = [
  {
    id: "1",
    name: "Campagne Phishing Q1 2025",
    description:
      "Sensibilisation aux tentatives de phishing et aux bonnes pratiques email",
    image: "",
    status: "active",
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-20"),
    startDate: new Date("2025-01-15"),
    endDate: new Date("2025-03-15"),
    targetUsers: ["user1", "user2", "user3", "user4"],
    formations: ["formation1", "formation2"],
    createdBy: "admin1",
    stats: {
      totalUsers: 4,
      completedUsers: 1,
      inProgressUsers: 2,
      notStartedUsers: 1,
      completionRate: 25,
    },
  },
  {
    id: "2",
    name: "Sécurité des mots de passe",
    description:
      "Formation sur la création et gestion de mots de passe sécurisés",
    image: "",
    status: "draft",
    createdAt: new Date("2025-01-10"),
    updatedAt: new Date("2025-01-18"),
    startDate: new Date("2025-02-01"),
    targetUsers: ["user1", "user3", "user5"],
    formations: ["formation3"],
    createdBy: "admin1",
    stats: {
      totalUsers: 3,
      completedUsers: 0,
      inProgressUsers: 0,
      notStartedUsers: 3,
      completionRate: 0,
    },
  },
];

export const mockIncidentsConstant: Incident[] = [
  {
    id: "1",
    campaignId: "1",
    userId: "user2",
    type: "phishing_clicked",
    description:
      "Utilisateur a cliqué sur un lien de phishing dans un email de test",
    severity: "medium",
    reportedAt: new Date("2025-01-18"),
    resolved: false,
  },
  {
    id: "2",
    campaignId: "1",
    userId: "user3",
    type: "password_weak",
    description: "Mot de passe faible détecté lors du test de sécurité",
    severity: "high",
    reportedAt: new Date("2025-01-17"),
    resolved: true,
    resolvedAt: new Date("2025-01-19"),
    notes: "Utilisateur a mis à jour son mot de passe",
  },
];
