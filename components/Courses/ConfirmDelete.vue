<script setup lang="ts">
import useCoursesStore from "~/stores/courses.store";

// Type pour propriétés
type PropsType = {
  modelValue: number | undefined;
};

const props = defineProps<PropsType>();
const emit = defineEmits(["update:modelValue"]);

const coursesStore = useCoursesStore();

// methodes
const closeDialog = () => {
  emit("update:modelValue", undefined);
};

const loading = ref(false);

const deleteData = async () => {
  loading.value = true;
  console.log("data =>", props.modelValue);
  setTimeout(async () => {
    await coursesStore.deleteCourse(props.modelValue ?? 1);
    loading.value = false;
    emit("update:modelValue", undefined);
  }, 1500);
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
      <v-card-text> Voulez-vous vraiment supprimer ce cours ? </v-card-text>
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
