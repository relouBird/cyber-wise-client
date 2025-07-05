<script setup lang="ts">
import useCoursesStore from "~/stores/courses.store";
import useTrainingsStore from "~/stores/trainings.store";
import type { CategoryType } from "~/types/courses.type";
import type { Formation } from "~/types/trainings.type";

// Type pour propriétés
type PropsType = {
  modelValue: boolean;
};

// Definitions des propriété du composant
const props = defineProps<PropsType>();

// Definitions des Evenements du composant
const emit = defineEmits(["update:modelValue"]);

const trainingsStore = useTrainingsStore();
const coursesStore = useCoursesStore();

const searchQuery = ref("");
const selectedCategory = ref<string | null>(null);
const selectedLevel = ref<string | null>(null);
const currentPage = ref(1);
const itemsPerPage = 9;

const formations = ref<Formation[]>([]);
const categories = ref<CategoryType[]>([]);

const levels = [
  { title: "D\u00e9butant", value: "beginner" },
  { title: "Interm\u00e9diaire", value: "intermediate" },
  { title: "Avanc\u00e9", value: "advanced" },
];

const totalTrainings = computed(() => trainingsStore.getTrainings.length);

const filteredFormations = computed(() => {
  let filtered = formations.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (formation) =>
        formation.title.toLowerCase().includes(query) ||
        formation.description.toLowerCase().includes(query)
    );
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(
      (formation) => formation.categorie === selectedCategory.value
    );
  }

  if (selectedLevel.value) {
    filtered = filtered.filter(
      (formation) => formation.level === selectedLevel.value
    );
  }

  return filtered;
});

function resetFilters() {
  searchQuery.value = "";
  selectedCategory.value = null;
  selectedLevel.value = null;
}

function setFormation(id: number, name: string) {
  coursesStore.setActiveTraining(id);
  coursesStore.setNameTraining(name);
  coursesStore.getFormationCourses(id);
  emit("update:modelValue", false);
}

function closeDomainDialog() {
  emit("update:modelValue", false);
}

const totalPages = computed(() =>
  Math.ceil(filteredFormations.value.length / itemsPerPage)
);

onMounted(async () => {
  categories.value = coursesStore.getCategories;

  if (totalTrainings.value) {
    formations.value = trainingsStore.getTrainings;
  } else {
    await trainingsStore.getAllTraining();
    formations.value = trainingsStore.getTrainings;
  }
});


</script>

<template>
  <!-- Dialog pour créer/modifier un domaine -->
  <v-dialog
    v-model="props.modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    max-width="1000"
    min-height="600"
    max-height="600"
  >
    <v-card :style="{ backgroundColor: '#252545' }">
      <v-card-title
        class="text-white pt-3 d-flex justify-space-between align-center"
      >
        <h5 class="text-h5 font-weight-bold text-white mb-2">
          Formations disponibles
        </h5>
        <v-btn
          icon="mdi-close opacity-50"
          @click="closeDomainDialog"
          variant="text"
        ></v-btn>
      </v-card-title>

      <v-card-text class="pt-0">
        <!-- Barre de filtres -->
        <v-card class="mb-6 bg-fontcolor">
          <v-card-text>
            <v-row align="center">
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="searchQuery"
                  placeholder="Rechercher une formation"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="selectedCategory"
                  :items="categories"
                  placeholder="Filtrer par catégorie"
                  variant="outlined"
                  class="bg-fontcolor"
                  density="compact"
                  hide-details
                  clearable
                >
                  <template #prepend-item>
                    <empty-card />
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="selectedLevel"
                  :items="levels"
                  placeholder="Filtrer par niveau"
                  variant="outlined"
                  hide-details
                  class="bg-fontcolor"
                  density="compact"
                  clearable
                >
                  <template #prepend-item>
                    <empty-card />
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" md="2">
                <v-btn
                  color="primary"
                  variant="outlined"
                  block
                  @click="resetFilters"
                  class="text-none"
                >
                  Réinitialiser
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Grille des formations -->
        <v-row>
          <courses-formation-box
            v-for="formation in filteredFormations"
            :formation="formation"
            :handle-click="setFormation"
          />
        </v-row>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="d-flex justify-center mt-6">
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="7"
            color="primary"
          />
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
