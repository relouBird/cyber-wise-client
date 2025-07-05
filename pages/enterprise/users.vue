<script setup lang="ts">
import { MembersDeleteUser } from "#components";
import { usersRole } from "~/constants/users.constant";
import { formatDateFirstType, formatDateSecondType } from "~/helpers/utils";
import useAuthStore from "~/stores/auth.store";
import useUsersStore from "~/stores/users.store";
import type { RoleType, UserProps } from "~/types/constant.type";

// Définir le Middleware à utiliser
definePageMeta({
  middleware: ["auth", "user"],
  layout: "admin",
});

// Meta tags
useHead({
  title: "Utilisateurs Entreprise - SafeSteps",
  meta: [{ name: "description", content: "Vos Utilisateurs sur SafeSteps" }],
});

// Store des utilisateurs
const useUsers = useUsersStore();
const { me } = useAuthStore();

// État réactif
const loading = ref(false);
const search = ref("");
const roleFilter = ref<RoleType>();
const statusFilter = ref();
const itemsPerPage = ref(10);
const selectedUsers = ref<number[]>([]);

// datas utiles pour creer/modifier un User
const userDialog = ref(false);
const editingUser = ref(false);

// datas utiles pour delete un User
const deleteDialog = ref(false);
const UserToDelete = ref<UserProps>();

// Formulaire utilisateur
const currentUser = ref<Partial<UserProps>>({
  firstName: "",
  lastName: "",
  email: "",
  role: usersRole[0],
  phone: "",
  status: "Inactif",
});

// Options de filtres
const roleOptions: RoleType[] = usersRole;
const statusOptions = ["Actif", "Inactif"];

// Headers du tableau
const headers = [
  { title: "", key: "avatar", sortable: false, width: "60px" },
  { title: "Utilisateur", key: "fullName", sortable: true },
  { title: "Rôle", key: "role", sortable: true },
  { title: "Statut", key: "status", sortable: true },
  { title: "Dernière connexion", key: "lastLogin", sortable: true },
  { title: "Actions", key: "actions", sortable: false, width: "120px" },
];

// Données simulées (à remplacer par vos données API)
const users = ref<UserProps[]>([]);

// Computed
const filteredUsers = computed(() => {
  let filtered = users.value;

  if (search.value) {
    const searchLower = search.value.toLowerCase();
    filtered = filtered.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
    );
  }

  if (roleFilter.value) {
    filtered = filtered.filter((user) => user.role === roleFilter.value);
  }

  if (statusFilter.value) {
    filtered = filtered.filter((user) => user.status === statusFilter.value);
  }

  return filtered;
});

// Méthodes
const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    Manager: "warning",
    Employé: "primary",
    Invité: "info",
  };
  return colors[role] || "default";
};

const resetFilters = () => {
  search.value = "";
  roleFilter.value = undefined;
  statusFilter.value = undefined;
};

const openUserDialog = (user?: UserProps) => {
  if (user) {
    editingUser.value = true;
    currentUser.value = { ...user };
  } else {
    editingUser.value = false;
    currentUser.value = {
      firstName: "",
      lastName: "",
      email: "",
      role: "Employé",
      phone: "",
      status: "Inactif",
    };
  }
  userDialog.value = true;
};

const viewUser = (user: UserProps) => {
  // Implémenter la vue détaillée
  console.log("Voir utilisateur:", user);
};

const editUser = (user: UserProps) => {
  openUserDialog(user);
};

const deleteUser = (user: UserProps) => {
  UserToDelete.value = user;
  deleteDialog.value = true;
};

const deleteSelected = async () => {
  // Implémenter la suppression en lot
  console.log("Supprimer sélectionnés:", selectedUsers.value);
  try {
    useUsers.deleterManyUsers(selectedUsers.value);
    users.value = useUsers.getUsers;
  } catch (error) {}
};

// Apres chaque mise à jours...
onMounted(async () => {
  loading.value = true;
  try {
    // Simuler un appel API

    if (me?.user_metadata.org_id) {
      await useUsers.getUsersOnUrl(me?.user_metadata.org_id ?? "");
    } else {
      await useUsers.getUsersOnUrl(me?.id ?? "");
    }

    users.value = useUsers.getUsers;
  } catch (error) {
    console.error("Erreur lors du chargement des utilisateurs:", error);
  } finally {
    loading.value = false;
  }
});

// Apres chaque mise à jours...
onUpdated(async () => {
  loading.value = true;
  try {
    // Simuler un appel API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    users.value = useUsers.getUsers;
  } catch (error) {
    console.error("Erreur lors du chargement des utilisateurs:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="users-page">
    <!-- Header avec titre et actions -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">Gestion des utilisateurs</h1>
        <p class="text-subtitle-1 text-grey-darken-1">
          {{ users.length }} utilisateur{{ users.length > 1 ? "s" : "" }} au
          total
        </p>
      </div>
      <v-btn
        size="large"
        color="primary"
        variant="tonal"
        class="text-body-1"
        @click="openUserDialog()"
      >
        Ajouter un Utilisateur
        <template v-slot:prepend>
          <v-icon size="22">mdi-account-plus</v-icon></template
        >
      </v-btn>
    </div>

    <!-- Filtres et recherche -->
    <v-card class="mb-6 bg-fontcolor">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Rechercher un utilisateur"
              variant="outlined"
              density="compact"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="roleFilter"
              :items="roleOptions"
              class="bg-fontcolor"
              label="Filtrer par rôle"
              variant="outlined"
              density="compact"
              hide-details
            >
              <template #prepend-item>
                <empty-card />
              </template>
            </v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="statusFilter"
              :items="statusOptions"
              label="Filtrer par statut"
              variant="outlined"
              density="compact"
              hide-details
            >
              <template #prepend-item>
                <empty-card />
              </template>
            </v-select>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn
              color="secondary"
              variant="outlined"
              block
              @click="resetFilters"
            >
              Réinitialiser
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Tableau des utilisateurs -->
    <v-card class="bg-fontcolor">
      <v-data-table
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="filteredUsers"
        :loading="loading"
        class="elevation-1 bg-fontcolor"
        item-key="id"
        show-select
        v-model="selectedUsers"
      >
        <!-- Slot pour l'avatar -->
        <template #item.avatar="{ item }">
          <v-avatar size="40" class="my-2">
            <v-img v-if="item.avatar" :src="item.avatar" />
            <v-icon v-else color="primary">mdi-account-circle</v-icon>
          </v-avatar>
        </template>

        <!-- Slot pour le nom complet -->
        <template #item.fullName="{ item }">
          <div>
            <div class="font-weight-medium">
              {{ item.firstName }} {{ item.lastName }}
            </div>
            <div class="text-caption text-grey-darken-1">{{ item.email }}</div>
          </div>
        </template>

        <!-- Slot pour le rôle -->
        <template #item.role="{ item }">
          <v-chip :color="getRoleColor(item.role)" variant="tonal" size="small">
            {{ item.role }}
          </v-chip>
        </template>

        <!-- Slot pour le statut -->
        <template #item.status="{ item }">
          <v-chip
            :color="item.status === 'Actif' ? 'success' : 'error'"
            variant="tonal"
            size="small"
          >
            <v-icon
              start
              :icon="
                item.status === 'Actif'
                  ? 'mdi-check-circle'
                  : 'mdi-close-circle'
              "
            />
            {{ item.status }}
          </v-chip>
        </template>

        <!-- Slot pour la dernière connexion -->
        <template #item.lastLogin="{ item }">
          <span class="text-body-2 text-center">{{
            item.lastLogin != "" && item.lastLogin != null
              ? formatDateSecondType(item.lastLogin)
              : "Premiere connexion"
          }}</span>
        </template>

        <!-- Slot pour les actions -->
        <template #item.actions="{ item }">
          <div class="d-flex gap-1">
            <v-btn
              icon="mdi-eye"
              size="small"
              variant="text"
              color="primary"
              @click="viewUser(item)"
            />
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              @click="editUser(item)"
            />
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="error"
              @click="deleteUser(item)"
            />
          </div>
        </template>

        <!-- Actions en lot -->
        <template #top>
          <v-toolbar v-if="selectedUsers.length > 0" color="fontcolor" dark>
            <v-toolbar-title>
              {{ selectedUsers.length }} utilisateur{{
                selectedUsers.length > 1 ? "s" : ""
              }}
              sélectionné{{ selectedUsers.length > 1 ? "s" : "" }}
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon @click="deleteSelected">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-toolbar>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog pour ajouter/modifier un utilisateur -->
    <MembersAddUser
      v-model:model-creating-value="userDialog"
      v-model:model-editing-value="editingUser"
      v-model:model-current-user-value="currentUser"
    />

    <!-- Dialog de confirmation de suppression -->
    <MembersDeleteUser
      v-if="UserToDelete"
      v-model:model-value="deleteDialog"
      v-bind:user="UserToDelete"
    />
  </div>
</template>

<style scoped>
.users-page {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 960px) {
  .users-page {
    padding: 16px;
  }
}
</style>
