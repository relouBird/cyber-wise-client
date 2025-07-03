<script setup lang="ts">
import useCoursesStore from "~/stores/courses.store";
import type { CategoryType } from "~/types/courses.type";
import type { Course } from "~/types/trainings.type";

const coursesStore = useCoursesStore();

const categories = ref<CategoryType[]>([]);

// Type pour propriétés
type PropsType = {
  course: Course;
  handleClick: (id: number, state?: boolean, deleteState?: boolean) => void;
};

// Definitions des propriété du composant
const props = defineProps<PropsType>();

const imageLink = ref<string>("");

// methodes...
function viewCourse(course: Course) {
  props.handleClick(course.id ?? 1, true);
}
// methodes...
function editCourse(course: Course) {
  console.log("course-id-", course.id);
  props.handleClick(course.id ?? 1);
}

async function deleteCourse(id: number) {
  console.log("delete-to =>", id);
  props.handleClick(id, true, true);
}

onMounted(() => {
  categories.value = coursesStore.getCategories;
  if (typeof props.course.image == "object") {
    let det = "";
    const reader = new FileReader();
    reader.readAsDataURL(props.course.image as File);
    reader.onload = () => {
      det = reader.result as string;
    };
    imageLink.value = det;
  } else {
    imageLink.value = props.course.image as string;
  }
});
</script>

<template>
  <v-col cols="12" md="6" lg="3">
    <v-card
      class="formation-card bg-fontcolor h-100"
      elevation="2"
      @click="viewCourse(course)"
    >
      <!-- Badge de statut -->
      <div class="position-absolute top-0 right-0 ma-3">
        <!-- On va mettre le necessaire pour modifier et supprimer -->
      </div>

      <!-- Image de la formation -->
      <v-img
        :src="imageLink"
        height="140"
        cover
        class="formation-image"
      >
        <div class="d-flex align-end fill-height">
          <div class="gradient-overlay w-100 pa-4"></div>
        </div>
      </v-img>

      <v-card-text class="py-3">
        <h3 class="text-h6 font-weight-bold mb-1">Cours {{ course.order }}</h3>
        <p class="text-body-2 text-grey-lighten-1 mb-1">
          {{ course.title }}
        </p>
      </v-card-text>

      <!-- Menu d'actions -->
      <v-menu location="bottom end">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-dots-vertical"
            variant="text"
            size="small"
            class="position-absolute top-0 right-0"
            style="top: 8px; right: 60px"
            @click.stop
          />
        </template>
        <v-list bg-color="fontcolor">
          <v-list-item @click="editCourse(course)">
            <p class="d-flex align-center ga-3 opacity-80">
              <span><v-icon size="small">mdi-pencil</v-icon></span
              ><span class="pt-1">Voir les détails</span>
            </p>
          </v-list-item>
          <v-list-item
            @click="deleteCourse(course.id ?? 1)"
            class="text-red-darken-4"
          >
            <p class="d-flex align-center ga-3 opacity-80">
              <span><v-icon size="small">mdi-trash-can-outline</v-icon></span
              ><span class="pt-1">Supprimer</span>
            </p>
          </v-list-item>
        </v-list>
      </v-menu>
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
