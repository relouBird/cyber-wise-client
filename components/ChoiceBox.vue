<script setup lang="ts">
// Type pour propriétés
type PropsType = {
  title: string;
  option: string;
  modelValue: string;
  isFirst: boolean;
  isLast: boolean;
};

// Definitions des Evenements du composant
const emit = defineEmits(["update:modelValue"]);

// Definitions des propriété du composant
const props = defineProps<PropsType>();
</script>

<template>
  <!-- Le premier -->
  <v-radio
    v-if="isFirst"
    class="box-part w-100 rounded-t-lg bg-surface py-2 px-3"
    :value="option"
  >
    <template v-slot:label>
      <div class="gap d-flex justify-space-between align-center">
        <p class="par">{{ title }} - {{ option }}</p>
      </div>
    </template>
  </v-radio>

  <!-- Le milieu... -->
  <v-radio
    v-if="!isFirst && !isLast"
    class="box-part part1 w-100 bg-surface py-2 px-3"
    :value="option"
  >
    <template v-slot:label>
      <div class="w-100 d-flex justify-space-between align-center">
        <p class="par">{{ title }} - {{ option }}</p>
      </div>
    </template>
  </v-radio>

  <!-- La fin... -->
  <v-radio
    v-if="isLast"
    class="box-part part1 rounded-b-lg w-100 bg-surface py-2 px-3"
    :value="option"
  >
    <template v-slot:label>
      <div class="w-100 d-flex justify-space-between align-center">
        <p class="par">{{ title }} - {{ option }}</p>
      </div>
    </template>
  </v-radio>
</template>

<style scoped>
.box-part {
  cursor: pointer;
  background: rgba(255, 255, 255, 0.075) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.box-part.part1 {
  border-top: none;
}

.par{
  text-align: left;
  font-size: 1.05rem;
}
</style>
