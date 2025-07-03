<script setup lang="ts">
import useAuthStore from "~/stores/auth.store";
import useTrainingsStore from "~/stores/trainings.store";
import type { Formation } from "~/types/trainings.type";

// Type pour propriétés
type PropsType = {
  modelCurrentTrainingValue: Partial<Formation> | null;
  modelAddTrainingValue: boolean;
  domainId: number;
};

// Definitions des propriété du composant
const props = defineProps<PropsType>();

// Definitions des Evenements du composant
const emit = defineEmits([
  "update:modelCurrentTrainingValue",
  "update:modelAddTrainingValue",
]);

// gerer la store...
const trainingsStore = useTrainingsStore();
const { me } = useAuthStore();

// le formulaire
const formValid = ref(false);
const loading = ref(false);
const levels = [
  { title: "Débutant", value: "beginner" },
  { title: "Intermédiaire", value: "intermediate" },
  { title: "Avancé", value: "advanced" },
];

const formationForm = ref<Formation>({
  title: "",
  categorie: "",
  level: "beginner",
  description: "",
  domainId: props.domainId,
  active: false,
  courses: [],
});

const imageFile = ref<File>();
const imageFileString = ref<string>();

// Règles de validation
const rules = {
  required: (value: string) => !!value || "Ce champ est requis",
  deserved: (value: string) =>
    value.length >= 40 || "Your Formation must have 128 letters...",
};

//methodes...
// ferme la dialogue...
const closeTrainingDialog = () => {
  emit("update:modelAddTrainingValue", false);
};

// cette fonction permet de sauvegarder la formation...
const saveFormation = async () => {
  loading.value = true;
  if (props.modelCurrentTrainingValue?.title != "") {
    await trainingsStore.updateTraining(me?.id ?? "", formationForm.value);
  } else {
    // creation d'une formation...
    await trainingsStore.createTraining(me?.id ?? "", formationForm.value);
  }
  imageFile.value = undefined;
  imageFileString.value = undefined;
  loading.value = false;

  closeTrainingDialog();
};

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
        formationForm.value.image = file;
      };
      console.log("data :", formationForm.value);
    } else {
      formationForm.value.image = undefined;
      imageFileString.value = "";
    }
  }
);

// Observateur pour update les données de formation
watch(
  () => props.modelCurrentTrainingValue,
  (newValue) => {
    console.log("new-data =>", newValue);
    if (newValue) {
      formationForm.value = { ...(newValue as Formation) };
      imageFileString.value = newValue.image as string;
    } else {
      formationForm.value = {
        title: "",
        categorie: "",
        level: "beginner",
        description: "",
        domainId: props.domainId,
        active: false,
        courses: [],
      };
    }
  }
);
</script>

<template>
  <!-- Dialog pour créer/modifier une formation -->
  <v-dialog
    v-model="props.modelAddTrainingValue"
    @update:model-value="emit('update:modelAddTrainingValue', $event)"
    max-width="800"
  >
    <v-card :style="{ backgroundColor: '#252545' }">
      <v-card-title class="text-white">
        {{
          modelCurrentTrainingValue?.title != ""
            ? "Modifier la formation"
            : "Nouvelle formation"
        }}
      </v-card-title>

      <v-card-text class="pb-0">
        <v-form v-model="formValid">
          <v-text-field
            v-model="formationForm.title"
            label="Titre de la formation"
            variant="outlined"
            color="primary"
            :rules="[rules.required]"
            class="mb-4 custom-field bg-fontcolorSecond"
            hide-details
          />
          <v-select
            v-model="formationForm.level"
            :items="levels"
            label="Difficulté"
            placeholder="Filtrer par niveau"
            variant="outlined"
            hide-details
            class="bg-fontcolor mb-4"
            density="compact"
          >
            <template #prepend-item>
              <empty-card />
            </template>
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" class="bg-fontcolor py-2">
              </v-list-item>
            </template>
            <template v-slot:selection="{ item }">
              <div class="d-flex align-center py-2">
                {{ item.title }}
              </div>
            </template>
          </v-select>

          <v-textarea
            v-model="formationForm.description"
            label="Description"
            variant="outlined"
            color="primary"
            rows="3"
            :rules="[rules.required, rules.deserved]"
            class="mb-4 custom-field bg-fontcolorSecond"
            hide-details
            no-resize
          />

          <v-file-input
            v-model="imageFile"
            label="Image de couverture (optionnel)"
            variant="outlined"
            color="primary"
            accept="image/*"
            prepend-icon="mdi-camera"
            name="image"
            class="mb-4 pl-1 custom-field bg-fontcolorSecond"
            hide-details
          />

          <!-- Prévisualisation de l'image -->
          <div v-if="formationForm.image" class="mb-4">
            <v-img :src="imageFileString" max-height="200" class="rounded" />
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions class="px-6 pb-6">
        <v-spacer />
        <v-btn
          color="grey"
          variant="text"
          @click="closeTrainingDialog"
          class="text-none"
        >
          Annuler
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :loading="loading"
          @click="saveFormation"
          :disabled="!formValid"
          class="text-none"
        >
          {{ modelCurrentTrainingValue?.title != "" ? "Modifier" : "Créer" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
