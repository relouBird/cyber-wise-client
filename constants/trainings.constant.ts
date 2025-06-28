// Ici on mettra toutes les constantes liées aux formations
//---------------------------------------------------------------

import type {
  ColorOption,
  Domain,
  Formation,
  IconOption,
} from "~/types/trainings.type";

export const domainsConstants: Domain[] = [
  {
    id: 1,
    name: "Sécurité des mots de passe",
    description: "Apprenez à créer et gérer des mots de passe sécurisés",
    icon: "mdi-key-variant",
    color: "blue",
  },
  {
    id: 2,
    name: "Phishing et arnaques",
    description: "Identifiez et évitez les tentatives de phishing",
    icon: "mdi-email-alert",
    color: "red",

  },
  
  {
    id: 3,
    name: "Navigation sécurisée",
    description: "Bonnes pratiques pour naviguer en sécurité",
    icon: "mdi-web",
    color: "green",

  },
  {
    id: 4,
    name: "Réseaux sociaux",
    description: "Protégez votre vie privée sur les réseaux sociaux",
    icon: "mdi-account-group",
    color: "purple",
  },
];

export const formationsConstants: Formation[] = [
  {
    id: 1,
    title: "Les bases des mots de passe forts",
    description:
      "Découvrez comment créer des mots de passe robustes et uniques",
    domainId: 1,
    active: true,
    courses: [
      { id: 1, title: "Introduction", content: "Contenu du cours 1", order: 1 },
      {
        id: 2,
        title: "Règles de base",
        content: "Contenu du cours 2",
        order: 2,
      },
    ],
    createdAt: new Date("2024-01-15"),
  },
  {
    id: 2,
    title: "Gestionnaires de mots de passe",
    description: "Utilisez des outils pour gérer vos mots de passe en sécurité",
    domainId: 1,
    active: false,
    courses: [
      {
        id: 3,
        title: "Choisir un gestionnaire",
        content: "Contenu du cours 3",
        order: 1,
      },
    ],
    createdAt: new Date("2024-02-01"),
  },
];

export const iconOptionsConstants: IconOption[] = [
  { title: "Sécurité", value: "mdi-security" },
  { title: "Clé", value: "mdi-key-variant" },
  { title: "Email", value: "mdi-email-alert" },
  { title: "Web", value: "mdi-web" },
  { title: "Groupe", value: "mdi-account-group" },
  { title: "Mobile", value: "mdi-cellphone" },
  { title: "Données", value: "mdi-database-lock" },
];

export const colorOptionsConstants: ColorOption[] = [
  { title: "Bleu", value: "blue" },
  { title: "Rouge", value: "red" },
  { title: "Vert", value: "green" },
  { title: "Violet", value: "purple" },
  { title: "Orange", value: "orange" },
  { title: "Teal", value: "teal" },
];
