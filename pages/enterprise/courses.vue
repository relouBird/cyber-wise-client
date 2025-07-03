<script lang="ts" setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { formationsConstants } from "~/constants/courses.constant";
import useCoursesStore from "~/stores/courses.store";
import useTrainingsStore from "~/stores/trainings.store";
import type { CategoryType } from "~/types/courses.type";
import type { Course, Formation } from "~/types/trainings.type";

// Définir le Middleware à utiliser
definePageMeta({
  middleware: ["auth", "user"],
  layout: "admin",
});

// Meta tags
useHead({
  title: "Cours Entreprise - SafeSteps",
  meta: [{ name: "description", content: "Tableau de bords SafeSteps" }],
});

const coursesStore = useCoursesStore();
const trainingStore = useTrainingsStore();

// modal...
const openModal = ref(false);
const openCourseModal = ref(false);

const categories = ref<CategoryType[]>([]);
const courses = ref(coursesStore.getCourses);
const currentCourse = ref<Course | null>(null);
const idState = ref<number>();

const totalCourses = computed(() => coursesStore.getCourses.length);
const stateCourse = computed(
  () =>
    coursesStore.active_training == null && coursesStore.getCourses.length == 0
);

function openCreateDialog() {
  if (stateCourse.value == true) {
    openModal.value = true;
  } else {
    openCourseModal.value = true;
  }
}

function setCourse(id: number, state?: boolean, deleteState?: boolean) {
  currentCourse.value = courses.value.filter((u) => u.id == id)[0];
  if (!state) {
    console.log("course-id-", id);
    openCourseModal.value = true;
  }

  if (deleteState) {
    console.log("course-id-delete-to-", id);
    idState.value = id;
  }
}

onMounted(async () => {
  if (coursesStore.getCategories.length != 0) {
    console.log("domains-out =>", trainingStore.getDomains);
    categories.value = coursesStore.getCategories;
  } else if (
    coursesStore.getCategories.length == 0 &&
    trainingStore.getDomains.length
  ) {
    await coursesStore.getAllCategories(trainingStore.getDomains);
    categories.value = coursesStore.getCategories;
  } else {
    await trainingStore.getAllDomains();
    await coursesStore.getAllCategories(trainingStore.getDomains);
    categories.value = coursesStore.getCategories;
  }

  if (coursesStore.active_training != null) {
    // courses.value = [...coursesStore.getCourses];
  }
});

watch(
  () => coursesStore.getCourses,
  (newValue) => {
    courses.value = coursesStore.getCourses;
  }
);
</script>

<template>
  <v-container fluid class="pa-6">
    <!-- En-tête de la page -->
    <div class="d-flex justify-space-between align-center">
      <div class="mb-6">
        <h1 class="font-weight-bold text-white">
          Cours {{ coursesStore.getName }}
        </h1>
        <p
          class="text-grey-lighten-1 text-body-1 pt-2 ga-3 d-flex align-center"
        >
          <span>{{ totalCourses }} cours au total</span>
          <span v-if="coursesStore.active_training">
            <v-btn
              @click="openModal = true"
              color="primary"
              variant="tonal"
              class="text-none"
            >
              Selectionner une autre formation
            </v-btn>
          </span>
        </p>
      </div>
      <v-btn color="primary" @click="openCreateDialog" class="text-none mb-4">
        {{ stateCourse ? "Selectionner une formation" : "Créer un Cours" }}
      </v-btn>
    </div>

    <v-divider></v-divider>

    <v-row class="pt-3">
      <courses-course-box
        v-for="course in courses"
        :course="course"
        :handle-click="setCourse"
      />
    </v-row>

    <!-- Message si aucune formation -->
    <v-row
      v-if="
        coursesStore.active_training == null ||
        coursesStore.getCourses.length == 0
      "
      class="pt-12"
    >
      <v-col cols="12" class="text-center pt-12">
        <v-icon size="64" color="grey-darken-1" class="mb-4">
          mdi-book-open-outline
        </v-icon>
        <h3 class="text-h5 mb-2">Aucune Cours trouvé</h3>
        <p class="text-grey-lighten-1 mb-4">
          {{
            stateCourse
              ? "Commencez par choisir une formation à observer."
              : "Commencez par créer un cours pour vos utilisateurs"
          }}
        </p>
        <v-btn
          color="primary"
          size="large"
          @click="openCreateDialog"
          class="text-none"
        >
          {{ stateCourse ? "Selectionner une formation" : "Créer un Cours" }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- Modal pour choisir la formation à suivre... -->
    <courses-select-formation-modal v-model:model-value="openModal" />

    <!-- Modal pour confirmer la suppression d'un cours... -->
    <courses-confirm-delete v-model:model-value="idState" />

    <!-- Modal pour ajouter un cours... -->
    <courses-add-courses-dialog
      v-model:model-current-course-value="currentCourse"
      v-model:model-add-course-value="openCourseModal"
    />
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
