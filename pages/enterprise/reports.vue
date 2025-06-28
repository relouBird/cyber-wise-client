<script setup lang="ts">
// Définir le Middleware à utiliser
definePageMeta({
    layout : "admin",
  middleware: ["auth","user"],
});


</script>

<template>
    <p>Reports</p>
</template>