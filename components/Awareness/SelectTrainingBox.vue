<script setup lang="ts">
import { mockFormationsConstant } from "~/constants/awareness.constant";
import useCoursesStore from "~/stores/courses.store";
import useTrainingsStore from "~/stores/trainings.store";

// Type pour propriétés
type PropsType = {
  modelTrainingIdListValue: string[];
};

// Definitions des propriété du composant
const props = defineProps<PropsType>();

// Definitions des Evenements du composant
const emit = defineEmits(["update:modelTrainingIdListValue"]);

// gestion des stores
const trainingsStore = useTrainingsStore();
const coursesStore = useCoursesStore();

// etat en local
const formationSearch = ref("");

// Données mock
const mockFormations = computed(() => trainingsStore.getTrainings);
const categories = computed(() => coursesStore.getCategories);
// computed
const filteredFormations = computed(() => {
  return mockFormations.value.filter(
    (formation) =>
      formation.title
        .toLowerCase()
        .includes(formationSearch.value.toLowerCase()) ||
      formation.description
        .toLowerCase()
        .includes(formationSearch.value.toLowerCase())
  );
});

// methodes
const toggleFormation = (formationId: string) => {
  const index = props.modelTrainingIdListValue.indexOf(formationId);
  if (index > -1) {
    const tabToReplace = [...props.modelTrainingIdListValue];
    emit("update:modelTrainingIdListValue", [
      ...tabToReplace.filter((u) => u != tabToReplace[index]),
    ]);
  } else {
    const tabToReplace = [...props.modelTrainingIdListValue];
    emit("update:modelTrainingIdListValue", [...tabToReplace, formationId]);
  }
};

function getCategoryColor(category: string): string {
  const index = categories.value?.findIndex((u) => u.value == category);
  if (index && index != -1) {
    return categories.value[index].color;
  }
  return "blue";
}
</script>

<template>
  <v-card class="pa-4 bg-fontcolor" elevation="0">
    <v-card-title class="text-h6 pa-0 mb-4"> Formations incluses </v-card-title>

    <v-row>
      <v-col cols="12" class="pb-0">
        <v-text-field
          v-model="formationSearch"
          label="Rechercher des formations"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          clearable
          class="mb-2"
        />
      </v-col>

      <v-col cols="12" class="py-0">
        <v-list class="border rounded bg-transparent max-height-400 overflow-y-auto">
          <v-list-item
            v-for="formation in filteredFormations"
            :key="formation.id"
            @click="toggleFormation(String(formation.id))"
          >
            <template #prepend>
              <v-checkbox
                :model-value="
                  props.modelTrainingIdListValue.includes(String(formation.id))
                "
                @update:model-value="toggleFormation(String(formation.id))"
              />
            </template>

            <div class="d-flex align-center">
              <v-avatar size="40" class="mr-3">
                <v-img :src="String(formation.image)" />
              </v-avatar>
              <div>
                <v-list-item-title>{{ formation.title }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  formation.description
                }}</v-list-item-subtitle>
              </div>
            </div>

            <template #append>
              <div class="text-right">
                <v-chip
                  :color="getCategoryColor(formation.categorie)"
                  size="small"
                  class="mb-1"
                >
                  {{ formation.categorie }}
                </v-chip>
                <div class="text-caption">
                  {{
                    formation.courses?.length
                      ? formation.courses?.length * 5
                      : 0
                  }}
                  min
                </div>
              </div>
            </template>
          </v-list-item>
        </v-list>

        <div class="text-caption text-medium-emphasis mt-2">
          {{ props.modelTrainingIdListValue.length }} formation(s)
          sélectionnée(s)
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>
