import type { MenuItem } from "~/types/constant.type";

export const menuItemsConstants : MenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard-outline',
    to: '/enterprise'
  },
  {
    title: 'Utilisateurs',
    icon: 'mdi-account-multiple-outline',
    to: '/enterprise/users',
    badge: {
      text: '24',
      color: 'primary'
    }
  },
  {
    title: 'Formations',
    icon: 'mdi-school-outline',
    to: '/enterprise/trainings'
  },
    {
    title: 'Courses',
    icon: 'mdi-book-open-outline',
    to: '/enterprise/courses'
  },
  // {
  //   title: 'Sensibilisations',
  //   icon: 'mdi-shield-account-outline',
  //   to: '/enterprise/awareness'
  // },
  {
    title: 'Rapports',
    icon: 'mdi-chart-line',
    to: '/enterprise/reports'
  },
  // {
  //   title: 'Incidents',
  //   icon: 'mdi-alert-circle-outline',
  //   to: '/enterprise/incidents',
  //   badge: {
  //     text: '5',
  //     color: 'error'
  //   }
  // },
  {
    title: 'Paramètres',
    icon: 'mdi-cog-outline',
    to: '/enterprise/settings'
  }
]