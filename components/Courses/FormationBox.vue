<script setup lang="ts">
import useCoursesStore from "~/stores/courses.store";
import type { CategoryType } from "~/types/courses.type";
import type { Formation } from "~/types/trainings.type";

const coursesStore = useCoursesStore();

const categories = ref<CategoryType[]>([]);

// Type pour propriétés
type PropsType = {
  formation: Formation;
  handleClick: (id: number, name: string) => void;
};

// Definitions des propriété du composant
const props = defineProps<PropsType>();

// methodes...
function getCategoryColor(category: string): string {
  const index = categories.value?.findIndex((u) => u.value == category);
  if (index && index != -1) {
    return categories.value[index].color;
  }
  return "blue";
}

function getLevelColor(level: string): string {
  const colors: Record<string, string> = {
    beginner: "success",
    intermediate: "warning",
    advanced: "error",
  };
  return colors[level] || "grey";
}

function viewFormation(formation: Formation) {
  props.handleClick(formation.id ?? 1, formation.title);
}

onMounted(() => {
  categories.value = coursesStore.getCategories;
});
</script>

<template>
  <v-col cols="12" md="6" lg="6">
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
        :src="String(formation.image)"
        height="180"
        cover
        class="formation-image"
      >
        <div class="d-flex align-end fill-height">
          <div class="gradient-overlay w-100 pa-4">
            <v-chip
              :color="getCategoryColor(formation.categorie)"
              size="small"
              variant="flat"
              class="mb-2"
            >
              {{ formation.categorie }}
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

        <!-- Informations de la formation et Niveau de difficulté -->
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon size="small" class="me-1">mdi-clock-outline</v-icon>
            <span class="text-caption"
              >{{
                formation.courses ? formation.courses?.length * 5 : 0
              }}
              min</span
            >
          </div>
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
        </div>
      </v-card-text>
    </v-card>
  </v-col>
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
  z-index: 999;
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
