<script setup lang="ts">
// Type pour propriétés
type PropsType = {
  size?: number;
  color?: string;
};

// Definitions des propriété du composant
const props = defineProps<PropsType>();
</script>

<template>
  <svg
    :width="size != undefined ? size : 24"
    :height="size != undefined ? size : 24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.707 17.293L8.414 13H18V11H8.414L12.707 6.707L11.293 5.293L4.586 12L11.293 18.707L12.707 17.293Z"
      :fill="color != undefined ? color : 'black'"
    />
  </svg>
</template>
