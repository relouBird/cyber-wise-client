<script setup lang="ts">
import useAuthStore from "~/stores/auth.store";
import useCoursesStore from "~/stores/courses.store";
import useTrainingsStore from "~/stores/trainings.store";
import type { Course } from "~/types/trainings.type";

// Type pour propriétés
type PropsType = {
  modelCurrentCourseValue: Course | null;
  modelAddCourseValue: boolean;
};

// Definitions des propriété du composant
const props = defineProps<PropsType>();

// Definitions des Evenements du composant
const emit = defineEmits([
  "update:modelCurrentCourseValue",
  "update:modelAddCourseValue",
]);

// gerer la store...
const coursesStore = useCoursesStore();
const trainingsStore = useTrainingsStore();
const { me } = useAuthStore();

const imageFile = ref<File>();
const imageFileString = ref<string>();

// Formulaires
const formValid = ref(false);
const loading = ref(false);
const courseForm = ref<Course>({
  formation_id: coursesStore.active_training ?? 1,
  creator_id: String(me?.id),
  title: "",
  content: "",
  image: "",
  order: coursesStore.getCourses.length + 1,
});

// Règles de validation
const rules = {
  required: (value: string) => !!value || "Ce champ est requis",
  deserved: (value: string) =>
    value.length >= 80 || "Your Formation must have 88 letters...",
};

//methodes...
// ferme la dialogue...
const closeCourseDialog = () => {
  emit("update:modelAddCourseValue", false);
};

// cette fonction permet de sauvegarder le cours...
const saveCourse = async () => {
  loading.value = true;
  console.log("data =>", props.modelCurrentCourseValue);
  if (props.modelCurrentCourseValue) {
    // Modifier le domaine existant
    console.log("fou-1");
    await coursesStore.updateCourse(me?.id ?? "", courseForm.value);
    emit("update:modelCurrentCourseValue", null);
  } else {
    // Soumettre...
    console.log("fou-2");

    let idTake = await coursesStore.createCourse(
      me?.id ?? "",
      courseForm.value
    );

    const index = coursesStore.getCourses.findIndex((u) => u.id == idTake);

    if (index && index != -1) {
      trainingsStore.addCourseToTraining(
        coursesStore.active_training ?? 1,
        coursesStore.getCourses[index]
      );
    }
  }
  imageFile.value = undefined;
  imageFileString.value = undefined;
  loading.value = false;
  closeCourseDialog();
};

// un Observateur...
watch(
  () => props.modelCurrentCourseValue,
  (newValue) => {
    if (newValue) {
      courseForm.value = { ...newValue } as Course;
      imageFileString.value = newValue.image as string;
    } else {
      courseForm.value = {
        formation_id: coursesStore.active_training ?? 1,
        creator_id: String(me?.id),
        title: "",
        content: "",
        image: "",
        order: coursesStore.getCourses.length + 1,
      };
    }
  },
  { immediate: true }
);

// Watcher pour les fichiers d'image
watch(
  () => imageFile.value != undefined,
  (newFiles) => {
    if (newFiles && imageFile.value) {
      const file = imageFile.value;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        imageFileString.value = reader.result as string;
        courseForm.value.image = file;
      };
      console.log("data :", courseForm.value);
    } else {
      courseForm.value.image = undefined;
      imageFileString.value = "";
    }
  }
);
</script>

<template>
  <!-- Dialog pour créer/modifier un domaine -->
  <v-dialog
    v-model="props.modelAddCourseValue"
    @update:model-value="emit('update:modelAddCourseValue', $event)"
    max-width="750"
  >
    <v-card :style="{ backgroundColor: '#252545' }">
      <v-card-title class="text-white">
        {{
          modelCurrentCourseValue?.title != ""
            ? "Modifier le Cours"
            : "Nouveau Cours"
        }}
      </v-card-title>

      <v-card-text class="pb-0">
        <v-form v-model="formValid">
          <v-text-field
            v-model="courseForm.title"
            label="Nom du Cours"
            variant="outlined"
            :style="{ backgroundColor: '#1a1a2e' }"
            color="primary"
            :rules="[rules.required]"
            class="mb-4 custom-field"
            hide-details
          />

          <v-textarea
            v-model="courseForm.content"
            label="Description"
            variant="outlined"
            :style="{ backgroundColor: '#1a1a2e' }"
            color="primary"
            rows="4"
            :rules="[rules.required, rules.deserved]"
            class="mb-4 custom-field"
            hide-details
          />
          <v-file-input
            v-model="imageFile"
            label="Image de couverture (optionnel)"
            variant="outlined"
            color="primary"
            accept="image/*"
            prepend-icon="mdi-camera"
            name="image"
            :rules="[rules.required]"
            class="mb-4 pl-1 custom-field bg-fontcolorSecond"
            hide-details
          />

          <!-- Prévisualisation de l'image -->
          <div v-if="courseForm.image">
            <v-img :src="imageFileString" max-height="200" class="rounded" />
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions class="px-6 pb-6 pt-6">
        <v-spacer />
        <v-btn
          color="grey"
          variant="text"
          @click="closeCourseDialog"
          class="text-none"
        >
          Annuler
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="saveCourse"
          :loading="loading"
          :disabled="!formValid"
          class="text-none"
        >
          {{ modelCurrentCourseValue?.title != "" ? "Modifier" : "Créer" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
