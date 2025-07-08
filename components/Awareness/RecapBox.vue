<script setup lang="ts">
import {
  mockFormationsConstant,
  mockUsersConstant,
} from "~/constants/awareness.constant";
import useUsersStore from "~/stores/users.store";
import type { CreateCampaignData } from "~/types/awareness.type";

// Type pour propriétés
type PropsType = {
  formData: CreateCampaignData;
};

// Definitions des propriété du composant
const props = defineProps<PropsType>();

// gestion des stores
const usersStore = useUsersStore();

const mockUsers = computed(() => usersStore.getUsers);

const getUserName = (userId: string) => {
  const user = mockUsers.value.find((u) => String(u.id) === userId);
  let name = user?.firstName + " " + user?.lastName;
  return user ? name : userId;
};

const formatDate = (date: Date | null) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};
</script>

<template>
  <v-card class="pa-4 bg-transparent" elevation="0">
    <v-card-title class="text-h6 pa-0 mb-4"> Récapitulatif </v-card-title>

    <v-row>
      <v-col cols="12" md="6">
        <v-card variant="outlined" class="pa-4 opacity-60">
          <v-card-title class="text-subtitle-1 pa-0 mb-2">
            Informations générales
          </v-card-title>

          <div class="mb-2"><strong>Nom:</strong> {{ formData.name }}</div>
          <div class="mb-2">
            <strong>Description:</strong> {{ formData.description }}
          </div>
          <div class="mb-2">
            <strong>Date de début:</strong>
            {{ formatDate(formData.startDate) }}
          </div>
          <div v-if="formData.endDate" class="mb-2">
            <strong>Date de fin:</strong>
            {{ formatDate(formData.endDate) }}
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card variant="outlined" class="pa-4 opacity-60">
          <v-card-title class="text-subtitle-1 pa-0 mb-2">
            Participants
          </v-card-title>

          <div class="mb-2">
            <strong>Utilisateurs ciblés:</strong>
            {{ formData.targetUsers.length }}
          </div>
          <div class="mb-2">
            <strong>Formations incluses:</strong>
            {{ formData.formations.length }}
          </div>

          <v-divider class="my-3" />

          <div class="text-subtitle-2 mb-2">Utilisateurs sélectionnés:</div>
          <div class="max-height-150 overflow-y-auto">
            <v-chip
              v-for="userId in formData.targetUsers"
              :key="userId"
              size="small"
              class="ma-1"
            >
              {{ getUserName(userId) }}
            </v-chip>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>
