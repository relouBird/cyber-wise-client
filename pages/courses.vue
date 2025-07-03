<script lang="ts" setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import useCoursesStore from "~/stores/courses.store";
import type { CategoryType } from "~/types/courses.type";

// Définir le Middleware à utiliser
definePageMeta({
  middleware: ["auth", "user"],
  layout: "default",
});

// Meta tags
useHead({
  title: "Tableau de bords Entreprise - SafeSteps",
  meta: [{ name: "description", content: "Tableau de bords SafeSteps" }],
});

const router = useRouter();
const coursesStore = useCoursesStore();

const searchQuery = ref("");
const selectedCategory = ref<string | null>(null);
const selectedLevel = ref<string | null>(null);
const currentPage = ref(1);
const itemsPerPage = 9;

const categories = ref<CategoryType[]>([]);

const levels = [
  { title: "D\u00e9butant", value: "beginner" },
  { title: "Interm\u00e9diaire", value: "intermediate" },
  { title: "Avanc\u00e9", value: "advanced" },
];

const formations = ref([
  {
    id: 1,
    title: "Cr\u00e9er des mots de passe forts",
    description:
      "Apprenez \u00e0 cr\u00e9er et g\u00e9rer des mots de passe s\u00e9curis\u00e9s pour prot\u00e9ger vos comptes en ligne.",
    category: "passwords",
    level: "beginner",
    duration: "45 min",
    enrolledCount: 124,
    progress: 0,
    active: true,
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop",
  },
  {
    id: 2,
    title: "Identifier les tentatives de phishing",
    description:
      "Reconnaissez et \u00e9vitez les emails et sites web malveillants qui tentent de voler vos informations.",
    category: "phishing",
    level: "beginner",
    duration: "30 min",
    enrolledCount: 89,
    progress: 65,
    active: true,
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop",
  },
  {
    id: 3,
    title: "Navigation s\u00e9curis\u00e9e sur Internet",
    description:
      "D\u00e9couvrez les bonnes pratiques pour naviguer en toute s\u00e9curit\u00e9 sur le web.",
    category: "browsing",
    level: "intermediate",
    duration: "60 min",
    enrolledCount: 156,
    progress: 0,
    active: true,
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=200&fit=crop",
  },
  {
    id: 4,
    title: "S\u00e9curit\u00e9 sur les r\u00e9seaux sociaux",
    description:
      "Prot\u00e9gez votre vie priv\u00e9e et vos donn\u00e9es sur Facebook, Instagram, Twitter et autres plateformes.",
    category: "social",
    level: "beginner",
    duration: "40 min",
    enrolledCount: 203,
    progress: 25,
    active: true,
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=200&fit=crop",
  },
  {
    id: 5,
    title: "Protection des donn\u00e9es personnelles",
    description:
      "Comprenez vos droits et apprenez \u00e0 prot\u00e9ger efficacement vos informations personnelles.",
    category: "privacy",
    level: "intermediate",
    duration: "75 min",
    enrolledCount: 67,
    progress: 0,
    active: false,
    image:
      "https://images.unsplash.com/photo-1563207153-f403bf289096?w=400&h=200&fit=crop",
  },
  {
    id: 6,
    title: "S\u00e9curit\u00e9 des appareils mobiles",
    description:
      "S\u00e9curisez vos smartphones et tablettes contre les menaces et les applications malveillantes.",
    category: "mobile",
    level: "advanced",
    duration: "90 min",
    enrolledCount: 45,
    progress: 100,
    active: true,
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop",
  },
]);

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
      (formation) => formation.category === selectedCategory.value
    );
  }

  if (selectedLevel.value) {
    filtered = filtered.filter(
      (formation) => formation.level === selectedLevel.value
    );
  }

  return filtered;
});

const totalFormations = computed(() => formations.value.length);
const totalPages = computed(() =>
  Math.ceil(filteredFormations.value.length / itemsPerPage)
);

function getCategoryColor(category: string): string {
  const index = categories.value?.findIndex((u) => u.value == category);
  if (index && index != -1) {
    return categories.value[index].color;
  }
  return "grey";
}

function getLevelColor(level: string): string {
  const colors: Record<string, string> = {
    beginner: "success",
    intermediate: "warning",
    advanced: "error",
  };
  return colors[level] || "grey";
}

function resetFilters() {
  searchQuery.value = "";
  selectedCategory.value = null;
  selectedLevel.value = null;
}

function openCreateDialog() {
  console.log("Ouvrir la modal de cr\u00e9ation de formation");
}

function viewFormation(formation: any) {
  router.push(`/formations/${formation.id}`);
}

function startFormation(formation: any) {
  router.push(`/formations/${formation.id}/start`);
}

function editFormation(formation: any) {
  console.log("\u00c9diter la formation:", formation.title);
}

function duplicateFormation(formation: any) {
  console.log("Dupliquer la formation:", formation.title);
}

function toggleFormationStatus(formation: any) {
  formation.active = !formation.active;
}

function deleteFormation(formation: any) {
  if (
    confirm(
      `\u00cates-vous s\u00fbr de vouloir supprimer la formation "${formation.title}" ?`
    )
  ) {
    const index = formations.value.findIndex((f) => f.id === formation.id);
    if (index > -1) {
      formations.value.splice(index, 1);
    }
  }
}

onMounted(async () => {
  if (coursesStore.getCategories.length != 0) {
    categories.value = coursesStore.getCategories;
  } else {
    await coursesStore.getAllCategories();
    categories.value = coursesStore.getCategories;
  }
});
</script>

<template>
  <v-container fluid class="pa-6">
    <!-- En-tête de la page -->
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold text-white mb-2">
        Formations disponibles
      </h1>
      <p class="text-grey-lighten-1 text-body-1">
        {{ totalFormations }} formations au total
      </p>
    </div>

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
      <v-col
        v-for="formation in filteredFormations"
        :key="formation.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card
          class="formation-card h-100"
          :class="{ 'card-disabled': !formation.active, 'bg-fontcolor': true }"
          elevation="2"
          @click="viewFormation(formation)"
        >
          <!-- Badge de statut -->
          <div class="position-absolute top-0 right-0 ma-3">
            <v-chip
              :color="formation.active ? 'success' : 'error'"
              size="small"
              variant="flat"
            >
              {{ formation.active ? "Actif" : "Inactif" }}
            </v-chip>
          </div>

          <!-- Image de la formation -->
          <v-img
            :src="formation.image"
            height="180"
            cover
            class="formation-image"
          >
            <div class="d-flex align-end fill-height">
              <div class="gradient-overlay w-100 pa-4">
                <v-chip
                  :color="getCategoryColor(formation.category)"
                  size="small"
                  variant="flat"
                  class="mb-2"
                >
                  {{ formation.category }}
                </v-chip>
              </div>
            </div>
          </v-img>

          <v-card-text class="pb-2">
            <h3 class="text-h6 font-weight-bold mb-2">
              {{ formation.title }}
            </h3>
            <p class="text-body-2 text-grey-lighten-1 mb-3">
              {{ formation.description }}
            </p>

            <!-- Informations de la formation -->
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="d-flex align-center">
                <v-icon size="small" class="me-1">mdi-clock-outline</v-icon>
                <span class="text-caption">{{ formation.duration }}</span>
              </div>
              <div class="d-flex align-center">
                <v-icon size="small" class="me-1">mdi-account-multiple</v-icon>
                <span class="text-caption"
                  >{{ formation.enrolledCount }} inscrits</span
                >
              </div>
            </div>

            <!-- Niveau de difficulté -->
            <div class="d-flex align-center mb-3">
              <v-icon size="small" class="me-2">mdi-signal</v-icon>
              <v-chip
                :color="getLevelColor(formation.level)"
                size="small"
                variant="outlined"
              >
                {{ formation.level }}
              </v-chip>
            </div>

            <!-- Progress bar si formation commencée -->
            <div v-if="formation.progress > 0" class="mb-3">
              <div class="d-flex justify-space-between align-center mb-1">
                <span class="text-caption">Progression</span>
                <span class="text-caption">{{ formation.progress }}%</span>
              </div>
              <v-progress-linear
                :model-value="formation.progress"
                color="primary"
                height="6"
                rounded
              />
            </div>
          </v-card-text>

          <v-card-actions class="pt-0">
            <v-btn
              :color="formation.progress > 0 ? 'primary' : 'success'"
              variant="flat"
              block
              class="text-none"
              @click.stop="startFormation(formation)"
            >
              {{ formation.progress > 0 ? "Continuer" : "Commencer" }}
            </v-btn>
          </v-card-actions>

          <!-- Menu d'actions -->
          <v-menu location="bottom end">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-dots-vertical"
                variant="text"
                size="small"
                class="position-absolute"
                style="top: 8px; right: 60px"
                @click.stop
              />
            </template>
            <v-list bg-color="surface">
              <v-list-item @click="viewFormation(formation)">
                <template v-slot:prepend>
                  <v-icon>mdi-eye</v-icon>
                </template>
                <v-list-item-title>Voir les détails</v-list-item-title>
              </v-list-item>
              <v-list-item @click="editFormation(formation)">
                <template v-slot:prepend>
                  <v-icon>mdi-pencil</v-icon>
                </template>
                <v-list-item-title>Modifier</v-list-item-title>
              </v-list-item>
              <v-list-item @click="duplicateFormation(formation)">
                <template v-slot:prepend>
                  <v-icon>mdi-content-copy</v-icon>
                </template>
                <v-list-item-title>Dupliquer</v-list-item-title>
              </v-list-item>
              <v-divider />
              <v-list-item
                @click="toggleFormationStatus(formation)"
                :class="formation.active ? 'text-error' : 'text-success'"
              >
                <template v-slot:prepend>
                  <v-icon>{{
                    formation.active ? "mdi-pause" : "mdi-play"
                  }}</v-icon>
                </template>
                <v-list-item-title>
                  {{ formation.active ? "Désactiver" : "Activer" }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="deleteFormation(formation)"
                class="text-error"
              >
                <template v-slot:prepend>
                  <v-icon>mdi-delete</v-icon>
                </template>
                <v-list-item-title>Supprimer</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-card>
      </v-col>
    </v-row>

    <!-- Message si aucune formation -->
    <v-row v-if="filteredFormations.length === 0">
      <v-col cols="12" class="text-center py-12">
        <v-icon size="64" color="grey-darken-1" class="mb-4">
          mdi-school-outline
        </v-icon>
        <h3 class="text-h5 mb-2">Aucune formation trouvée</h3>
        <p class="text-grey-lighten-1 mb-4">
          {{
            searchQuery || selectedCategory || selectedLevel
              ? "Essayez de modifier vos critères de recherche."
              : "Commencez par créer votre première formation."
          }}
        </p>
        <v-btn
          color="primary"
          size="large"
          @click="openCreateDialog"
          class="text-none"
        >
          Créer une formation
        </v-btn>
      </v-col>
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
  </v-container>
</template>

<style scoped>
.formation-card {
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.formation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.card-disabled {
  opacity: 0.6;
}

.formation-image {
  position: relative;
}

.gradient-overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
}

.position-absolute {
  position: absolute;
}

.top-0 {
  top: 0;
}
.right-0 {
  right: 0;
}
.fill-height {
  height: 100%;
}
.w-100 {
  width: 100%;
}
</style>
