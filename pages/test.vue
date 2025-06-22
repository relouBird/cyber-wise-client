<script setup lang="ts">
import useTestStore from "~/stores/test.store";
import type { UserDescription } from "~/types/test.type";

// Définir le Middleware à utiliser
definePageMeta({
  middleware: "auth",
});

const testStore = useTestStore();

const datas = ref<UserDescription[]>([]);

onMounted(async () => {
  try {
    const response = await testStore.getAllTests();
    datas.value = response.data;
    console.log("response =>", response);
    // navigateTo("/auth/login");
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <div class="pa-3">
    <div class="d-flex align-center ga-3 pb-4">
      <h2 class="font-manrope font-manrope-400">All Tests Users</h2>
      <v-btn class="text-none">Create User</v-btn>
    </div>

    <v-row class="pt-3">
      <Profilecard
        v-for="data in datas"
        :avatar="data.image ?? ''"
        :name="data.name"
        :description="data.description"
        :time="data.created_at"
      />
    </v-row>
  </div>
</template>
