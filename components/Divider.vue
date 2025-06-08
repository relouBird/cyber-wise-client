<script setup lang="ts">
// Type pour propriétés
type PropsType = {
  title: string;
  spacing?: number;
};

// Definitions des propriété du composant
const props = defineProps<PropsType>();
</script>

<template>
  <div :class="spacing != undefined ? 'my-' + spacing : 'my-4'">
    <v-divider>
      <span class="text-body-1 px-5 py-3 position-relative">{{ title }}</span>
    </v-divider>
  </div>
</template>
