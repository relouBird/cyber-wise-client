<script setup lang="ts">
import { usersRole } from "~/constants/users.constant";
import { areObjectsDifferent } from "~/helpers/utils";
import useUsersStore from "~/stores/users.store";
import type { RoleType, UserProps } from "~/types/constant.type";

// Type pour propriétés
type PropsType = {
  modelCurrentUserValue: Partial<UserProps>;
  modelEditingValue: boolean;
  modelCreatingValue: boolean;
};

// Definitions des propriété du composant
const props = defineProps<PropsType>();

// Definitions des Evenements du composant
const emit = defineEmits([
  "update:modelCreatingValue",
  "update:modelEditingValue",
  "update:modelCurrentUserValue",
]);

// Store des utilisateurs
const useUsers = useUsersStore();

const formValid = ref(false);
const loading = ref(false);

// Options de filtres
const roleOptions: RoleType[] = usersRole;

// Formulaire utilisateur
const currentUser = ref<UserProps>({
  firstName: "",
  lastName: "",
  email: "",
  role: usersRole[0],
  phone: "",
  status: "Inactif",
});
const password = ref<string>("");

// Règles de validation
const rules = {
  required: (value: string) => !!value || "Ce champ est requis",
  email: (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value) || "Email invalide";
  },
};

const closeUserDialog = () => {
  emit("update:modelCreatingValue", false);
  emit("update:modelEditingValue", false);
  emit("update:modelCurrentUserValue", {});
};

const saveUser = async () => {
  try {
    loading.value = true;
    if (props.modelEditingValue) {
      // Modifier l'utilisateur existant
      await useUsers.updateUser(currentUser.value as UserProps);
    } else {
      // Ajouter un nouvel utilisateur
      await useUsers.createUser(currentUser.value as UserProps);
    }
    loading.value = false;
    closeUserDialog();
  } catch (error) {
    console.error("Erreur lors de la sauvegarde:", error);
    currentUser.value.firstName = "";
    currentUser.value.lastName = "";
    currentUser.value.email = "";
  }
};

watch(
  () => props.modelCurrentUserValue,
  (newValue) => {
    console.log("new-data =>", newValue);
    currentUser.value = { ...(newValue as UserProps) };
    console.log(
      "identique =>",
      !areObjectsDifferent(currentUser.value, props.modelCurrentUserValue)
    );
  }
);
watch(
  () => [currentUser.value.firstName, currentUser.value.lastName],
  () => {
    password.value =
      currentUser.value.firstName + currentUser.value.lastName + "@123";
  }
);
</script>

<template>
  <!-- Dialog pour ajouter/modifier un utilisateur -->
  <v-dialog
    v-model="props.modelCreatingValue"
    @update:model-value="emit('update:modelCreatingValue', $event)"
    max-width="600px"
    persistent
  >
    <v-card class="bg-fontcolor">
      <v-card-title class="text-h5">
        {{
          modelEditingValue
            ? "Modifier l'utilisateur"
            : "Ajouter un utilisateur"
        }}
      </v-card-title>
      <v-card-text>
        <v-form ref="userForm" v-model="formValid">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="currentUser.firstName"
                label="Prénom *"
                :rules="[rules.required]"
                variant="outlined"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="currentUser.lastName"
                label="Nom *"
                :rules="[rules.required]"
                variant="outlined"
                hide-details
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="currentUser.email"
                label="Email *"
                :readonly="props.modelEditingValue"
                :rules="[rules.required, rules.email]"
                variant="outlined"
                hide-details
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Password"
                :model-value="password"
                readonly
                variant="outlined"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="currentUser.role"
                :items="roleOptions"
                label="Rôle *"
                :rules="[rules.required]"
                variant="outlined"
              >
                <template #prepend-item>
                  <empty-card />
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="currentUser.phone"
                label="Téléphone"
                variant="outlined"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="closeUserDialog">Annuler</v-btn>
        <v-btn
          color="primary"
          :disabled="
            !formValid ||
            !areObjectsDifferent(currentUser, modelCurrentUserValue)
          "
          :loading="loading"
          @click="saveUser"
        >
          {{ modelEditingValue ? "Modifier" : "Ajouter" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
