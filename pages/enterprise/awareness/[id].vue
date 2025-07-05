<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import {
  incidentHeadersConst,
  participantHeadersConst,
} from "~/constants/awareness.constant";
import useAwarenessStore from "~/stores/awareness.store";
import type {
  Campaign,
  Formation,
  Incident,
  CampaignUser,
} from "~/types/awareness.type";

import {
  getParticipantStatusColor,
  getIncidentTypeColor,
  getFormationStatusColor,
  getStatusColor,
} from "~/helpers/awareness-helper";

// Composables
const route = useRoute();
const router = useRouter();
const campaignStore = useAwarenessStore();

// Meta
definePageMeta({
  layout: "admin",
  middleware: ["auth", "user"],
});

// Composables
const {
  incidents: inc,
  campaignUsers,
  launchCampaign, // demarrer la campagne...
  pauseCampaign, // mettre la campagne en pause
  fetchCampaigns,
  getCampaignById,
} = useSensibilisations();

// Données réactives
const loading = ref(false);
const loadingParticipants = ref(false);
const loadingIncidents = ref(false);
const currentTab = ref("participants");
const addDialog = ref<"participant" | "formation" | "incident">();

// ID de la campagne
const campaignId = computed(() => route.params.id as string);

// Données de la campagne
const campaign = computed(() => getCampaignById(campaignId.value));
const participants = ref<CampaignUser[]>([...campaignUsers.value]);
const formations = ref<Formation[]>([]);
const incidents = ref<Incident[]>([...inc.value]);

// Computed
const breadcrumbs = computed(() => [
  { title: "Campagnes", to: "/admin/campaigns" },
  { title: campaign.value?.name || "Détails", disabled: true },
]);

const completedUsers = computed(() => {
  return participants.value.filter((p) => p.progress === 100).length;
});

// Headers des tables
const participantHeaders = [...participantHeadersConst];

const incidentHeaders = [...incidentHeadersConst];

// Méthodes

const contactParticipant = (participant: CampaignUser) => {
  // Logique pour contacter un participant
  console.log("Contacter participant:", participant);
};

const removeParticipant = async (participant: CampaignUser) => {
  try {
    await campaignStore.removeParticipant(campaignId.value, participant.id);
  } catch (error) {
    console.error("Erreur lors de la suppression du participant:", error);
  }
};

const removeFormation = async (formation: Formation) => {
  try {
    await campaignStore.removeFormation(campaignId.value, formation.id);
  } catch (error) {
    console.error("Erreur lors de la suppression de la formation:", error);
  }
};

const editIncident = (incident: Incident) => {
  router.push(`/admin/incidents/${incident.id}/edit`);
};

const exportIncidents = () => {
  // Logique pour exporter les incidents
  console.log("Exporter incidents");
};

// Lifecycle
onMounted(async () => {
  loading.value = true;
  console.log("campagne => ", campaign);

  await fetchCampaigns();
  try {
    participants.value = await campaignStore.getCampaignParticipants(
      campaignId.value
    );
    formations.value = await campaignStore.getCampaignFormations(
      campaignId.value
    );
    incidents.value = await campaignStore.getCampaignIncidents(
      campaignId.value
    );
  } catch (error) {
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <v-container fluid>
    <!-- Header avec breadcrumb -->
    <v-row class="mb-4">
      <v-col class="d-flex mx-0 px-0">
        <v-btn
          icon="mdi-arrow-left"
          variant="text"
          color="white"
          class="me-3"
          to="/enterprise/awareness"
        />
        <v-breadcrumbs :items="breadcrumbs" divider="/" class="pa-0">
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item
              :to="item.to"
              :disabled="item.disabled"
              class="text-h6"
            >
              {{ item.title }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </v-col>
    </v-row>

    <!-- Informations principales de la campagne -->
    <v-row class="mb-6">
      <v-col>
        <v-card class="bg-fontcolor">
          <v-card-title class="d-flex justify-space-between align-end">
            <div class="d-flex align-center">
              <v-avatar
                size="64"
                class="me-4"
                :color="campaign?.image ? 'transparent' : 'primary'"
              >
                <v-img
                  v-if="campaign?.image"
                  :src="String(campaign.image)"
                  :alt="campaign.name"
                />
                <v-icon v-else size="32">mdi-security</v-icon>
              </v-avatar>
              <div>
                <h2 class="text-h4 mb-1">{{ campaign?.name }}</h2>
                <v-chip
                  :color="getStatusColor(campaign?.status ?? '')"
                  :text="campaign?.status"
                  size="small"
                />
              </div>
            </div>
            <div class="d-flex gap-2">
              <v-btn
                v-if="
                  campaign &&
                  (campaign.status === 'draft' || campaign.status == 'paused')
                "
                color="success"
                size="default"
                class="text-none"
                @click="launchCampaign(campaignId)"
              >
                <v-icon start>mdi-play</v-icon>
                Lancer
              </v-btn>
              <v-btn
                v-if="campaign?.status === 'active'"
                color="warning"
                @click="pauseCampaign(campaignId)"
                :loading="loading"
              >
                <v-icon start>mdi-pause</v-icon>
                Suspendre
              </v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <p class="text-body-1 mb-4">{{ campaign?.description }}</p>

            <!-- Statistiques rapides -->
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-card variant="tonal" color="primary">
                  <v-card-text class="text-center">
                    <div class="text-h3 font-weight-bold">
                      {{ campaignUsers.length || 0 }}
                    </div>
                    <div class="text-subtitle-1">Participants</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-card variant="tonal" color="success">
                  <v-card-text class="text-center">
                    <div class="text-h3 font-weight-bold">
                      {{ campaign?.stats.completionRate || 0 }}%
                    </div>
                    <div class="text-subtitle-1">Progression</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-card variant="tonal" color="info">
                  <v-card-text class="text-center">
                    <div class="text-h3 font-weight-bold">
                      {{ completedUsers }}
                    </div>
                    <div class="text-subtitle-1">Terminés</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-card variant="tonal" color="error">
                  <v-card-text class="text-center">
                    <div class="text-h3 font-weight-bold">
                      {{ incidents.length || 0 }}
                    </div>
                    <div class="text-subtitle-1">Incidents</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Onglets pour les différentes sections -->
    <v-card class="bg-fontcolor">
      <v-tabs v-model="currentTab" bg-color="primary" class="opacity-70">
        <v-tab value="participants">
          <v-icon start>mdi-account-group</v-icon>
          Participants
        </v-tab>
        <v-tab value="formations">
          <v-icon start>mdi-school</v-icon>
          Formations
        </v-tab>
        <v-tab value="incidents">
          <v-icon start>mdi-alert</v-icon>
          Incidents
        </v-tab>
        <v-tab value="analytics">
          <v-icon start>mdi-chart-line</v-icon>
          Analytiques
        </v-tab>
      </v-tabs>

      <v-card-text>
        <v-tabs-window v-model="currentTab">
          <!-- Onglet Participants -->
          <v-tabs-window-item value="participants">
            <div class="d-flex justify-space-between align-center mb-4">
              <h3 class="text-h5">Participants ({{ participants.length }})</h3>
              <v-btn
                color="primary"
                variant="outlined"
                @click="addDialog = 'participant'"
                :disabled="campaign?.status === 'completed'"
              >
                <v-icon start>mdi-plus</v-icon>
                Ajouter des participants
              </v-btn>
            </div>

            <v-data-table
              :headers="participantHeaders"
              :items="participants"
              :loading="loadingParticipants"
              item-key="id"
            >
              <template v-slot:item.avatar="{ item }">
                <v-avatar size="32" color="primary">
                  <v-img
                    v-if="item.avatar"
                    :src="item.avatar"
                    :alt="item.firstName"
                  />
                  <span v-else class="text-caption">
                    {{ item.firstName.charAt(0) }}{{ item.lastName.charAt(0) }}
                  </span>
                </v-avatar>
              </template>

              <template v-slot:item.statut="{ item }">
                <v-chip
                  :color="getParticipantStatusColor(item.status)"
                  :text="item.status"
                  size="small"
                />
              </template>

              <template v-slot:item.progression="{ item }">
                <div class="d-flex align-center">
                  <v-progress-linear
                    :model-value="item.progress"
                    color="primary"
                    height="6"
                    class="me-2"
                    style="min-width: 100px"
                  />
                  <span class="text-caption">{{ item.progress }}%</span>
                </div>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon="mdi-eye"
                  size="small"
                  variant="text"
                  to="/enterprise/users"
                />
                <v-btn
                  icon="mdi-message"
                  size="small"
                  variant="text"
                  @click="contactParticipant(item)"
                />
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click="removeParticipant(item)"
                  :disabled="campaign?.status === 'completed'"
                />
              </template>
            </v-data-table>
          </v-tabs-window-item>

          <!-- Onglet Formations -->
          <v-tabs-window-item value="formations">
            <div class="d-flex justify-space-between align-center mb-7">
              <h3 class="text-h5">
                Formations assignées ({{ formations.length }})
              </h3>
              <v-btn
                color="primary"
                @click="addDialog = 'formation'"
                variant="outlined"
                :disabled="campaign?.status === 'completed'"
              >
                <v-icon start>mdi-plus</v-icon>
                Ajouter des formations
              </v-btn>
            </div>

            <v-row>
              <v-col
                v-for="formation in formations"
                :key="formation.id"
                cols="12"
                md="6"
                lg="4"
              >
                <v-card>
                  <v-img :src="formation.image" height="200" cover>
                    <div class="d-flex justify-end pa-2">
                      <v-chip
                        :color="formation.mandatory ? 'error' : 'info'"
                        :text="
                          formation.mandatory ? 'Obligatoire' : 'Optionnelle'
                        "
                        size="small"
                      />
                    </div>
                  </v-img>
                  <v-card-title class="text-h6">{{
                    formation.title
                  }}</v-card-title>
                  <v-card-text>
                    <p class="text-body-2 mb-2">{{ formation.description }}</p>
                    <div class="d-flex justify-space-between align-center">
                      <span class="text-caption"
                        >Durée: {{ formation.duration }}</span
                      >
                      <v-chip
                        :color="getFormationStatusColor(formation.status)"
                        :text="formation.status"
                        size="small"
                      />
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      color="primary"
                      variant="text"
                      to="/enterprise/formations"
                    >
                      Voir détails
                    </v-btn>
                    <v-spacer />
                    <v-btn
                      icon="mdi-delete"
                      size="small"
                      variant="text"
                      color="error"
                      @click="removeFormation(formation)"
                      :disabled="campaign?.status === 'completed'"
                    />
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-tabs-window-item>

          <!-- Onglet Incidents -->
          <v-tabs-window-item value="incidents">
            <div class="d-flex justify-space-between align-center mb-4">
              <h3 class="text-h5">
                Incidents détectés ({{ incidents.length }})
              </h3>
              <div class="d-flex ga-3">
                <v-btn
                  color="primary"
                  variant="outlined"
                  @click="exportIncidents"
                >
                  <v-icon start>mdi-download</v-icon>
                  Exporter
                </v-btn>
                <v-btn
                  color="error"
                  variant="outlined"
                  @click="addDialog = 'incident'"
                >
                  <v-icon start>mdi-plus</v-icon>
                  Signaler un incident
                </v-btn>
              </div>
            </div>

            <v-data-table
              :headers="incidentHeaders"
              :items="incidents"
              :loading="loadingIncidents"
              item-key="id"
            >
              <template v-slot:item.type="{ item }">
                <v-chip
                  :color="getIncidentTypeColor(item.type)"
                  :text="item.type"
                  size="small"
                />
              </template>

              <template v-slot:item.gravite="{ item }">
                <v-rating
                  :model-value="item.severity"
                  readonly
                  size="small"
                  color="error"
                  density="compact"
                />
              </template>

              <!-- <template v-slot:item.statut="{ item }">
                <v-chip
                  :color="getIncidentStatusColor(item.status)"
                  :text="item.status"
                  size="small"
                />
              </template> -->

              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon="mdi-eye"
                  size="small"
                  variant="text"
                  to="/enterprise/incidents"
                />
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click="editIncident(item)"
                />
              </template>
            </v-data-table>
          </v-tabs-window-item>

          <!-- Onglet Analytics -->
          <v-tabs-window-item value="analytics">
            <v-row>
              <v-col cols="12" md="6">
                <v-card class="bg-transparent">
                  <v-card-title>Progression par formation</v-card-title>
                  <v-card-text>
                    <v-sheet
                      color="grey-lighten-4"
                      class="d-flex align-center justify-center"
                      height="300px"
                      rounded
                    >
                      <div class="text-center">
                        <v-icon size="64" color="grey-darken-1"
                          >mdi-chart-line</v-icon
                        >
                        <p class="text-h6 mt-2 text-grey-darken-1">
                          Graphique d'activité
                        </p>
                        <p class="text-body-2 text-grey-darken-1">
                          Erreur lors du chargement...
                        </p>
                      </div>
                    </v-sheet>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <v-card class="bg-transparent">
                  <v-card-title>Incidents par type</v-card-title>
                  <v-card-text>
                    <v-sheet
                      color="grey-lighten-4"
                      class="d-flex align-center justify-center"
                      height="300px"
                      rounded
                    >
                      <div class="text-center">
                        <v-icon size="64" color="grey-darken-1"
                          >mdi-chart-line</v-icon
                        >
                        <p class="text-h6 mt-2 text-grey-darken-1">
                          Graphique d'activité
                        </p>
                        <p class="text-body-2 text-grey-darken-1">
                          Erreur lors du chargement...
                        </p>
                      </div>
                    </v-sheet>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>

    <!-- Dialogs -->
    <!-- <ParticipantDialog
      v-model="participantDialog"
      :campaign-id="campaignId"
      @participants-added="refreshParticipants"
    />

    <FormationDialog
      v-model="formationDialog"
      :campaign-id="campaignId"
      @formations-added="refreshFormations"
    />

    <IncidentDialog
      v-model="incidentDialog"
      :campaign-id="campaignId"
      @incident-created="refreshIncidents"
    /> -->
  </v-container>
</template>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
}

.v-data-table {
  background: transparent;
}

.v-tabs-window-item {
  padding-top: 16px;
}
</style>
