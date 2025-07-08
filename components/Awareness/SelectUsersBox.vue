<script setup lang="ts">
import useUsersStore from "~/stores/users.store";

// Type pour propriétés
type PropsType = {
  modelUserIdListValue: string[];
};

// Definitions des propriété du composant
const props = defineProps<PropsType>();

// Definitions des Evenements du composant
const emit = defineEmits(["update:modelUserIdListValue"]);

// gestion des stores
const usersStore = useUsersStore();

// etat en local
const userSearch = ref("");

// Données mock
const mockUsers = computed(() => usersStore.getUsers);

// computed
const filteredUsers = computed(() => {
  return mockUsers.value.filter((user) => {
    let name = user.firstName + " " + user.lastName;
    return (
      name.toLowerCase().includes(userSearch.value.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.value.toLowerCase())
    );
  });
});

// methodes
const selectAllUsers = () => {
  emit(
    "update:modelUserIdListValue",
    filteredUsers.value.map((user) => user.id)
  );
};

const deselectAllUsers = () => {
  emit("update:modelUserIdListValue", []);
};

const toggleUser = (userId: string) => {
  const index = props.modelUserIdListValue.indexOf(userId);
  if (index > -1) {
    const tabToReplace = [...props.modelUserIdListValue];
    emit("update:modelUserIdListValue", [
      ...tabToReplace.filter((u) => u != tabToReplace[index]),
    ]);
  } else {
    const tabToReplace = [...props.modelUserIdListValue];
    emit("update:modelUserIdListValue", [...tabToReplace, userId]);
  }
};

// Méthodes
const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    Manager: "warning",
    Employé: "primary",
    Invité: "info",
  };
  return colors[role] || "default";
};
</script>

<template>
  <v-card class="pa-4 bg-transparent" elevation="0">
    <v-card-title class="text-h6 pa-0 mb-4"> Utilisateurs ciblés </v-card-title>

    <v-row>
      <v-col cols="12" class="pb-0">
        <v-text-field
          v-model="userSearch"
          label="Rechercher des utilisateurs"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          clearable
        />
      </v-col>

      <v-col cols="12" class="py-0">
        <div class="d-flex mb-4 pt-0">
          <v-btn
            variant="outlined"
            size="small"
            class="mr-3"
            @click="selectAllUsers"
          >
            Tout sélectionner
          </v-btn>
          <v-btn variant="outlined" size="small" @click="deselectAllUsers">
            Tout désélectionner
          </v-btn>
        </div>

        <v-list
          class="border rounded max-height-300 overflow-y-auto bg-fontcolor opacity-70"
        >
          <v-list-item
            v-for="user in filteredUsers"
            :key="user.id"
            @click="toggleUser(String(user.id))"
            class="py-0"
          >
            <template #prepend>
              <v-checkbox
                class="pt-5"
                :model-value="
                  props.modelUserIdListValue.includes(String(user.id))
                "
                @update:model-value="toggleUser(String(user.id))"
              />
            </template>

            <v-list-item-title>{{
              user.firstName + " " + user.lastName
            }}</v-list-item-title>
            <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>

            <template #append>
              <v-chip :color="getRoleColor(user.role)" size="small">
                {{ user.role }}
              </v-chip>
            </template>
          </v-list-item>
        </v-list>

        <div class="text-caption text-medium-emphasis mt-2">
          {{ props.modelUserIdListValue.length }} utilisateur(s) sélectionné(s)
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>
