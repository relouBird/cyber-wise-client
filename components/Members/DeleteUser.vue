<script setup lang="ts">
import useUsersStore from "~/stores/users.store";
import type { UserProps } from "~/types/constant.type";

// Type pour propriétés
type PropsType = {
  modelValue: boolean;
  user: UserProps | undefined;
};

// Definitions des Evenements du composant
const emit = defineEmits(["update:modelValue"]);
// Definitions des propriété du composant
const props = defineProps<PropsType>();

const useUsers = useUsersStore();

const loading = ref(false);

const handleClick = () => {
  emit("update:modelValue", false);
};

const confirmDelete = async () => {
  loading.value = true;
  console.log("fou =>", props.user);
  if (props.user) {
    try {
      await useUsers.deleteUser(props.user);

      loading.value = false;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
    }
  }
  emit("update:modelValue", false);
};
</script>

<template>
  <!-- Dialog de confirmation de suppression -->
  <v-dialog
    v-model="props.modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    max-width="400px"
  >
    <v-card class="bg-fontcolor">
      <v-card-title class="text-h5">Confirmer la suppression</v-card-title>
      <v-card-text>
        Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est
        irréversible.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="handleClick">Annuler</v-btn>
        <v-btn color="error" :loading="loading" @click="confirmDelete"
          >Supprimer</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
