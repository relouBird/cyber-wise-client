<script setup lang="ts">
// Définir le Middleware à utiliser
definePageMeta({
  middleware: "auth",
});
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col-12">
                <p>Home Page</p>
            </div>
        </div>
    </div>
</template>