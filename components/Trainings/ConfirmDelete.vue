<script setup lang="ts">
import useTrainingsStore from "~/stores/trainings.store";

// Type pour propriétés
type PropsType = {
  modelValue: string | undefined;
};

const props = defineProps<PropsType>();
const emit = defineEmits(["update:modelValue"]);

const trainingsStore = useTrainingsStore();

// methodes
const closeDialog = () => {
  emit("update:modelValue", undefined);
};

const loading = ref(false);

const deleteData = async () => {
  loading.value = true;
  console.log("data =>", props.modelValue);
  if (props.modelValue && props.modelValue == "Formation") {
    await trainingsStore.deleteTraining(trainingsStore.getDelete?.id ?? 1);
  } else if (props.modelValue && props.modelValue == "Domain") {
    await trainingsStore.deleteDomain(trainingsStore.getDelete?.id ?? 1);
  }
  loading.value = false;
  emit("update:modelValue", undefined);
};

const state = ref(false);

watch(
  () => props.modelValue,
  (newValue) => {
    state.value = newValue != undefined;
  }
);
</script>

<template>
  <v-dialog v-model="state" max-width="400">
    <v-card class="bg-fontcolor">
      <v-card-title class="text-white"> Attention </v-card-title>
      <v-card-text> Voulez-vous vraiment supprimer ce-dernier ? </v-card-text>
      <v-card-actions>
        <v-btn variant="text" @click="closeDialog" class="text-none">
          Annuler
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :loading="loading"
          @click="deleteData"
          class="text-none"
        >
          Oui
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
