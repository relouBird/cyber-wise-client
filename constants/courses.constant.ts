import type { CategoryType } from "~/types/courses.type";
import type { Formation } from "~/types/trainings.type";

export const categoriesConstants: CategoryType[] = [
  { title: "Mots de passe", value: "passwords", color: "blue" },
  { title: "Phishing", value: "phishing", color: "red" },
  {
    title: "Navigation s\u00e9curis\u00e9e",
    value: "browsing",
    color: "green",
  },
  { title: "R\u00e9seaux sociaux", value: "social", color: "purple" },
  { title: "Donn\u00e9es personnelles", value: "privacy", color: "orange" },
  { title: "S\u00e9curit\u00e9 mobile", value: "mobile", color: "teal" },
];

export const formationsConstants: Formation[] = [
  {
    id: 1,
    title: "Cr\u00e9er des mots de passe forts",
    description:
      "Apprenez \u00e0 cr\u00e9er et g\u00e9rer des mots de passe s\u00e9curis\u00e9s pour prot\u00e9ger vos comptes en ligne.",
    categorie: "passwords",
    level: "beginner",
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
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop",
    domainId: 1,
  },
  {
    id: 2,
    title: "Identifier les tentatives de phishing",
    description:
      "Reconnaissez et \u00e9vitez les emails et sites web malveillants qui tentent de voler vos informations.",
    categorie: "phishing",
    level: "beginner",
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
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop",
    domainId: 1,
  },
  {
    id: 3,
    title: "Navigation s\u00e9curis\u00e9e sur Internet",
    description:
      "D\u00e9couvrez les bonnes pratiques pour naviguer en toute s\u00e9curit\u00e9 sur le web.",
    categorie: "browsing",
    level: "intermediate",
    courses: [
      { id: 1, title: "Introduction", content: "Contenu du cours 1", order: 1 },
      {
        id: 2,
        title: "Règles de base",
        content: "Contenu du cours 2",
        order: 2,
      },
    ],
    active: true,
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=200&fit=crop",
    domainId: 1,
  },
  {
    id: 4,
    title: "S\u00e9curit\u00e9 sur les r\u00e9seaux sociaux",
    description:
      "Prot\u00e9gez votre vie priv\u00e9e et vos donn\u00e9es sur Facebook, Instagram, Twitter et autres plateformes.",
    categorie: "social",
    level: "beginner",
    courses: [
      { id: 1, title: "Introduction", content: "Contenu du cours 1", order: 1 },
      {
        id: 2,
        title: "Règles de base",
        content: "Contenu du cours 2",
        order: 2,
      },
    ],
    active: true,
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=200&fit=crop",
    domainId: 1,
  },
  {
    id: 5,
    title: "Protection des donn\u00e9es personnelles",
    description:
      "Comprenez vos droits et apprenez \u00e0 prot\u00e9ger efficacement vos informations personnelles.",
    categorie: "privacy",
    level: "intermediate",
    courses: [
      { id: 1, title: "Introduction", content: "Contenu du cours 1", order: 1 },
      {
        id: 2,
        title: "Règles de base",
        content: "Contenu du cours 2",
        order: 2,
      },
    ],
    active: false,
    image:
      "https://images.unsplash.com/photo-1563207153-f403bf289096?w=400&h=200&fit=crop",
    domainId: 1,
  },
  {
    id: 6,
    title: "S\u00e9curit\u00e9 des appareils mobiles",
    description:
      "S\u00e9curisez vos smartphones et tablettes contre les menaces et les applications malveillantes.",
    categorie: "mobile",
    courses: [
      { id: 1, title: "Introduction", content: "Contenu du cours 1", order: 1 },
      {
        id: 2,
        title: "Règles de base",
        content: "Contenu du cours 2",
        order: 2,
      },
    ],
    level: "advanced",
    active: true,
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop",
    domainId: 1,
  },
];
