<script setup lang="ts">
import {
  headersAwarenessConst,
  sortAwarenessConst,
} from "~/constants/awareness.constant";
import useAuthStore from "~/stores/auth.store";
import useUsersStore from "~/stores/users.store";
import type { Campaign } from "~/types/awareness.type";

// Meta
definePageMeta({
  layout: "admin",
  title: "Sensibilisations",
  middleware: ["auth", "user"],
});

// Composables
const {
  campaigns,
  stats,
  loading,
  fetchCampaigns,
  fetchStats,
  deleteCampaign,
  launchCampaign,
  pauseCampaign,
  createCampaign,
  updateCampaign,
} = useSensibilisations();

// gestion des stores
const usersStore = useUsersStore();
const authStore = useAuthStore();

// États réactifs
const showCreateDialog = ref(false);
const showDeleteDialog = ref(false);
const selectedCampaign = ref<Campaign | null>(null);
const campaignToDelete = ref<Campaign | null>(null);
const searchQuery = ref("");
const statusFilter = ref("");
const sortBy = ref("createdAt");

// Options
const statusOptions = [
  { title: "Brouillon", value: "draft" },
  { title: "Active", value: "active" },
  { title: "En pause", value: "paused" },
  { title: "Terminée", value: "completed" },
];

// Headers du tableau et objet de classement de campagne
const headers = [...headersAwarenessConst];
const sortOptions = [...sortAwarenessConst];

// Computed
const filteredCampaigns = computed(() => {
  let filtered = campaigns.value;

  if (statusFilter.value) {
    filtered = filtered.filter(
      (c: { status: string }) => c.status === statusFilter.value
    );
  }

  return filtered.sort((a, b) => {
    const aValue = a[sortBy.value as keyof Campaign];
    const bValue = b[sortBy.value as keyof Campaign];

    if (aValue === undefined || bValue === undefined) return 0;

    if (aValue < bValue) return -1;
    if (aValue > bValue) return 1;
    return 0;
  });
});

// Méthodes
const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "success";
    case "paused":
      return "warning";
    case "completed":
      return "info";
    default:
      return "grey";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "draft":
      return "Brouillon";
    case "active":
      return "Active";
    case "paused":
      return "En pause";
    case "completed":
      return "Terminée";
    default:
      return status;
  }
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
};

const editCampaign = (campaign: Campaign) => {
  selectedCampaign.value = campaign;
  showCreateDialog.value = true;
};

const toggleCampaignStatus = async (campaign: Campaign) => {
  try {
    if (campaign.status === "active") {
      await pauseCampaign(campaign.id);
    } else {
      await launchCampaign(campaign.id);
    }

    await fetchStats();
  } catch (error) {
    console.error("Erreur lors du changement de statut:", error);
  }
};

const confirmDelete = (campaign: Campaign) => {
  campaignToDelete.value = campaign;
  showDeleteDialog.value = true;
};

const handleDeleteCampaign = async () => {
  if (campaignToDelete.value) {
    try {
      await deleteCampaign(campaignToDelete.value.id);
      showDeleteDialog.value = false;
      campaignToDelete.value = null;
      await fetchStats();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  }
};

const handleSaveCampaign = async (campaignData: any) => {
  try {
    if (selectedCampaign.value) {
      await updateCampaign({ ...campaignData, id: selectedCampaign.value.id });
    } else {
      await createCampaign(campaignData);
    }

    showCreateDialog.value = false;
    selectedCampaign.value = null;
    await fetchStats();
  } catch (error) {
    console.error("Erreur lors de la sauvegarde:", error);
  }
};

// Lifecycle
onMounted(async () => {
  await fetchCampaigns();
  await fetchStats();
  if (authStore.me?.user_metadata.org_id) {
    await usersStore.getUsersOnUrl(authStore.me?.user_metadata.org_id ?? "");
  } else {
    await usersStore.getUsersOnUrl(authStore.me?.id ?? "");
  }
});

// Watcher pour réinitialiser la campagne sélectionnée
watch(showCreateDialog, (newValue) => {
  if (!newValue) {
    selectedCampaign.value = null;
  }
});
</script>

<template>
  <div class="sensibilisations-admin">
    <!-- En-tête -->
    <div class="d-flex justify-space-between align-end mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">
          Campagnes de Sensibilisation
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Gérez vos campagnes de sensibilisation à la sécurité informatique
        </p>
      </div>
      <v-btn
        color="primary"
        variant="outlined"
        prepend-icon="mdi-plus"
        @click="showCreateDialog = true"
      >
        Nouvelle Campagne
      </v-btn>
    </div>

    <!-- Statistiques -->
    <v-row class="mb-2">
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-3 bg-fontcolor">
          <div class="d-flex align-center">
            <v-icon color="primary" size="35" class="mr-4">
              mdi-bullhorn
            </v-icon>
            <div>
              <div class="text-h6 font-weight-bold">
                {{ stats?.totalCampaigns || 0 }}
              </div>
              <div class="text-body-2 text-medium-emphasis">
                Total Campagnes
              </div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-3 bg-fontcolor">
          <div class="d-flex align-center">
            <v-icon color="success" size="35" class="mr-4">
              mdi-play-circle
            </v-icon>
            <div>
              <div class="text-h6 font-weight-bold">
                {{ stats?.activeCampaigns || 0 }}
              </div>
              <div class="text-body-2 text-medium-emphasis">
                Campagnes Actives
              </div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-3 bg-fontcolor">
          <div class="d-flex align-center">
            <v-icon color="info" size="35" class="mr-4">
              mdi-account-group
            </v-icon>
            <div>
              <div class="text-h6 font-weight-bold">
                {{ stats?.totalParticipants || 0 }}
              </div>
              <div class="text-body-2 text-medium-emphasis">Participants</div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-3 bg-fontcolor">
          <div class="d-flex align-center">
            <v-icon color="error" size="35" class="mr-4">
              mdi-alert-circle
            </v-icon>
            <div>
              <div class="text-h6 font-weight-bold">
                {{ stats?.totalIncidents || 0 }}
              </div>
              <div class="text-body-2 text-medium-emphasis">Incidents</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filtres -->
    <v-card class="mb-6 bg-fontcolor">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="searchQuery"
              label="Rechercher une campagne"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="statusFilter"
              :items="statusOptions"
              label="Statut"
              variant="outlined"
              clearable
              hide-details
            >
              <template #prepend-item>
                <empty-card />
              </template>
            </v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="sortBy"
              :items="sortOptions"
              label="Trier par"
              variant="outlined"
              hide-details
            >
              <template #prepend-item>
                <empty-card />
              </template>
            </v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Liste des campagnes -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="filteredCampaigns"
        :loading="loading"
        :search="searchQuery"
        class="elevation-0 bg-fontcolor"
      >
        <template #item.image="{ item }">
          <v-avatar size="40" class="my-2">
            <v-img :src="String(item.image)" alt="Campaign image" />
          </v-avatar>
        </template>

        <template #item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            variant="flat"
            size="small"
          >
            {{ getStatusText(item.status) }}
          </v-chip>
        </template>

        <template #item.progress="{ item }">
          <div class="d-flex align-center">
            <v-progress-circular
              :model-value="item.stats.completionRate"
              :color="
                item.stats.completionRate > 75
                  ? 'success'
                  : item.stats.completionRate > 50
                  ? 'warning'
                  : 'error'
              "
              size="24"
              width="3"
              class="mr-2"
            />
            <span class="text-body-2">{{ item.stats.completionRate }}%</span>
          </div>
        </template>

        <template #item.participants="{ item }">
          <div class="text-body-2">
            <div>
              {{ item.stats.completedUsers }}/{{ item.stats.totalUsers }}
              terminés
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ item.stats.inProgressUsers }} en cours
            </div>
          </div>
        </template>

        <template #item.dates="{ item }">
          <div class="text-body-2">
            <div>Début: {{ formatDate(item.startDate) }}</div>
            <div v-if="item.endDate" class="text-caption text-medium-emphasis">
              Fin: {{ formatDate(item.endDate) }}
            </div>
          </div>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex gap-2">
            <v-tooltip text="Voir détails">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-eye"
                  variant="text"
                  size="small"
                  :to="'/enterprise/awareness/' + item.id"
                />
              </template>
            </v-tooltip>

            <v-tooltip text="Modifier">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-pencil"
                  variant="text"
                  size="small"
                  @click="editCampaign(item)"
                />
              </template>
            </v-tooltip>

            <v-tooltip
              :text="item.status === 'active' ? 'Mettre en pause' : 'Lancer'"
            >
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  :icon="item.status === 'active' ? 'mdi-pause' : 'mdi-play'"
                  variant="text"
                  size="small"
                  :color="item.status === 'active' ? 'warning' : 'success'"
                  @click="toggleCampaignStatus(item)"
                />
              </template>
            </v-tooltip>

            <v-tooltip text="Supprimer">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-delete"
                  variant="text"
                  size="small"
                  color="error"
                  @click="confirmDelete(item)"
                />
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog de création/modification -->
    <AwarenessCampaignDialog
      v-model="showCreateDialog"
      :campaign="selectedCampaign"
      @save="handleSaveCampaign"
    />

    <!-- Dialog de confirmation de suppression -->
    <v-dialog v-model="showDeleteDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6"> Confirmer la suppression </v-card-title>
        <v-card-text>
          Êtes-vous sûr de vouloir supprimer la campagne "{{
            campaignToDelete?.name
          }}" ? Cette action est irréversible.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="showDeleteDialog = false"> Annuler </v-btn>
          <v-btn color="error" @click="handleDeleteCampaign"> Supprimer </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.sensibilisations-admin {
  padding: 24px;
}

.gap-2 {
  gap: 8px;
}
</style>
