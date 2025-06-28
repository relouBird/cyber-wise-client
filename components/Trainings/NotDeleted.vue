<script setup lang="ts">
// Type pour propriétés
type PropsType = {
  modelValue: string;
};

const props = defineProps<PropsType>();
const emit = defineEmits(["update:modelValue"]);

// methodes
const closeTrainingDialog = () => {
  emit("update:modelValue", "");
};

const state = ref(false);

watch(
  () => props.modelValue,
  (newValue) => {
    state.value = newValue !== "";
  }
);
</script>

<template>
  <v-dialog v-model="state" max-width="400">
    <v-card class="bg-fontcolor">
      <v-card-title class="text-white"> Attention </v-card-title>
      <v-card-text>
        {{ modelValue == "Domain" ? "Ce Domaine est  natif": "Cette formation est native" }}  au système et ne peut-etre alteré en aucun cas possible...
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          variant="text"
          @click="closeTrainingDialog"
          class="text-none"
        >
          Annuler
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
