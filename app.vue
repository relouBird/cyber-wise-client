<script setup lang="ts">
import { useNotificationStore } from "~/stores/notification.store";

const useNotification = useNotificationStore();
const store = storeToRefs(useNotification);

function handleClose() {
  useNotification.close();
  console.log("____verification____")
}

watch(store.message, (newVal) => {
  console.log("new-notification =>", newVal);
});
</script>

<template>
  <nuxt-layout>
    <nuxt-page />
  </nuxt-layout>

  <div class="bottom">
    <v-alert
      v-model="store.visible.value"
      :close-label="store.color.value"
      :color="store.color.value"
      theme="dark"
      border
      closable
      @click:close="handleClose"
    >
      {{ store.color.value == "error" ? "Error :" : "" }}
      {{ store.message.value }}
    </v-alert>
  </div>
</template>

<style scoped>
.bottom {
  position: absolute;
  bottom: 5em;
  right: 2em;
  z-index: 1000;
}
</style>
