<!-- pages/sensibilisation/index.vue -->
<template>
  <div class="sensibilisation-page">
    <!-- Header -->
    <div class="page-header mb-6">
      <h1 class="text-h4 font-weight-bold mb-2">
        Campagnes de Sensibilisation
      </h1>
      <p class="text-subtitle-1 text-grey-600">
        Découvrez les campagnes de sensibilisation disponibles et renforcez vos
        compétences en sécurité
      </p>
    </div>

    <!-- Filtres -->
    <v-card class="mb-6 bg-fontcolor" elevation="2">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="searchQuery"
              label="Rechercher une campagne"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="statusFilter"
              :items="statusOptions"
              label="Filtrer par statut"
              variant="outlined"
              hide-details
              density="compact"
              clearable
            >
              <template #prepend-item>
                <empty-card />
              </template>
            </v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="progressFilter"
              :items="progressOptions"
              label="Filtrer par progression"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            >
              <template #prepend-item>
                <empty-card />
              </template>
            </v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Statistiques globales -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-card color="fontcolor" dark>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="30" class="mr-3" color="primary"
                >mdi-shield-check</v-icon
              >
              <div>
                <div class="text-h6">
                  {{ globalStats.totalCampaigns }} Campagnes
                </div>
                <div class="text-caption">Disponibles</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="fontcolor" dark>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="30" color="success" class="mr-3"
                >mdi-check-circle</v-icon
              >
              <div>
                <div class="text-h6">
                  {{ globalStats.completedCampaigns }} Campagnes
                </div>
                <div class="text-caption">Terminées</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="fontcolor" dark>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="31" color="warning" class="mr-3"
                >mdi-progress-clock</v-icon
              >
              <div>
                <div class="text-h6">
                  {{ globalStats.inProgressCampaigns }} Campagnes
                </div>
                <div class="text-caption">En cours</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="fontcolor" dark>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="30" color="info" class="mr-3"
                >mdi-chart-line</v-icon
              >
              <div>
                <div class="text-h6">{{ globalStats.averageProgress }}%</div>
                <div class="text-caption">Progression moyenne</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <v-progress-circular indeterminate size="64" color="primary" />
      <p class="mt-4 text-subtitle-1">Chargement des campagnes...</p>
    </div>

    <!-- Liste des campagnes -->
    <div v-else>
      <v-row>
        <v-col
          v-for="campaign in filteredCampaigns"
          :key="campaign.id"
          cols="12"
          md="6"
          lg="4"
        >
          <v-card
            class="campaign-card h-100"
            elevation="3"
            color="fontcolor"
            hover
            @click="navigateToCampaign(campaign.id)"
          >
            <!-- Image de la campagne -->
            <v-img :src="getCampaignImage(campaign.image)" height="200" cover>
              <div class="campaign-overlay">
                <v-chip
                  :color="getStatusColor(campaign.userStatus)"
                  size="small"
                  class="ma-2"
                >
                  {{ getStatusLabel(campaign.userStatus) }}
                </v-chip>
              </div>
            </v-img>

            <v-card-text class="pb-0">
              <h3 class="text-h6 font-weight-bold mb-2">{{ campaign.name }}</h3>
              <p class="text-body-2 text-grey-600 mb-3">
                {{ campaign.description }}
              </p>

              <!-- Progression -->
              <div class="mb-3">
                <div class="d-flex justify-space-between align-center mb-1">
                  <span class="text-caption">Progression</span>
                  <span class="text-caption font-weight-bold"
                    >{{ campaign.userProgress }}%</span
                  >
                </div>
                <v-progress-linear
                  :model-value="campaign.userProgress"
                  :color="getProgressColor(campaign.userProgress)"
                  height="8"
                  rounded
                />
              </div>

              <!-- Informations sur les formations -->
              <div class="d-flex align-center mb-2">
                <v-icon size="20" class="mr-2">mdi-book-open-variant</v-icon>
                <span class="text-body-2">
                  {{ campaign.completedFormations }}/{{
                    campaign.totalFormations
                  }}
                  formations terminées
                </span>
              </div>

              <!-- Dates -->
              <div class="d-flex align-center mb-2">
                <v-icon size="20" class="mr-2">mdi-calendar-range</v-icon>
                <span class="text-body-2">
                  {{ formatDate(campaign.startDate) }} -
                  {{ formatDate(campaign.endDate) }}
                </span>
              </div>

              <!-- Temps estimé -->
              <div class="d-flex align-center">
                <v-icon size="20" class="mr-2">mdi-clock-outline</v-icon>
                <span class="text-body-2"
                  >{{ campaign.estimatedTime }} min</span
                >
              </div>
            </v-card-text>

            <v-card-actions>
              <v-btn
                :color="
                  campaign.userStatus === 'completed' ? 'success' : 'primary'
                "
                variant="flat"
                block
                @click.stop="navigateToCampaign(campaign.id)"
              >
                <v-icon class="mr-2">
                  {{
                    campaign.userStatus === "completed"
                      ? "mdi-refresh"
                      : "mdi-play"
                  }}
                </v-icon>
                {{
                  campaign.userStatus === "completed" ? "Revoir" : "Commencer"
                }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Message si aucune campagne -->
      <div v-if="filteredCampaigns.length === 0" class="text-center py-8">
        <v-icon size="64" color="grey-400">mdi-shield-alert</v-icon>
        <h3 class="text-h6 mt-4 mb-2">Aucune campagne trouvée</h3>
        <p class="text-body-2 text-grey-600">
          Aucune campagne ne correspond à vos critères de recherche.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import useAuthStore from "~/stores/auth.store";
import useAwarenessStore from "~/stores/awareness.store";

// Types

interface GlobalStats {
  totalCampaigns: number;
  completedCampaigns: number;
  inProgressCampaigns: number;
  averageProgress: number;
}

// Gestion des stores
const campaignStore = useAwarenessStore();
const { me } = useAuthStore();

// Reactive data
const loading = ref(true);
const searchQuery = ref("");
const statusFilter = ref<string | null>(null);
const progressFilter = ref<string | null>(null);

const campaigns = computed(() => campaignStore.user_campaign_list);
const globalStats = ref<GlobalStats>({
  totalCampaigns: 0,
  completedCampaigns: 0,
  inProgressCampaigns: 0,
  averageProgress: 0,
});

// Options pour les filtres
const statusOptions = [
  { title: "Actif", value: "active" },
  { title: "Terminé", value: "completed" },
  { title: "En pause", value: "paused" },
];

const progressOptions = [
  { title: "Non commencé", value: "not_started" },
  { title: "En cours", value: "in_progress" },
  { title: "Terminé", value: "completed" },
];

// Computed
const filteredCampaigns = computed(() => {
  let filtered = campaigns.value;

  // Filtre par recherche
  if (searchQuery.value) {
    filtered = filtered.filter(
      (campaign) =>
        campaign.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        campaign.description
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
    );
  }

  // Filtre par statut
  if (statusFilter.value) {
    filtered = filtered.filter(
      (campaign) => campaign.status === statusFilter.value
    );
  }

  // Filtre par progression
  if (progressFilter.value) {
    filtered = filtered.filter(
      (campaign) => campaign.userStatus === progressFilter.value
    );
  }

  return filtered;
});

// Methods
const navigateToCampaign = (campaignId: string) => {
  navigateTo(`/awareness/${campaignId}`);
};

const getCampaignImage = (image: string) => {
  return image && image != ""
    ? image
    : "http://127.0.0.1:54321/storage/v1/object/public/investia//cybersecurite-sensibilisation-apprendre-protection-1280x640.jpg";
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "success";
    case "in_progress":
      return "warning";
    default:
      return "grey";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "completed":
      return "Terminé";
    case "in_progress":
      return "En cours";
    default:
      return "Non commencé";
  }
};

const getProgressColor = (progress: number) => {
  if (progress === 100) return "success";
  if (progress > 50) return "warning";
  return "primary";
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const loadCampaigns = async () => {
  try {
    loading.value = true;

    // Simulation d'appel API - remplacez par votre logique
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // recuperation de toutes les campagnes d'un user
    // Simulation d'appel API
    if (me?.user_metadata.org_id) {
      await campaignStore.fetchAllUserCampaigns(
        me?.user_metadata.org_id,
        me?.id ?? ""
      );
    } else {
      await campaignStore.fetchAllUserCampaigns(me?.id ?? "", me?.id ?? "");
    }

    // Calcul des statistiques
    globalStats.value = {
      totalCampaigns: campaigns.value.length,
      completedCampaigns: campaigns.value.filter(
        (c) => c.userStatus === "completed"
      ).length,
      inProgressCampaigns: campaigns.value.filter(
        (c) => c.userStatus === "in_progress"
      ).length,
      averageProgress: Math.round(
        campaigns.value.reduce((sum, c) => sum + c.userProgress, 0) /
          campaigns.value.length
      ),
    };
  } catch (error) {
    console.error("Erreur lors du chargement des campagnes:", error);
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  loadCampaigns();
});
</script>

<style scoped>
.sensibilisation-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.campaign-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
  }
}

.campaign-overlay {
  position: absolute;
  top: 0;
  right: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, transparent 50%);
}

.v-progress-linear {
  border-radius: 4px;
}
</style>
