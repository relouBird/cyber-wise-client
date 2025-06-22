import type { ConfigurationInterface } from "~/types/configuration.type";
import IMG1 from "~/assets/images/image1.png";
import CHOICE1 from "~/assets/images/configuration/dossier.png";
import CHOICE2 from "~/assets/images/configuration/alert.png";
import CHOICE3 from "~/assets/images/configuration/shield.png";
import CHOICE4 from "~/assets/images/configuration/graduation-hat.png";
import CHOICE5 from "~/assets/images/configuration/group.png";
import CHOICE6 from "~/assets/images/configuration/chalkboard.png";

export const reasons: ConfigurationInterface[] = [
  {
    title: "Pour fournir des outils à mes élèves ou formateurs",
    option: "step1",
    image: CHOICE1,
  },
  {
    title: "Pour sensibiliser le personnel de ma structure",
    option: "step2",
    image: CHOICE2,
  },
  {
    title: "Pour simuler et tester des attaques avant déploiement",
    option: "step3",
    image: CHOICE3,
  },
];

export const interest: ConfigurationInterface[] = [
  {
    title: "Apprenants / Étudiants",
    option: "interest1",
    image: CHOICE4,
  },
  {
    title: "Collegues / Employés",
    option: "interest2",
    image: CHOICE5,
  },
  {
    title: "Formateurs / Encadrants",
    option: "interest3",
    image: CHOICE6,
  },
];

export const times: ConfigurationInterface[] = [
  {
    title: "Occasionnel",
    option: "5 minutes",
  },
  {
    title: "Régulier",
    option: "10 minutes",
  },
  {
    title: "Sérieux",
    option: "20 minutes",
  },
];

export const days: ConfigurationInterface[] = [
  {
    title: "Minimum",
    option: "2 days",
  },
  {
    title: "Moyen",
    option: "3 days",
  },
  {
    title: "Beaucoup",
    option: "5 days",
  },
];
