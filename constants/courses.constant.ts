import type { CategoryType, SubCoursesInterface } from "~/types/courses.type";

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

export const rawCoursesConstants: SubCoursesInterface[] = [
  {
    id: 1,
    title: "Qu'est-ce que le Phishing ?",
    image: "/images/phishing-intro.jpg",
    content: `
Le phishing, ou hameçonnage en français, est une technique d'ingénierie sociale utilisée par les cybercriminels pour voler des informations sensibles.

## Comment ça fonctionne ?

Les attaquants envoient des messages frauduleux qui semblent provenir d'une source fiable (banque, réseau social, etc.) pour inciter les victimes à :

- Révéler leurs mots de passe
- Communiquer leurs informations bancaires
- Télécharger des logiciels malveillants

ATTENTION: Les attaques de phishing sont responsables de 90% des violations de données.
    `,
    order: 1,
    status: "pending",
  },
  {
    id: 2,
    title: "Reconnaître un Email de Phishing",
    image: "/images/phishing-email.jpg",
    content: `
Savoir identifier un email de phishing est crucial pour votre sécurité. Voici les signes révélateurs :

## Indices visuels

- Expéditeur suspect : Adresse email qui ne correspond pas à l'organisation
- Urgence artificielle : "Votre compte sera fermé dans 24h"
- Fautes d'orthographe : Erreurs dans le texte ou le nom de l'entreprise
- Liens douteux : URLs qui ne correspondent pas au site officiel

## Technique de vérification

Passez votre souris sur les liens sans cliquer pour voir l'URL de destination dans la barre de statut.

ASTUCE: En cas de doute, contactez directement l'organisation par un autre moyen.
    `,
    order: 2,
    status: "pending",
  },
  {
    id: 3,
    title: "Protection Avancée contre le Phishing",
    image: "/images/phishing-protection.jpg",
    content: `
Découvrez les méthodes avancées pour vous protéger efficacement contre les attaques de phishing.

## Outils de protection

- Authentification à deux facteurs : Même si vos identifiants sont compromis
- Gestionnaire de mots de passe : Détecte automatiquement les sites frauduleux
- Filtres anti-phishing : Dans votre navigateur et client email

## Bonnes pratiques

- Vérifiez toujours l'URL avant de saisir des informations
- Utilisez des connexions sécurisées (HTTPS)
- Mettez à jour régulièrement vos logiciels
- Signalez les tentatives de phishing

RESULTAT: Avec ces techniques, vous réduisez le risque d'être victime de 95%.
    `,
    order: 3,
    status: "pending",
  },
];
