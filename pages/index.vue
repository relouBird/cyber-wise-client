<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Chart, registerables } from "chart.js";
import useAuthStore from "~/stores/auth.store";

Chart.register(...registerables);

// use
const { me } = useAuthStore();
const router = useRouter();

// Données utilisateur
const userName = computed(
  () => me?.user_metadata.firstName + " " + me?.user_metadata.lastName
);
const globalProgress = ref(67);
const completedCourses = ref(8);
const totalCourses = ref(12);

const securityLevel = ref({
  label: "Niveau Avancé",
  color: "success",
  icon: "mdi-shield-check",
});

const userStats = ref([
  {
    title: "Cours terminés",
    value: "8",
    icon: "mdi-book-check",
    color: "success",
  },
  {
    title: "Heures d'apprentissage",
    value: "24h",
    icon: "mdi-clock",
    color: "info",
  },
  {
    title: "Badges obtenus",
    value: "12",
    icon: "mdi-medal",
    color: "warning",
  },
  {
    title: "Série actuelle",
    value: "7 jours",
    icon: "mdi-fire",
    color: "error",
  },
]);

const currentCourses = ref([
  {
    id: 1,
    title: "Détection avancée du phishing",
    module: "Module 3: Analyse des emails",
    progress: 75,
    timeLeft: "45 min",
    color: "red",
    icon: "mdi-email-alert",
  },
  {
    id: 2,
    title: "Gestion des mots de passe",
    module: "Module 2: Gestionnaires",
    progress: 30,
    timeLeft: "2h 15min",
    color: "blue",
    icon: "mdi-key-variant",
  },
  {
    id: 3,
    title: "Sécurité des réseaux Wi-Fi",
    module: "Module 1: Concepts de base",
    progress: 90,
    timeLeft: "20 min",
    color: "green",
    icon: "mdi-wifi",
  },
  {
    id: 4,
    title: "Chiffrement des données",
    module: "Module 4: Pratiques avancées",
    progress: 15,
    timeLeft: "3h 30min",
    color: "purple",
    icon: "mdi-lock",
  },
]);

const recentBadges = ref([
  { id: 1, name: "Expert Phishing", color: "red", icon: "mdi-shield-check" },
  { id: 2, name: "Maître des mots de passe", color: "blue", icon: "mdi-key" },
  { id: 3, name: "Streak 7 jours", color: "orange", icon: "mdi-fire" },
]);

const securityAlerts = ref([
  {
    id: 1,
    title: "Tentative de phishing détectée",
    description: "Un email suspect a été identifié dans votre simulation",
    severity: "high",
    icon: "mdi-email-alert",
  },
  {
    id: 2,
    title: "Mot de passe faible détecté",
    description: "Votre simulation révèle des mots de passe à risque",
    severity: "medium",
    icon: "mdi-key-alert",
  },
  {
    id: 3,
    title: "Mise à jour de sécurité",
    description: "Nouvelles techniques d'attaque identifiées",
    severity: "low",
    icon: "mdi-information",
  },
]);

const recommendations = ref([
  {
    id: 1,
    title: "Sécurité des réseaux sociaux",
    description: "Protégez votre identité en ligne",
    duration: "1h 30min",
    level: "Intermédiaire",
    difficulty: "warning",
    color: "orange",
    icon: "mdi-account-network",
  },
  {
    id: 2,
    title: "Sauvegarde et récupération",
    description: "Stratégies de protection des données",
    duration: "45min",
    level: "Débutant",
    difficulty: "success",
    color: "teal",
    icon: "mdi-backup-restore",
  },
  {
    id: 3,
    title: "Cryptographie pratique",
    description: "Chiffrement pour tous",
    duration: "2h 15min",
    level: "Avancé",
    difficulty: "error",
    color: "purple",
    icon: "mdi-lock-outline",
  },
]);

const initCharts = () => {
  // Graphique d'activité
  const activityCtx = document.getElementById(
    "activityChart"
  ) as HTMLCanvasElement;
  if (activityCtx) {
    new Chart(activityCtx, {
      type: "bar",
      data: {
        labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
        datasets: [
          {
            label: "Heures d'apprentissage",
            data: [6, 8, 4, 6],
            backgroundColor: "rgba(33, 150, 243, 0.8)",
            borderColor: "#2196F3",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "#fff",
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#fff",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
          y: {
            ticks: {
              color: "#fff",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
        },
      },
    });
  }

  // Graphique des compétences
  const skillsCtx = document.getElementById("skillsChart") as HTMLCanvasElement;
  if (skillsCtx) {
    new Chart(skillsCtx, {
      type: "radar",
      data: {
        labels: [
          "Phishing",
          "Mots de passe",
          "Navigation",
          "Appareils",
          "Réseaux",
        ],
        datasets: [
          {
            label: "Niveau de compétence",
            data: [85, 70, 60, 90, 45],
            borderColor: "#4CAF50",
            backgroundColor: "rgba(76, 175, 80, 0.2)",
            pointBackgroundColor: "#4CAF50",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "#fff",
            },
          },
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              color: "#fff",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            pointLabels: {
              color: "#fff",
            },
          },
        },
      },
    });
  }
};

const continueCourse = (courseId: number) => {
  router.push(`/cours/${courseId}`);
};

const viewAllCourses = () => {
  router.push("/cours");
};

const viewAlert = (alertId: number) => {
  router.push(`/alertes/${alertId}`);
};

const startRecommendation = (recommendationId: number) => {
  router.push(`/cours/${recommendationId}`);
};

onMounted(() => {
  initCharts();
});
</script>

<template>
  <v-container fluid class="dashboard-container">
    <!-- Header avec salutation -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="display-1 font-weight-bold text-white mb-2">
              Bonjour, {{ userName ?? "User" }} 👋
            </h1>
            <p class="title text--secondary">
              Continuez votre parcours de sécurisation
            </p>
          </div>
          <v-chip :color="securityLevel.color" dark large class="px-4">
            <v-icon left>{{ securityLevel.icon }}</v-icon>
            {{ securityLevel.label }}
          </v-chip>
        </div>
      </v-col>
    </v-row>

    <!-- Stats rapides -->
    <v-row class="mb-6">
      <v-col
        cols="12"
        sm="6"
        md="3"
        v-for="stat in userStats"
        :key="stat.title"
      >
        <v-card class="pa-4 bg-fontcolor" dark elevation="4">
          <div class="d-flex align-center">
            <v-icon size="40" class="mr-3" :color="stat.color">{{
              stat.icon
            }}</v-icon>
            <div>
              <h3 class="headline font-weight-bold">{{ stat.value }}</h3>
              <p class="body-2 mb-0">{{ stat.title }}</p>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Progression actuelle -->
    <v-row class="mb-6">
      <v-col cols="12" lg="8">
        <v-card class="pa-6 bg-fontcolor" elevation="4">
          <div class="d-flex align-center justify-space-between mb-4">
            <h2 class="title font-weight-bold text-white">Cours en cours</h2>
            <v-btn color="primary" text @click="viewAllCourses">
              Voir tout
            </v-btn>
          </div>

          <v-row>
            <v-col
              cols="12"
              md="6"
              v-for="course in currentCourses"
              :key="course.id"
            >
              <v-card
                class="course-card mb-4 bg-fontcolorthird"
                dark
                elevation="2"
                @click="continueCourse(course.id)"
              >
                <v-card-text class="pa-4">
                  <div class="d-flex align-center mb-3">
                    <v-avatar :color="course.color" size="40" class="mr-3">
                      <v-icon color="white">{{ course.icon }}</v-icon>
                    </v-avatar>
                    <div class="flex-grow-1">
                      <h3 class="body-1 font-weight-bold">
                        {{ course.title }}
                      </h3>
                      <p class="caption text--secondary mb-0">
                        {{ course.module }}
                      </p>
                    </div>
                  </div>

                  <v-progress-linear
                    :value="course.progress"
                    :color="course.color"
                    height="6"
                    rounded
                    class="mb-2"
                  ></v-progress-linear>

                  <div class="d-flex justify-space-between">
                    <span class="caption">{{ course.progress }}% complété</span>
                    <span class="caption">{{ course.timeLeft }} restant</span>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card class="dashboard-card pa-6 mb-6 bg-fontcolor" elevation="4">
          <h2 class="title font-weight-bold text-white mb-4">
            Progression globale
          </h2>
          <div class="text-center">
            <v-progress-circular
              :value="globalProgress"
              size="120"
              width="8"
              color="primary"
              class="mb-4"
            >
              <span class="display-1 font-weight-bold text-white">
                {{ globalProgress }}%
              </span>
            </v-progress-circular>
            <p class="body-2 text--secondary">
              {{ completedCourses }}/{{ totalCourses }} cours terminés
            </p>
          </div>
        </v-card>

        <v-card class="dashboard-card pa-6 bg-fontcolor" elevation="4">
          <h2 class="title font-weight-bold text-white mb-4">Badges récents</h2>
          <div class="d-flex flex-wrap">
            <v-chip
              v-for="badge in recentBadges"
              :key="badge.id"
              :color="badge.color"
              dark
              small
              class="ma-1"
            >
              <v-icon left small>{{ badge.icon }}</v-icon>
              {{ badge.name }}
            </v-chip>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Graphiques de progression -->
    <v-row class="mb-6">
      <v-col cols="12" md="8">
        <v-card class="dashboard-card pa-6 bg-fontcolor" elevation="4">
          <h2 class="title font-weight-bold text-white mb-4">
            Activité des 30 derniers jours
          </h2>

          <div style="height: 250px">
            <canvas id="activityChart" height="300"></canvas>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="dashboard-card pa-6 bg-fontcolor" elevation="4">
          <h2 class="title font-weight-bold text-white mb-4">
            Domaines de compétence
          </h2>
          <div style="height: 250px">
            <canvas id="skillsChart" height="300"></canvas>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Alertes de sécurité -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="dashboard-card pa-6 bg-fontcolor" elevation="4">
          <div class="d-flex align-center justify-space-between mb-4">
            <h2 class="title font-weight-bold text-white">
              <v-icon color="warning" class="mr-2">mdi-alert</v-icon>
              Alertes de sécurité
            </h2>
            <v-chip color="warning" dark small>
              {{ securityAlerts.length }} nouvelles
            </v-chip>
          </div>

          <v-row>
            <v-col
              cols="12"
              md="4"
              v-for="alert in securityAlerts"
              :key="alert.id"
            >
              <v-card
                class="alert-card pa-4 bg-fontcolorthird"
                dark
                elevation="2"
              >
                <div class="d-flex align-center mb-2">
                  <v-icon class="mr-2">{{ alert.icon }}</v-icon>
                  <span class="body-2 font-weight-bold">{{ alert.title }}</span>
                </div>
                <p class="caption mb-2">{{ alert.description }}</p>
                <v-btn
                  x-small
                  text
                  @click="viewAlert(alert.id)"
                  :color="
                    alert.severity === 'high'
                      ? 'error'
                      : alert.severity === 'medium'
                      ? 'warning'
                      : 'info'
                  "
                  class="px-5"
                >
                  En savoir plus
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recommandations -->
    <v-row>
      <v-col cols="12">
        <v-card class="dashboard-card pa-6 bg-fontcolor" elevation="4">
          <h2 class="title font-weight-bold text-white mb-4">
            Recommandations pour vous
          </h2>
          <v-row>
            <v-col
              cols="12"
              md="4"
              v-for="recommendation in recommendations"
              :key="recommendation.id"
            >
              <v-card
                class="recommendation-card pa-4 bg-fontcolorthird"
                dark
                elevation="2"
                @click="startRecommendation(recommendation.id)"
              >
                <div class="d-flex align-center mb-3">
                  <v-avatar
                    :color="recommendation.color"
                    size="40"
                    class="mr-3"
                  >
                    <v-icon color="white">{{ recommendation.icon }}</v-icon>
                  </v-avatar>
                  <div>
                    <h3 class="body-1 font-weight-bold">
                      {{ recommendation.title }}
                    </h3>
                    <v-chip x-small :color="recommendation.difficulty" dark>
                      {{ recommendation.level }}
                    </v-chip>
                  </div>
                </div>
                <p class="caption text--secondary mb-3">
                  {{ recommendation.description }}
                </p>
                <div class="d-flex justify-space-between align-center">
                  <span class="caption">{{ recommendation.duration }}</span>
                  <v-icon small>mdi-arrow-right</v-icon>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  padding: 24px;
}

.course-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3) !important;
}

.alert-card {
  transition: all 0.3s ease;
}

.alert-card:hover {
  transform: scale(1.02);
}

.recommendation-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.recommendation-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
}

.text-white {
  color: #ffffff !important;
}

.text--secondary {
  color: #bdc3c7 !important;
}

/* Responsive */
@media (max-width: 600px) {
  .dashboard-container {
    padding: 16px;
  }

  .display-1 {
    font-size: 1.8rem !important;
  }
}
</style>
