<!-- components/CampaignDialog.vue -->
<script setup lang="ts">
import {
  mockFormationsConstant,
  mockUsersConstant,
} from "~/constants/awareness.constant";
import type { CreateCampaignData, Campaign } from "~/types/awareness.type";

// Props et émissions
const props = defineProps<{
  modelValue: boolean;
  campaign?: Campaign | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  save: [data: any];
}>();

// État local
const form = ref();
const valid = ref(false);
const loading = ref(false);
const currentStep = ref(1);
const imagePreview = ref<string | null>(null);
const imageFile = ref<File>();

// Données du formulaire
const formData = ref<CreateCampaignData>({
  name: "",
  description: "",
  image: "",
  startDate: new Date(),
  endDate: undefined,
  targetUsers: [] as string[],
  formations: [] as string[],
});

// Étapes du stepper
const steps = [
  { title: "Informations", value: 1 },
  { title: "Utilisateurs", value: 2 },
  { title: "Formations", value: 3 },
  { title: "Récapitulatif", value: 4 },
];

// Règles de validation
const rules = {
  required: (value: any) => !!value || "Ce champ est requis",
};

// Computed
const isEditing = computed(() => !!props.campaign);

const canGoNext = computed(() => {
  switch (currentStep.value) {
    case 1:
      return (
        formData.value.name &&
        formData.value.description &&
        formData.value.image &&
        formData.value.startDate
      );
    case 2:
      return formData.value.targetUsers.length > 0;
    case 3:
      return formData.value.formations.length > 0;
    default:
      return true;
  }
});

// Méthodes
const resetForm = () => {
  formData.value = {
    name: "",
    description: "",
    image: undefined,
    startDate: new Date(),
    endDate: undefined,
    targetUsers: [],
    formations: [],
  };
  imagePreview.value = null;
  currentStep.value = 1;
};

const initializeForm = () => {
  if (props.campaign) {
    formData.value = {
      name: props.campaign.name,
      description: props.campaign.description,
      image: undefined,
      startDate: new Date(props.campaign.startDate),
      endDate: props.campaign.endDate
        ? new Date(props.campaign.endDate)
        : undefined,
      targetUsers: [...props.campaign.targetUsers],
      formations: [...props.campaign.formations],
    };
    imagePreview.value = props.campaign.image as string;
  } else {
    resetForm();
  }
};

const handleSubmit = async () => {
  if (!valid.value) return;

  loading.value = true;

  try {
    emit("save", formData.value);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde:", error);
  } finally {
    loading.value = false;
  }
};

// Watchers
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      initializeForm();
    }
  }
);

watch(
  () => props.campaign,
  () => {
    if (props.modelValue) {
      initializeForm();
    }
  }
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
        imagePreview.value = reader.result as string;
        formData.value.image = file;
      };
      console.log("data :", formData.value);
    } else {
      formData.value.image = undefined;
      imagePreview.value = "";
    }
  }
);
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="800"
    persistent
  >
    <v-card class="bg-fontcolor">
      <v-card-title class="text-h6 d-flex align-center pt-3">
        <v-icon class="mr-2">mdi-shield-account-outline</v-icon>
        {{ isEditing ? "Modifier la campagne" : "Nouvelle campagne" }}
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
          <v-stepper v-model="currentStep" class="elevation-0 bg-fontcolor">
            <v-stepper-header>
              <template v-for="data in steps">
                <v-stepper-item
                  :title="data.title"
                  :value="data.value"
                ></v-stepper-item>

                <v-divider
                  class="mx-2"
                  v-if="data.value < steps.length"
                  :key="data.value"
                ></v-divider>
              </template>
            </v-stepper-header>

            <v-stepper-window>
              <v-stepper-window-item></v-stepper-window-item>

              <!-- Étape 1: Informations de base -->
              <v-stepper-window-item value="1">
                <v-card class="pa-4 bg-transparent" elevation="0">
                  <v-card-title class="text-h6 pa-0 mb-4">
                    Informations de base
                  </v-card-title>

                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="formData.name"
                        label="Nom de la campagne"
                        :rules="[rules.required]"
                        variant="outlined"
                        required
                        prepend-inner-icon="mdi-format-title"
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-textarea
                        v-model="formData.description"
                        label="Description"
                        :rules="[rules.required]"
                        variant="outlined"
                        required
                        prepend-inner-icon="mdi-text"
                        rows="3"
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-file-input
                        v-model="imageFile"
                        label="Image de la campagne"
                        accept="image/*"
                        prepend-inner-icon="mdi-image"
                        variant="outlined"
                        required
                      />

                      <v-img
                        v-if="imagePreview"
                        :src="imagePreview"
                        max-height="200"
                        class="mt-4 rounded"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-date-picker
                        v-model="formData.startDate"
                        class="bg-transparent"
                        label="Date de début"
                        :rules="[rules.required]"
                        required
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-date-picker
                        v-model="formData.endDate"
                        class="bg-transparent"
                        label="Date de fin (optionnel)"
                        :min="formData.startDate"
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </v-stepper-window-item>

              <!-- Étape 2: Sélection des utilisateurs -->
              <v-stepper-window-item value="2">
                <awareness-select-users-box
                  v-model:model-user-id-list-value="formData.targetUsers"
                />
              </v-stepper-window-item>

              <!-- Étape 3: Sélection des formations -->
              <v-stepper-window-item value="3">
                <awareness-select-training-box
                  v-model:model-training-id-list-value="formData.formations"
                />
              </v-stepper-window-item>

              <!-- Étape 4: Récapitulatif -->
              <v-stepper-window-item value="4">
                <awareness-recap-box v-bind:form-data="formData" />
              </v-stepper-window-item>

              <!-- <template #item.4>

            </template> -->
            </v-stepper-window>
          </v-stepper>
        </v-form>
      </v-card-text>

      <v-card-actions class="px-6 mt-0 pt-0 pb-4">
        <v-btn
          text
          @click="$emit('update:modelValue', false)"
          class="text-none"
        >
          Annuler
        </v-btn>

        <v-spacer />

        <v-btn v-if="currentStep > 1" class="text-none" @click="currentStep--">
          Précédent
        </v-btn>

        <v-btn
          v-if="currentStep < steps.length"
          color="primary"
          @click="currentStep++"
          :disabled="!canGoNext"
          class="text-none"
        >
          Suivant
        </v-btn>

        <v-btn
          v-if="currentStep === steps.length"
          color="primary"
          @click="handleSubmit"
          :loading="loading"
          :disabled="!valid"
          class="text-none"
        >
          {{ isEditing ? "Modifier" : "Créer" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
:deep(.v-stepper),
:deep(.v-stepper-header),
:deep(.v-stepper-item),
:deep(.v-stepper-window),
:deep(.v-stepper-actions) {
  box-shadow: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

:deep(.v-stepper-header) {
  padding: 0 1em !important;
}

.max-height-150 {
  max-height: 150px;
}

.max-height-300 {
  max-height: 300px;
}

.max-height-400 {
  max-height: 400px;
}

.gap-2 {
  gap: 8px;
}
</style>
