<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  formatDate,
  getStatusColor,
  getStatusLabel,
  getProgressColor,
  getFormationStatusColor,
  getFormationStatusIcon,
  getFormationStatusLabel,
  getFormationActionIcon,
  getFormationActionLabel,
} from "~/helpers/sub-awaneress";
import { transformToThirdFormation } from "~/helpers/utils";
import useAuthStore from "~/stores/auth.store";
import useAwarenessStore from "~/stores/awareness.store";
import useTrainingsStore from "~/stores/trainings.store";
import type { FormationSub, ThirdFormation } from "~/types/trainings.type";

// Gestion des stores
const campaignStore = useAwarenessStore();
const trainingsStore = useTrainingsStore();
const { me } = useAuthStore();

// Reactive data
const route = useRoute();
const loading = ref(true);
const campaignId = route.params.id as string;
const campaign = computed(() =>
  campaignStore.user_campaign_list.find((u) => u.id == campaignId)
);
const formations = computed(() =>
  trainingsStore.getSubTrainings.map((u) => transformToThirdFormation(u))
);

const navigateToFormation = async (formation: ThirdFormation) => {
  if (isFormationAccessible(formation, 0)) {
    const newTraining = await trainingsStore.createSubTraining(
      me?.id ?? "",
      trainingsStore.sub_training_list.find(
        (t) => t.id == formation.id
      ) as FormationSub
    );
    navigateTo(`/courses/${formation.id}`);
  }
};

const continueFormation = () => {
  if (campaign.value) {
    // Trouver la première formation non terminée
    const nextFormation = formations.value.find(
      (f) => f.userStatus !== "completed"
    );
    if (nextFormation) {
      navigateToFormation(nextFormation);
    }
  }
};

const reviewFormations = () => {
  if (campaign.value && formations.value.length > 0) {
    navigateToFormation(formations.value[0]);
  }
};

const isFormationAccessible = (formation: ThirdFormation, index: number) => {
  if (!campaign.value) return false;

  // La première formation est toujours accessible
  if (index === 0) return true;

  // Les autres formations sont accessibles si la précédente est terminée
  const previousFormation = formations.value[index - 1];
  return previousFormation && previousFormation.userStatus === "completed";
};

const downloadCertificate = () => {
  // Logique pour télécharger le certificat
  console.log("Téléchargement du certificat...");
};

const getCampaignImage = (image: string) => {
  return image && image != ""
    ? image
    : "http://127.0.0.1:54321/storage/v1/object/public/investia//cybersecurite-sensibilisation-apprendre-protection-1280x640.jpg";
};

// Lifecycle
onMounted(async () => {
  try {
    loading.value = true;

    // s'il y a pas de campagne laod les campagnes...
    if (!campaignStore.user_campaign_list.length) {
      if (me?.user_metadata.org_id) {
        await campaignStore.fetchAllUserCampaigns(
          me?.user_metadata.org_id,
          me?.id ?? ""
        );
      } else {
        await campaignStore.fetchAllUserCampaigns(me?.id ?? "", me?.id ?? "");
      }
    }

    // load toutes les formations d'une campagne
    await trainingsStore.getAllSubCampaignTraining(me?.id ?? "", campaignId);

    // // Données d'exemple - remplacez par votre API
    // formations.value = [
    //   {
    //     id: "f1",
    //     name: "Introduction au Phishing",
    //     description:
    //       "Comprendre les bases du phishing et ses différentes formes",
    //     totalCourses: 3,
    //     completedCourses: 3,
    //     userProgress: 100,
    //     userStatus: "completed",
    //     estimatedTime: 15,
    //     points: 0,
    //   },
    //   {
    //     id: "f2",
    //     name: "Techniques de Spear Phishing",
    //     description:
    //       "Apprendre à identifier les attaques ciblées et personnalisées",
    //     totalCourses: 4,
    //     completedCourses: 2,
    //     userProgress: 50,
    //     userStatus: "in_progress",
    //     estimatedTime: 20,
    //     points: 0,
    //   },
    //   {
    //     id: "f3",
    //     name: "Clone Phishing et Vishing",
    //     description: "Découvrir les techniques de clonage et de phishing vocal",
    //     totalCourses: 3,
    //     completedCourses: 0,
    //     userProgress: 0,
    //     userStatus: "not_started",
    //     estimatedTime: 18,
    //     points: 0,
    //   },
    //   {
    //     id: "f4",
    //     name: "Outils de Protection",
    //     description: "Maîtriser les outils et techniques de protection",
    //     totalCourses: 2,
    //     completedCourses: 0,
    //     userProgress: 0,
    //     userStatus: "not_started",
    //     estimatedTime: 12,
    //     points: 0,
    //   },
    //   {
    //     id: "f5",
    //     name: "Évaluation Finale",
    //     description: "Test final pour valider vos connaissances",
    //     totalCourses: 1,
    //     completedCourses: 0,
    //     userProgress: 0,
    //     userStatus: "not_started",
    //     estimatedTime: 10,
    //     points: 0,
    //   },
    // ];
  } catch (error) {
    console.error("Erreur lors du chargement de la campagne:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<!-- pages/sensibilisation/[id].vue -->
<template>
  <div class="campaign-detail-page">
    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <v-progress-circular indeterminate size="64" color="primary" />
      <p class="mt-4 text-subtitle-1">Chargement de la campagne...</p>
    </div>

    <!-- Campagne non trouvée -->
    <div v-else-if="!campaign" class="text-center py-8">
      <v-icon size="64" color="error">mdi-alert-circle</v-icon>
      <h3 class="text-h6 mt-4 mb-2">Campagne non trouvée</h3>
      <p class="text-body-2 text-grey-600 mb-4">
        La campagne demandée n'existe pas ou n'est plus disponible.
      </p>
      <v-btn color="primary" @click="$router.back()">
        <v-icon class="mr-2">mdi-arrow-left</v-icon>
        Retour
      </v-btn>
    </div>

    <!-- Contenu de la campagne -->
    <div v-else>
      <!-- Header de la campagne -->
      <div class="campaign-header mb-6">
        <v-btn variant="text" class="mb-4" @click="$router.back()">
          <v-icon class="mr-2">mdi-arrow-left</v-icon>
          Retour aux campagnes
        </v-btn>

        <v-card elevation="3" color="fontcolor" class="px-2 pt-4">
          <v-row no-gutters>
            <v-col cols="12" md="4">
              <v-img
                :src="getCampaignImage(campaign.image)"
                height="250"
                cover
              />
            </v-col>
            <v-col cols="12" md="8">
              <v-card-text class="pa-6">
                <div class="d-flex align-center mb-3">
                  <h1 class="text-h5 font-weight-bold mr-3">
                    {{ campaign.name }}
                  </h1>
                  <v-chip
                    :color="getStatusColor(campaign.userStatus)"
                    size="small"
                  >
                    {{ getStatusLabel(campaign.userStatus) }}
                  </v-chip>
                </div>

                <p class="text-body-1 mb-4">{{ campaign.description }}</p>

                <!-- Progression globale -->
                <div class="mb-4">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="text-subtitle-2">Progression globale</span>
                    <span class="text-subtitle-2 font-weight-bold"
                      >{{ campaign.userProgress }}%</span
                    >
                  </div>
                  <v-progress-linear
                    :model-value="campaign.userProgress"
                    :color="getProgressColor(campaign.userProgress)"
                    height="12"
                    rounded
                  />
                </div>

                <!-- Statistiques -->
                <v-row>
                  <v-col cols="6" sm="3">
                    <div class="text-center">
                      <div class="text-h6 font-weight-bold">
                        {{ campaign.totalFormations }}
                      </div>
                      <div class="text-caption">Formations</div>
                    </div>
                  </v-col>
                  <v-col cols="6" sm="3">
                    <div class="text-center">
                      <div class="text-h6 font-weight-bold">
                        {{ campaign.completedFormations }}
                      </div>
                      <div class="text-caption">Terminées</div>
                    </div>
                  </v-col>
                  <v-col cols="6" sm="3">
                    <div class="text-center">
                      <div class="text-h6 font-weight-bold">
                        {{ campaign.estimatedTime }}
                      </div>
                      <div class="text-caption">Minutes</div>
                    </div>
                  </v-col>
                  <v-col cols="6" sm="3">
                    <div class="text-center">
                      <div class="text-h6 font-weight-bold">
                        {{ formatDate(campaign.endDate) }}
                      </div>
                      <div class="text-caption">Fin</div>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </div>

      <!-- Actions rapides -->
      <div class="quick-actions mb-6">
        <v-card elevation="2" class="bg-fontcolor">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="8">
                <div class="d-flex align-center">
                  <v-icon class="mr-3" color="primary">mdi-target</v-icon>
                  <div>
                    <div class="text-subtitle-2">Objectif de la campagne</div>
                    <div class="text-body-2 text-grey-600">
                      Complétez toutes les formations pour renforcer vos
                      compétences en sécurité
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="4" class="d-flex align-center justify-end">
                <v-btn
                  v-if="campaign.userStatus !== 'completed'"
                  color="primary"
                  size="large"
                  variant="outlined"
                  @click="continueFormation"
                >
                  <v-icon class="mr-2">mdi-play</v-icon>
                  {{
                    campaign.userStatus === "not_started"
                      ? "Commencer"
                      : "Continuer"
                  }}
                </v-btn>
                <v-btn
                  v-else
                  color="success"
                  size="large"
                  @click="reviewFormations"
                >
                  <v-icon class="mr-2">mdi-refresh</v-icon>
                  Revoir les formations
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>

      <!-- Liste des formations -->
      <div class="formations-section">
        <h2 class="text-h6 font-weight-bold mb-4">Formations de la campagne</h2>

        <v-row>
          <v-col
            v-for="(formation, index) in formations"
            :key="formation.id"
            cols="12"
            md="6"
            lg="4"
          >
            <v-card
              class="formation-card h-100"
              color="fontcolor"
              :class="{ disabled: !isFormationAccessible(formation, index) }"
              :disabled="!isFormationAccessible(formation, index)"
              elevation="2"
              hover
              @click="navigateToFormation(formation)"
            >
              <!-- Badge de statut -->
              <div class="formation-status">
                <v-chip
                  :color="getFormationStatusColor(formation.userStatus)"
                  size="small"
                  class="ma-2"
                >
                  <v-icon size="16" class="mr-1">
                    {{ getFormationStatusIcon(formation.userStatus) }}
                  </v-icon>
                  {{ getFormationStatusLabel(formation.userStatus) }}
                </v-chip>
              </div>

              <!-- Numéro de formation -->
              <div class="formation-number">
                <v-avatar
                  :color="
                    formation.userStatus === 'completed' ? 'success' : 'primary'
                  "
                  size="32"
                >
                  <span class="text-subtitle-2 font-weight-bold">{{
                    index + 1
                  }}</span>
                </v-avatar>
              </div>

              <v-card-text class="pb-0 pt-12">
                <h3 class="text-h6 font-weight-bold mb-2">
                  {{ formation.name }}
                </h3>
                <p class="text-body-2 text-grey-600 mb-3">
                  {{ formation.description }}
                </p>

                <!-- Progression de la formation -->
                <div class="mb-3" v-if="formation.userProgress">
                  <div class="d-flex justify-space-between align-center mb-1">
                    <span class="text-caption">Progression</span>
                    <span class="text-caption font-weight-bold"
                      >{{ formation.userProgress }}%</span
                    >
                  </div>
                  <v-progress-linear
                    :model-value="formation.userProgress"
                    :color="getProgressColor(formation.userProgress)"
                    height="6"
                    rounded
                  />
                </div>

                <!-- Informations sur les cours -->
                <div class="formation-info">
                  <div class="d-flex align-center mb-2">
                    <v-icon size="16" class="mr-2"
                      >mdi-book-open-variant</v-icon
                    >
                    <span class="text-body-2">
                      {{ formation.completedCourses }}/{{
                        formation.totalCourses
                      }}
                      cours
                    </span>
                  </div>
                  <div class="d-flex align-center mb-2">
                    <v-icon size="16" class="mr-2">mdi-clock-outline</v-icon>
                    <span class="text-body-2"
                      >{{ formation.estimatedTime }} min</span
                    >
                  </div>
                  <div class="d-flex align-center">
                    <v-icon size="16" class="mr-2">mdi-trophy</v-icon>
                    <span class="text-body-2"
                      >{{ formation.points }} points</span
                    >
                  </div>
                </div>
              </v-card-text>

              <v-card-actions>
                <v-btn
                  :disabled="!isFormationAccessible(formation, index)"
                  :color="
                    formation.userStatus === 'completed' ? 'success' : 'primary'
                  "
                  variant="flat"
                  class="mb-2"
                  block
                  @click.stop="navigateToFormation(formation)"
                >
                  <v-icon class="mr-2">
                    {{ getFormationActionIcon(formation.userStatus) }}
                  </v-icon>
                  {{ getFormationActionLabel(formation.userStatus) }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <!-- Certificat de réussite -->
      <div
        v-if="campaign.userStatus === 'completed'"
        class="certificate-section mt-6"
      >
        <v-card color="success" dark elevation="3">
          <v-card-text class="text-center pa-6">
            <v-icon size="64" class="mb-4">mdi-certificate</v-icon>
            <h3 class="text-h5 font-weight-bold mb-2">Félicitations !</h3>
            <p class="text-body-1 mb-4">
              Vous avez terminé avec succès la campagne "{{ campaign.name }}"
            </p>
            <v-btn
              color="white"
              variant="flat"
              size="large"
              @click="downloadCertificate"
            >
              <v-icon class="mr-2">mdi-download</v-icon>
              Télécharger le certificat
            </v-btn>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.campaign-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.campaign-header {
  .v-card {
    overflow: hidden;
  }
}

.formations-section {
  .formation-card {
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    position: relative;
  }

  .formation-status {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
  }

  .formation-number {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 1;
  }

  .formation-info {
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    padding-top: 16px;
    margin-top: 16px;
  }
}

.certificate-section {
  .v-card {
    background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  }
}

.quick-actions {
  .v-card {
    border-left: 4px solid rgb(var(--v-theme-primary));
  }
}

@media (max-width: 768px) {
  .campaign-detail-page {
    padding: 16px;
  }

  .campaign-header {
    .v-row {
      flex-direction: column;
    }
  }

  .quick-actions {
    .v-row {
      flex-direction: column;
      gap: 16px;
    }
  }
}
</style>
