// Ici on mettra toutes les constantes liées aux formations
//---------------------------------------------------------------

import type {
  ColorOption,
  Formation,
  IconOption,
} from "~/types/trainings.type";

export const formationsConstants: Formation[] = [
  {
    id: 1,
    title: "Les bases des mots de passe forts",
    description:
      "Découvrez comment créer des mots de passe robustes et uniques",
    domainId: 1,
    active: true,
    courses: [
      {
        id: 1,
        formation_id: 1,
        title: "Introduction",
        content: "Contenu du cours 1",
        order: 1,
      },
      {
        id: 2,
        formation_id: 1,
        title: "Règles de base",
        content: "Contenu du cours 2",
        order: 2,
      },
    ],
    created_at: new Date("2024-01-15"),
    categorie: "",
    level: "beginner",
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
