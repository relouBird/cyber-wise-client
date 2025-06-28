<script setup lang="ts">
import { TrainingsNotDeleted } from "#components";
import { formatDateFirstType, formatDateSecondType } from "~/helpers/utils";
import useTrainingsStore from "~/stores/trainings.store";
import type { Domain, Formation } from "~/types/trainings.type";

// Définir le Middleware à utiliser
definePageMeta({
  middleware: ["auth", "user"],
  layout: "admin",
});

// Meta tags
useHead({
  title: "Formations Entreprise - SafeSteps",
  meta: [{ name: "description", content: "Tableau de bords SafeSteps" }],
});

// store
const trainingsStore = useTrainingsStore();

// État réactif
const selectedDomain = ref<Domain | null>(null);
const searchQuery = ref("");
const selectedStatus = ref<boolean | null>(null);

// Dialogs
const domainDialog = ref(false);
const formationDialog = ref(false);
const dialogDelete = ref("");

// Formulaires
const domainForm = ref<Domain>({
  name: "",
  categorie: "",
  description: "",
  icon: "mdi-security",
  color: "primary",
});

const formationForm = ref<Formation>({
  title: "",
  categorie: "",
  description: "",
  image: "",
  domainId: 1,
  active: false,
  courses: [],
});

// Données à consommer...
const domains = ref<Domain[]>([]);
const formations = ref<Formation[]>([]);

// Options
const statusOptions = [
  { title: "Actif", value: true },
  { title: "Inactif", value: false },
];

// Computed
const domainFormations = computed(() => {
  if (!selectedDomain.value) return [];
  return formations.value.filter(
    (f) => f.domainId === selectedDomain.value!.id
  );
});

const filteredFormations = computed(() => {
  let filtered = domainFormations.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (f) =>
        f.title.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query)
    );
  }

  if (selectedStatus.value !== null) {
    filtered = filtered.filter((f) => f.active === selectedStatus.value);
  }

  return filtered;
});

// Méthodes
const selectDomain = (domain: Domain) => {
  selectedDomain.value = domain;
};

const goBackToDomains = () => {
  selectedDomain.value = null;
  resetFilters();
};

const getFormationsCount = (domainId: number): number => {
  return formations.value.filter((f) => f.domainId === domainId).length;
};

const getTotalCourses = (domainId: number): number => {
  return formations.value
    .filter((f) => f.domainId === domainId)
    .reduce((total, f) => total + (f.courses ? f.courses.length : 0), 0);
};

const resetFilters = () => {
  searchQuery.value = "";
  selectedStatus.value = null;
};

const openDomainDialog = () => {
  domainForm.value = {
    name: "",
    categorie: "",
    description: "",
    icon: "mdi-security",
    color: "primary",
  };
  domainDialog.value = true;
};
const openFormationDialog = () => {
  formationForm.value = {
    title: "",
    categorie: "",
    description: "",
    image: "",
    domainId: selectedDomain.value?.id ?? 1,
    active: false,
    courses: [],
  };
  formationDialog.value = true;
};

const editDomain = (domain: Domain) => {
  if (domain.creator_id) {
    domainForm.value = { ...domain };
    domainDialog.value = true;
  } else {
    // Afficher que ce domain ne peut etre supprimé...
    dialogDelete.value = "Domain";
  }
};
const editFormation = (formation: Formation) => {
  if (formation.creator_id || formation.creator_id != "") {
    formationForm.value = { ...formation };
    formationDialog.value = true;
  } else {
    dialogDelete.value = " Formation";
  }
};

const viewFormation = (formation: Formation) => {
  // Navigation vers la gestion des cours
  console.log("Voir les cours de:", formation.title);
  // Ici vous pourriez naviguer vers une page de gestion des cours
};

const toggleFormationStatus = (formation: Formation) => {
  formation.active = !formation.active;
};

const deleteDomain = async (domain: Domain) => {
  if (domain.creator_id) {
    // Supprimer les formations du domaine
    await trainingsStore.deleteDomain(domain.id ?? 1);
  } else {
    // Afficher que ce domain ne peut etre supprimé...
    dialogDelete.value = "Domain";
  }
};

const deleteFormation = async (formation: Formation) => {
  if (!formation.creator_id) {
    dialogDelete.value = "Formation";
  } else {
    await trainingsStore.deleteTraining(formation.id ?? 1);
  }
};

// Au chargement de la page...
onMounted(async () => {
  console.log("chargement-pre-page..");
  const response = await trainingsStore.getAllDomains();
  console.log("chargement-pending-page..=>", response);
  await trainingsStore.getAllTraining();
  // importe....
  domains.value = trainingsStore.getDomains;
  formations.value = trainingsStore.getTrainings;
  console.log("chargement-page..");
});

// quand les données changent...
onUpdated(() => {
  console.log("updated....");
  domains.value = trainingsStore.getDomains;
  formations.value = trainingsStore.getTrainings;
});
</script>

<template>
  <v-container fluid class="formations-admin pa-6">
    <!-- En-tête avec navigation -->
    <div class="d-flex align-center mb-6">
      <v-btn
        v-if="selectedDomain"
        icon="mdi-arrow-left"
        variant="text"
        color="white"
        class="me-3"
        @click="goBackToDomains"
      />
      <div class="flex-grow-1">
        <h1 class="text-h4 font-weight-bold text-white mb-1">
          {{
            selectedDomain
              ? `Formations - ${selectedDomain.name}`
              : "Domaines de formation"
          }}
        </h1>
        <p class="text-grey-400 text-body-2">
          {{
            selectedDomain
              ? `${domainFormations.length} formation(s) dans ce domaine`
              : `${domains.length} domaines disponibles`
          }}
        </p>
      </div>

      <v-btn
        v-if="!selectedDomain"
        color="primary"
        size="large"
        prepend-icon="mdi-plus"
        @click="openDomainDialog"
        class="text-none me-3"
        elevation="0"
      >
        Nouveau Domaine
      </v-btn>

      <v-btn
        v-if="selectedDomain"
        color="primary"
        size="large"
        prepend-icon="mdi-plus"
        @click="openFormationDialog"
        class="text-none"
        elevation="0"
      >
        Nouvelle Formation
      </v-btn>
    </div>

    <!-- Vue des domaines -->
    <div v-if="!selectedDomain">
      <v-row>
        <v-col
          v-for="domain in domains"
          :key="domain.id"
          cols="12"
          md="6"
          lg="4"
        >
          <v-card
            class="domain-card h-100"
            :style="{ backgroundColor: '#252545', border: '1px solid #333366' }"
            elevation="0"
            @click="selectDomain(domain)"
          >
            <v-card-text class="pa-6 text-center">
              <v-avatar :color="domain.color" size="64" class="mb-4">
                <v-icon :icon="domain.icon" size="32" color="white" />
              </v-avatar>

              <h3 class="text-h6 font-weight-bold text-white mb-2">
                {{ domain.name }}
              </h3>

              <p class="text-grey-400 text-body-2 mb-4">
                {{ domain.description }}
              </p>

              <div class="d-flex justify-center align-center mb-3">
                <v-chip
                  :color="domain.color"
                  variant="outlined"
                  size="small"
                  class="me-2"
                >
                  {{ getFormationsCount(domain.id ?? 1) }} formations
                </v-chip>
                <v-chip color="grey" variant="outlined" size="small">
                  {{ getTotalCourses(domain.id ?? 1) }} cours
                </v-chip>
              </div>
            </v-card-text>

            <v-card-actions class="px-6 pb-6">
              <v-btn color="primary" variant="outlined" block class="text-none">
                Gérer les formations
              </v-btn>
            </v-card-actions>

            <!-- Menu d'actions pour le domaine -->
            <v-menu location="bottom end">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-dots-vertical"
                  variant="text"
                  size="small"
                  color="grey-lighten-1"
                  class="position-absolute"
                  style="top: 12px; right: 12px"
                  @click.stop
                />
              </template>
              <v-list :style="{ backgroundColor: '#252545' }">
                <v-list-item @click="editDomain(domain)">
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-pencil</v-icon>
                  </template>
                  <v-list-item-title class="text-white"
                    >Modifier</v-list-item-title
                  >
                </v-list-item>
                <v-list-item @click="deleteDomain(domain)" class="text-error">
                  <template v-slot:prepend>
                    <v-icon color="error">mdi-delete</v-icon>
                  </template>
                  <v-list-item-title>Supprimer</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Vue des formations d'un domaine -->
    <div v-else>
      <!-- Filtres pour les formations -->
      <v-row class="mb-6">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="searchQuery"
            placeholder="Rechercher une formation..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            :style="{ backgroundColor: '#252545' }"
            color="primary"
            class="custom-field"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="selectedStatus"
            :items="statusOptions"
            placeholder="Filtrer par statut"
            variant="outlined"
            hide-details
            :style="{ backgroundColor: '#252545' }"
            color="primary"
            clearable
            class="custom-field"
          >
            <template #prepend-item>
              <empty-card />
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" md="3">
          <v-btn
            color="primary"
            variant="outlined"
            block
            @click="resetFilters"
            class="text-none"
            height="56"
          >
            Réinitialiser
          </v-btn>
        </v-col>
      </v-row>

      <!-- Liste des formations -->
      <v-row>
        <v-col
          v-for="formation in filteredFormations"
          :key="formation.id"
          cols="12"
        >
          <v-card
            class="formation-item mb-4"
            :style="{ backgroundColor: '#252545', border: '1px solid #333366' }"
            elevation="0"
          >
            <v-card-text class="pa-6">
              <div class="d-flex align-start">
                <!-- Image de la formation -->
                <v-avatar size="80" rounded="lg" class="me-4 flex-shrink-0">
                  <v-img
                    v-if="formation.image !=''"
                    :src="String(formation.image)"
                    cover
                  />
                  <v-icon
                    v-else
                    :icon="selectedDomain.icon"
                    size="40"
                    :color="selectedDomain.color"
                  />
                </v-avatar>

                <!-- Contenu de la formation -->
                <div class="flex-grow-1">
                  <div class="d-flex align-center justify-space-between mb-2">
                    <div>
                      <h3 class="text-h6 font-weight-bold text-white mb-1">
                        {{ formation.title }}
                      </h3>
                      <p class="text-grey-400 text-body-2 mb-0">
                        {{ formation.description }}
                      </p>
                    </div>
                    <v-chip
                      :color="formation.active ? 'success' : 'error'"
                      variant="flat"
                      size="small"
                    >
                      {{ formation.active ? "Actif" : "Inactif" }}
                    </v-chip>
                  </div>

                  <!-- Statistiques -->
                  <div class="d-flex align-center mb-3">
                    <div class="d-flex align-center pr-3">
                      <v-icon size="small" color="grey-400" class="me-1">
                        mdi-book-multiple
                      </v-icon>
                      <span class="text-grey-400 text-caption">
                        {{ formation.courses ? formation.courses.length : 0 }}
                        cours
                      </span>
                    </div>
                    <div class="d-flex align-center pr-3">
                      <v-icon size="small" color="grey-400" class="me-1">
                        mdi-clock-outline
                      </v-icon>
                      <span class="text-grey-400 text-caption">
                        ~
                        {{
                          (formation.courses ? formation.courses.length : 0) * 5
                        }}
                        min
                      </span>
                    </div>
                    <div class="d-flex align-center">
                      <v-icon size="small" color="grey-400" class="me-1">
                        mdi-calendar
                      </v-icon>
                      <span class="text-grey-400 text-caption">
                        {{
                          formation.created_at
                            ? formatDateFirstType(formation.created_at)
                            : "Not Initialized..."
                        }}
                      </span>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="d-flex gap-2">
                    <v-btn
                      color="primary"
                      variant="outlined"
                      size="small"
                      prepend-icon="mdi-eye"
                      @click="viewFormation(formation)"
                      class="text-none"
                    >
                      Voir les cours
                    </v-btn>
                    <v-btn
                      color="primary"
                      variant="text"
                      size="small"
                      prepend-icon="mdi-pencil"
                      @click="editFormation(formation)"
                      class="text-none"
                    >
                      Modifier
                    </v-btn>
                    <v-btn
                      :color="formation.active ? 'warning' : 'success'"
                      variant="text"
                      size="small"
                      :prepend-icon="
                        formation.active ? 'mdi-pause' : 'mdi-play'
                      "
                      @click="toggleFormationStatus(formation)"
                      class="text-none"
                    >
                      {{ formation.active ? "Désactiver" : "Activer" }}
                    </v-btn>
                    <v-btn
                      color="error"
                      variant="text"
                      size="small"
                      prepend-icon="mdi-delete"
                      @click="deleteFormation(formation)"
                      class="text-none"
                    >
                      Supprimer
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Message si aucune formation -->
      <div v-if="domainFormations.length === 0" class="text-center py-12">
        <v-icon size="64" color="grey-darken-1" class="mb-4">
          mdi-school-outline
        </v-icon>
        <h3 class="text-h5 text-white mb-2">
          Aucune formation dans ce domaine
        </h3>
        <p class="text-grey-400 mb-4">
          Commencez par créer votre première formation dans le domaine "{{
            selectedDomain.name
          }}".
        </p>
        <v-btn
          color="primary"
          size="large"
          prepend-icon="mdi-plus"
          @click="openFormationDialog"
          class="text-none"
        >
          Créer une formation
        </v-btn>
      </div>
    </div>

    <!-- Dialog pour créer/modifier un domaine -->
    <TrainingsAddDomainDialog
      v-model:model-current-domain-value="domainForm"
      v-model:model-add-domain-value="domainDialog"
    />

    <!-- Dialog pour créer/modifier une formation -->
    <TrainingsAddTrainingDialog
      v-model:model-add-training-value="formationDialog"
      v-model:model-current-training-value="formationForm"
      :domainId="selectedDomain?.id ?? 1"
    />

    <!-- Dialog qui permet d'afficher les blocus... -->
    <TrainingsNotDeleted v-model="dialogDelete" />
  </v-container>
</template>

<style scoped>
.formations-admin {
  background-color: #1a1a2e;
  min-height: 100vh;
}

.domain-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.domain-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.formation-item {
  transition: all 0.2s ease;
}

.formation-item:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.position-absolute {
  position: absolute;
}

.custom-field :deep(.v-field) {
  color: white;
}

.custom-field :deep(.v-field-label) {
  color: #888;
}
</style>
