<script setup lang="ts">
// Définir le Middleware à utiliser
definePageMeta({
  middleware: ["auth", "user"],
  layout: "admin",
});

// Meta tags
useHead({
  title: "Courses Entreprise - SafeSteps",
  meta: [{ name: "description", content: "Tableau de bords SafeSteps" }],
});

</script>

<template>
  <h2>Courses...</h2>
</template>
