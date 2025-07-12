// Ici on mettra toutes les constantes liées aux formations
//---------------------------------------------------------------

import type {
  ColorOption,
  Formation,
  FormationSub,
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


export const finalUserFormationConst : FormationSub[] = [
  {
    id: 1,
    title: "Cr\u00e9er des mots de passe forts",
    description:
      "Apprenez \u00e0 cr\u00e9er et g\u00e9rer des mots de passe s\u00e9curis\u00e9s pour prot\u00e9ger vos comptes en ligne.",
    category: "passwords",
    level: "beginner",
    duration: 45,
    enrolledCount: 124,
    progress: 0,
    active: true,
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop",
  },
  {
    id: 2,
    title: "Identifier les tentatives de phishing",
    description:
      "Reconnaissez et \u00e9vitez les emails et sites web malveillants qui tentent de voler vos informations.",
    category: "phishing",
    level: "beginner",
    duration: 30,
    enrolledCount: 89,
    progress: 65,
    active: true,
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop",
  },
  {
    id: 3,
    title: "Navigation s\u00e9curis\u00e9e sur Internet",
    description:
      "D\u00e9couvrez les bonnes pratiques pour naviguer en toute s\u00e9curit\u00e9 sur le web.",
    category: "browsing",
    level: "intermediate",
    duration: 60,
    enrolledCount: 156,
    progress: 0,
    active: true,
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=200&fit=crop",
  },
  {
    id: 4,
    title: "S\u00e9curit\u00e9 sur les r\u00e9seaux sociaux",
    description:
      "Prot\u00e9gez votre vie priv\u00e9e et vos donn\u00e9es sur Facebook, Instagram, Twitter et autres plateformes.",
    category: "social",
    level: "beginner",
    duration: 40,
    enrolledCount: 203,
    progress: 25,
    active: true,
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=200&fit=crop",
  },
  {
    id: 5,
    title: "Protection des donn\u00e9es personnelles",
    description:
      "Comprenez vos droits et apprenez \u00e0 prot\u00e9ger efficacement vos informations personnelles.",
    category: "privacy",
    level: "intermediate",
    duration: 75,
    enrolledCount: 67,
    progress: 0,
    active: false,
    image:
      "https://images.unsplash.com/photo-1563207153-f403bf289096?w=400&h=200&fit=crop",
  },
  {
    id: 6,
    title: "S\u00e9curit\u00e9 des appareils mobiles",
    description:
      "S\u00e9curisez vos smartphones et tablettes contre les menaces et les applications malveillantes.",
    category: "mobile",
    level: "advanced",
    duration: 90,
    enrolledCount: 45,
    progress: 100,
    active: true,
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop",
  },
]