<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { rawCoursesConstants } from "~/constants/courses.constant";
import { formatCourseContent } from "~/helpers/utils";
import useAuthStore from "~/stores/auth.store";
import useCoursesStore from "~/stores/courses.store";
import type { SubCoursesInterface } from "~/types/courses.type";

// Composables
const route = useRoute();
const router = useRouter();
const coursesStore = useCoursesStore();
const { me } = useAuthStore();

// State
const currentCourse = ref<number>(0);
const courses = ref<SubCoursesInterface[]>([]);
const showFinishDialog = ref(false);
const loading = ref(true);

// Methods

const nextCourse = async () => {
  if (currentCourse.value < courses.value.length - 1) {
    if (courses.value[currentCourse.value].id) {
      await coursesStore.completeCourse(
        courses.value[currentCourse.value].id ?? 1
      );
    }
    currentCourse.value++;
  }
};

const previousCourse = () => {
  if (currentCourse.value > 0) {
    currentCourse.value--;
  }
};

const goToCourse = (index: number) => {
  currentCourse.value = index;
};

const finishCourse = async () => {
  if (courses.value[currentCourse.value].id) {
    await coursesStore.completeCourse(
      courses.value[currentCourse.value].id ?? 1
    );
  }
  showFinishDialog.value = true;
};

const redirectToPractice = () => {
  router.push("/practice");
};

const getDifficultyLevel = () => {
  const level = coursesStore.active_level;
  const levels = {
    beginner: { color: "teal-darken-1", icon: "mdi-star", text: "Débutant" },
    intermediate: {
      color: "orange",
      icon: "mdi-star-half-full",
      text: "Intermédiaire",
    },
    advanced: { color: "red", icon: "mdi-star-circle", text: "Avancé" },
  };
  return levels[level] || levels.beginner;
};

// Lifecycle
onMounted(async () => {
  try {
    loading.value = true;
    coursesStore.setActiveTraining(Number(route.params.id));
    await coursesStore.getFormationsCoursesSubscription();
    // Simuler un appel API
    await new Promise((resolve) => setTimeout(resolve, 800));
    courses.value = coursesStore.courses_sub.map((course) => ({
      ...course,
      content: formatCourseContent(course.content),
    }));
  } catch (error) {
    console.error("Erreur lors du chargement des cours:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="cours-container">
    <!-- Header avec progression -->
    <div class="cours-header">
      <div class="progress-section">
        <div class="progress-info">
          <span class="progress-text"
            >Cours {{ courses.length ? currentCourse + 1 : 0 }} sur
            {{ courses.length }}</span
          >
          <span class="progress-percentage"
            >{{
              courses.length
                ? Math.round(((currentCourse + 1) / courses.length) * 100)
                : 0
            }}%</span
          >
        </div>
        <v-progress-linear
          :model-value="((currentCourse + 1) / courses.length) * 100"
          color="cyan"
          height="6"
          rounded
          class="mt-3"
        ></v-progress-linear>
      </div>
    </div>

    <!-- Contenu du cours -->
    <div v-if="courses.length > 0" class="cours-content">
      <!-- Titre du cours -->
      <h1 class="cours-title">{{ courses[currentCourse].title }}</h1>

      <!-- Image du cours -->
      <div class="cours-image-container">
        <img
          :src="courses[currentCourse].image"
          :alt="courses[currentCourse].title"
          class="cours-image"
        />
        <div class="image-overlay">
          <v-chip
            :color="getDifficultyLevel().color"
            variant="flat"
            size="small"
            class="difficulty-chip"
          >
            <v-icon start size="16">{{ getDifficultyLevel().icon }}</v-icon>
            {{ getDifficultyLevel().text }}
          </v-chip>
        </div>
      </div>

      <!-- Contenu du cours -->
      <div class="cours-body">
        <div
          class="cours-content-text"
          v-html="courses[currentCourse].content"
        ></div>
      </div>
    </div>

    <!-- Loading -->
    <div v-else class="loading-container">
      <div class="loading-spinner">
        <v-progress-circular
          indeterminate
          size="48"
          color="cyan"
          width="3"
        ></v-progress-circular>
      </div>
      <p class="loading-text">Chargement des cours...</p>
    </div>

    <!-- Navigation -->
    <div class="cours-navigation">
      <v-btn
        :disabled="currentCourse === 0"
        @click="previousCourse"
        color="grey-darken-1"
        variant="outlined"
        size="large"
        class="nav-btn"
      >
        <v-icon start>mdi-chevron-left</v-icon>
        Précédent
      </v-btn>

      <!-- Pagination dots -->
      <div class="pagination-dots">
        <div
          v-for="(course, index) in courses"
          :key="index"
          @click="goToCourse(index)"
          :class="['dot', { active: index === currentCourse }]"
        ></div>
      </div>

      <v-btn
        v-if="currentCourse < courses.length - 1"
        @click="nextCourse"
        color="cyan"
        variant="flat"
        size="large"
        class="nav-btn"
      >
        Suivant
        <v-icon end>mdi-chevron-right</v-icon>
      </v-btn>

      <!-- Bouton de fin -->
      <v-btn
        v-else
        @click="finishCourse"
        color="success"
        variant="flat"
        size="large"
        class="nav-btn finish-btn"
      >
        Terminer
        <v-icon end>mdi-check</v-icon>
      </v-btn>
    </div>

    <!-- Dialog de fin -->
    <v-dialog v-model="showFinishDialog" max-width="450" class="finish-dialog">
      <v-card class="dialog-card">
        <v-card-title class="dialog-title">
          <div class="success-icon">
            <v-icon color="success" size="32">mdi-check-circle</v-icon>
          </div>
          <span>Formation terminée !</span>
        </v-card-title>
        <v-card-text class="dialog-text">
          Félicitations ! Vous avez terminé cette formation. Prêt à passer aux
          exercices pratiques ?
        </v-card-text>
        <v-card-actions class="dialog-actions">
          <v-btn @click="showFinishDialog = false" variant="text" color="grey">
            Rester ici
          </v-btn>
          <v-btn @click="redirectToPractice" color="cyan" variant="flat">
            Commencer les exercices
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.cours-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  color: #e2e8f0;
  padding: 20px;
}

.cours-header {
  margin-bottom: 30px;
}

.progress-section {
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.progress-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: #06b6d4;
}

.progress-percentage {
  font-size: 1.2rem;
  font-weight: 600;
  color: #06b6d4;
}

.cours-content {
  max-width: 900px;
  margin: 0 auto;
}

.cours-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 30px;
  color: #f1f5f9;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.cours-image-container {
  position: relative;
  margin-bottom: 30px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.cours-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  filter: brightness(0.8);
}

.image-overlay {
  position: absolute;
  top: 20px;
  right: 20px;
}

.difficulty-chip {
  backdrop-filter: blur(8px);
  background: rgba(0, 0, 0, 0.7) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.cours-body {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 40px;
  backdrop-filter: blur(10px);
}

.cours-content-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #cbd5e1;
}

.cours-content-text h3 {
  color: #06b6d4;
  font-size: 1.5rem;
  margin: 30px 0 15px 0;
  font-weight: 600;
}

.cours-content-text p {
  margin-bottom: 20px;
}

.cours-content-text ul {
  margin: 15px 0;
  padding-left: 20px;
}

.cours-content-text li {
  margin-bottom: 8px;
  color: #94a3b8;
}

.warning-box {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 15px;
  margin: 20px 0;
  color: #fca5a5;
}

.tip-box {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  padding: 15px;
  margin: 20px 0;
  color: #93c5fd;
}

.success-box {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 8px;
  padding: 15px;
  margin: 20px 0;
  color: #86efac;
}

.loading-container {
  text-align: center;
  padding: 80px 20px;
}

.loading-spinner {
  margin-bottom: 20px;
}

.loading-text {
  font-size: 1.2rem;
  color: #64748b;
}

.cours-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.nav-btn {
  min-width: 120px;
  height: 48px;
  font-weight: 600;
  text-transform: none;
  border-radius: 8px;
}

.finish-btn {
  background: linear-gradient(135deg, #10b981, #059669) !important;
}

.pagination-dots {
  display: flex;
  gap: 12px;
  align-items: center;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(148, 163, 184, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: #06b6d4;
  transform: scale(1.2);
  box-shadow: 0 0 8px rgba(6, 182, 212, 0.5);
}

.dot:hover {
  background: rgba(6, 182, 212, 0.7);
}

.dialog-card {
  background: #1e293b !important;
  border: 1px solid rgba(6, 182, 212, 0.3);
}

.dialog-title {
  display: flex;
  align-items: center;
  gap: 15px;
  color: #f1f5f9;
  font-size: 1.5rem;
  padding: 25px;
}

.success-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: rgba(34, 197, 94, 0.2);
  border-radius: 50%;
}

.dialog-text {
  color: #cbd5e1;
  font-size: 1.1rem;
  line-height: 1.6;
  padding: 0 25px 20px;
}

.dialog-actions {
  padding: 20px 25px;
  justify-content: flex-end;
  gap: 15px;
}

@media (max-width: 768px) {
  .cours-container {
    padding: 15px;
  }

  .cours-title {
    font-size: 2rem;
  }

  .cours-body {
    padding: 25px;
  }

  .cours-navigation {
    flex-direction: column;
    gap: 20px;
  }

  .nav-btn {
    width: 100%;
    max-width: 250px;
  }

  .cours-image {
    height: 200px;
  }
}
</style>
