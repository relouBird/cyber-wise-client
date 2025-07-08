import type { MenuItem } from "~/types/constant.type";

// constants/navigation.constant.ts
export const menuItemsConstants: MenuItem[] = [
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard-outline",
    to: "/enterprise",
  },
  {
    title: "Utilisateurs",
    icon: "mdi-account-multiple-outline",
    to: "/enterprise/users",
    badge: {
      text: "24",
      color: "primary",
    },
  },
  {
    title: "Sensibilisations",
    icon: "mdi-shield-account-outline",
    to: "/enterprise/awareness",
    children: [
      {
        title: "Campagnes",
        icon: "mdi-bullhorn-outline",
        to: "/enterprise/awareness/campaigns",
      },
      {
        title: "Contenus",
        icon: "mdi-file-document-outline",
        to: "/enterprise/awareness/content",
      },
      {
        title: "Planification",
        icon: "mdi-calendar-outline",
        to: "/enterprise/awareness/planning",
      },
      {
        title: "Statistiques",
        icon: "mdi-chart-bar",
        to: "/enterprise/awareness/stats",
      },
    ],
  },
  {
    title: "Formations",
    icon: "mdi-school-outline",
    to: "/enterprise/trainings",
  },
  {
    title: "Courses",
    icon: "mdi-book-open-outline",
    to: "/enterprise/courses",
  },
  {
    title: "Rapports",
    icon: "mdi-chart-line",
    to: "/enterprise/reports",
    children: [
      {
        title: "Tableau de bord",
        icon: "mdi-view-dashboard",
        to: "/enterprise/reports/dashboard",
      },
      {
        title: "Activités",
        icon: "mdi-chart-timeline-variant",
        to: "/enterprise/reports/activities",
      },
      {
        title: "Performances",
        icon: "mdi-trending-up",
        to: "/enterprise/reports/performance",
      },
      {
        title: "Exports",
        icon: "mdi-download",
        to: "/enterprise/reports/exports",
      },
    ],
  },
  {
    title: "Paramètres",
    icon: "mdi-cog-outline",
    to: "/enterprise/settings",
    children: [
      {
        title: "Général",
        icon: "mdi-cog",
        to: "/enterprise/settings/general",
      },
      {
        title: "Sécurité",
        icon: "mdi-shield-check",
        to: "/enterprise/settings/security",
      },
      {
        title: "Notifications",
        icon: "mdi-bell",
        to: "/enterprise/settings/notifications",
      },
    ],
  },
];
