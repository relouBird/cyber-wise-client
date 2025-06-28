<script setup lang="ts">
// Type pour propriétés
type PropsType = {
  avatar: string;
  name: string;
  description: string;
  time: string;
};

// Definitions des propriété du composant
const props = defineProps<PropsType>();
</script>
<template>
  <v-col cols="12" md="4" sm="12">
      <v-card elevation="10" class="text-center" rounded="md">
        <v-card-item>
          <v-avatar size="80" rounded="full">
            <img :src="avatar" :alt="avatar" width="80" />
          </v-avatar>
          <div class="mt-4">
            <h5 class="text-h5" v-text="name"></h5>
            <h6 class="text-subtitle-2 mt-2" v-text="description"></h6>
          </div>
        </v-card-item>
        <v-divider class="mt-1"></v-divider>
      </v-card>
    </v-col>
</template>
