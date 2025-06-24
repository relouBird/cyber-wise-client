<script setup lang="ts">
import {
  activities,
  rapidActions,
  recaps,
} from "~/constants/dashboard.constant";
import useUsersStore from "~/stores/users.store";
import type {
  Stats,
  Activity,
  Statistics,
  Actions,
} from "~/types/dashboard.type";

// Définir le Middleware à utiliser
definePageMeta({
  middleware: ["auth", "user"],
  layout: "admin",
});

// Meta tags
useHead({
  title: "Tableau de bords Entreprise - SafeSteps",
  meta: [{ name: "description", content: "Tableau de bords SafeSteps" }],
});

const useUsers = useUsersStore();
const store = storeToRefs(useUsers);

// Données réactives
const stats = reactive<Statistics[]>(recaps);
const rapidsActionsData = reactive<Actions[]>(rapidActions);
const recentActivities = ref<Activity[]>(activities);

// Simulation de chargement des statistiques (à remplacer par votre API)
onMounted(async () => {
  try {
    const data = ref<number>(store.getLength.value);
    stats[0].number = data.value;
  } catch (error) {
    console.error("Erreur lors du chargement des statistiques:", error);
  }
});
</script>

<template>
  <div class="home-page">
    <!-- Header avec statistiques -->
    <div class="mb-8">
      <h1 class="text-h4 font-weight-bold mb-2">Tableau de bord</h1>
      <p class="text-subtitle-1 text-grey-darken-1">
        Bienvenue sur votre interface d'administration
      </p>
    </div>

    <!-- Cartes de statistiques -->
    <v-row class="mb-8">
      <v-col v-for="data in stats" cols="12" sm="6" md="3">
        <v-card class="pa-4" :color="data.color" variant="tonal">
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-subtitle-2 text-medium-emphasis mb-1">
                {{ data.title }}
              </p>
              <h3 class="text-h4 font-weight-bold">{{ data.number }}</h3>
            </div>
            <v-icon size="40" :color="data.color">{{ data.icon }}</v-icon>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Graphiques et activités récentes -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="pa-6 bg-fontcolor">
          <v-card-title class="text-h5 mb-4"
            >Activité des 7 derniers jours</v-card-title
          >
          <div class="chart-container" style="height: 300px">
            <!-- Placeholder pour un graphique -->
            <v-sheet
              color="grey-lighten-4"
              class="d-flex align-center justify-center"
              height="100%"
              rounded
            >
              <div class="text-center">
                <v-icon size="64" color="grey-darken-1">mdi-chart-line</v-icon>
                <p class="text-h6 mt-2 text-grey-darken-1">
                  Graphique d'activité
                </p>
                <p class="text-body-2 text-grey-darken-1">
                  Erreur lors du chargement...
                </p>
              </div>
            </v-sheet>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card v-if="recentActivities.length" class="pa-6 bg-fontcolor">
          <v-card-title class="text-h5 mb-4">Activités récentes</v-card-title>
          <v-list lines="two" class="bg-transparent">
            <v-list-item
              v-for="activity in recentActivities"
              :key="activity.id"
              :prepend-icon="activity.icon"
              :title="activity.title"
              :subtitle="activity.subtitle"
              class="px-0 bg-transparent"
            >
              <template #append>
                <v-chip :color="activity.color" size="small" variant="tonal">
                  {{ activity.time }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
        </v-card>

        <v-card class="pa-6 pt-4 pb-8 bg-fontcolor" v-else>
          <v-empty-state
            icon="mdi-magnify"
            text="Essayez d'ajuster vos termes de recherche ou vos filtres. Parfois, des termes moins précis ou des requêtes plus larges peuvent vous aider à trouver ce que vous cherchez."
            title="Aucune Activités Recentes..."
          ></v-empty-state>
        </v-card>
      </v-col>
    </v-row>

    <!-- Actions rapides -->
    <v-row class="mt-8">
      <v-col cols="12">
        <v-card class="pa-6 pt-4 bg-fontcolor">
          <v-card-title class="text-h5 mb-2">Actions rapides</v-card-title>
          <v-row>
            <v-col v-for="data in rapidsActionsData" cols="12" sm="6" md="3">
              <v-btn
                size="large"
                :color="data.color"
                variant="tonal"
                class="text-body-1"
                @click="navigateTo(data.to)"
              >
                {{ data.title }}
                <template v-slot:prepend>
                  <v-icon size="22">{{ data.icon }}</v-icon></template
                >
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.home-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.chart-container {
  position: relative;
  width: 100%;
}

@media (max-width: 960px) {
  .home-page {
    padding: 16px;
  }
}
</style>
