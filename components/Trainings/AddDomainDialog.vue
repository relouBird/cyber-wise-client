<script setup lang="ts">
import {
  colorOptionsConstants,
  iconOptionsConstants,
} from "~/constants/trainings.constant";
import useAuthStore from "~/stores/auth.store";
import useTrainingsStore from "~/stores/trainings.store";
import type { Domain } from "~/types/trainings.type";

// Type pour propriétés
type PropsType = {
  modelCurrentDomainValue: Partial<Domain> | null;
  modelAddDomainValue: boolean;
};

// Definitions des propriété du composant
const props = defineProps<PropsType>();

// Definitions des Evenements du composant
const emit = defineEmits([
  "update:modelCurrentDomainValue",
  "update:modelAddDomainValue",
]);

// gerer la store...
const trainingsStore = useTrainingsStore();
const { me } = useAuthStore();

// Copie des constantes à importer...
const iconOptions = [...iconOptionsConstants];
const colorOptions = [...colorOptionsConstants];

// Formulaires
const formValid = ref(false);
const domainForm = ref<Domain>({
  name: "",
  categorie: "",
  description: "",
  icon: "mdi-security",
  color: "primary",
});

// Règles de validation
const rules = {
  required: (value: string) => !!value || "Ce champ est requis",
};

//methodes...
// ferme la dialogue...
const closeDomainDialog = () => {
  emit("update:modelAddDomainValue", false);
};

// cette fonction permet de sauvegarder le domaine...
const saveDomain = async () => {
  if (props.modelCurrentDomainValue?.name != "") {
    // Modifier le domaine existant
    await trainingsStore.updateDomain(me?.id ?? "", domainForm.value);
  } else {
    // Soumettre...
    await trainingsStore.createDomain(me?.id ?? "", domainForm.value);
  }
  closeDomainDialog();
};

// un Observateur...
watch(
  () => props.modelCurrentDomainValue,
  (newValue) => {
    if (newValue) {
      domainForm.value = { ...newValue } as Domain;
    } else {
      domainForm.value = {
        name: "",
        categorie: "",
        description: "",
        icon: "mdi-security",
        color: "primary",
      };
    }
  },
  { immediate: true }
);
</script>

<template>
  <!-- Dialog pour créer/modifier un domaine -->
  <v-dialog
    v-model="props.modelAddDomainValue"
    @update:model-value="emit('update:modelAddDomainValue', $event)"
    max-width="600"
  >
    <v-card :style="{ backgroundColor: '#252545' }">
      <v-card-title class="text-white">
        {{
          modelCurrentDomainValue?.name != ""
            ? "Modifier le domaine"
            : "Nouveau domaine"
        }}
      </v-card-title>

      <v-card-text class="pb-0">
        <v-form v-model="formValid">
          <v-text-field
            v-model="domainForm.name"
            label="Nom du domaine"
            variant="outlined"
            :style="{ backgroundColor: '#1a1a2e' }"
            color="primary"
            :rules="[rules.required]"
            class="mb-4 custom-field"
            hide-details
          />

          <v-text-field
            v-model="domainForm.categorie"
            label="Catégorie (en un mot)"
            variant="outlined"
            :style="{ backgroundColor: '#1a1a2e' }"
            color="primary"
            :rules="[rules.required]"
            class="mb-4 custom-field"
            hide-details
          />

          <v-textarea
            v-model="domainForm.description"
            label="Description"
            variant="outlined"
            :style="{ backgroundColor: '#1a1a2e' }"
            color="primary"
            rows="3"
            :rules="[rules.required]"
            class="mb-4 custom-field"
            hide-details
          />

          <v-row>
            <v-col cols="6">
              <v-select
                v-model="domainForm.icon"
                :items="iconOptions"
                label="Icône"
                variant="outlined"
                :style="{ backgroundColor: '#1a1a2e' }"
                color="primary"
                class="custom-field"
                hide-details
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-icon :icon="item.value" />
                    </template>
                  </v-list-item>
                </template>
                <template v-slot:selection="{ item }">
                  <div class="d-flex align-center">
                    <v-icon :icon="item.value" class="me-2" />
                    {{ item.title }}
                  </div>
                </template>
              </v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="domainForm.color"
                :items="colorOptions"
                label="Couleur"
                variant="outlined"
                :style="{ backgroundColor: '#1a1a2e' }"
                color="primary"
                class="custom-field"
                hide-details
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-avatar size="20" :color="item.value" />
                    </template>
                  </v-list-item>
                </template>
                <template v-slot:selection="{ item }">
                  <div class="d-flex align-center">
                    <v-avatar size="20" :color="item.value" class="me-2" />
                    {{ item.title }}
                  </div>
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="px-6 pb-6 pt-6">
        <v-spacer />
        <v-btn
          color="grey"
          variant="text"
          @click="closeDomainDialog"
          class="text-none"
        >
          Annuler
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="saveDomain"
          :disabled="!formValid"
          class="text-none"
        >
          {{ modelCurrentDomainValue?.name != "" ? "Modifier" : "Créer" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
