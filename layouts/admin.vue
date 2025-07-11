<script setup lang="ts">
import { menuItemsConstants } from "~/constants/navigation.constant";
import useAuthStore from "~/stores/auth.store";
import type { MenuItem } from "~/types/constant.type";
import { useDisplay } from "vuetify";
import useUsersStore from "~/stores/users.store";

// authstore
const authStore = useAuthStore();
const useStore = useUsersStore();
const route = useRoute();

const store = storeToRefs(useStore);

// État réactif
const drawer = ref<boolean>(true);
const rail = ref<boolean>(false);
const { mobile } = useDisplay();
// Menu items
const menuItems = reactive<MenuItem[]>(menuItemsConstants);

// Méthodes
const logout = (): void => {
  // Logique de déconnexion
  authStore.signOut();
  console.log("Déconnexion...");
  // navigateTo('/login')
};

// Fonction pour vérifier si un élément de menu est actif
const isMenuItemActive = (item: MenuItem): boolean => {
  if (!item.to) return false;

  // Si c'est exactement la même route
  if (route.path === item.to) return true;

  // Si la route actuelle commence par le chemin de l'élément (pour les sous-pages)
  // ET que ce n'est pas juste le préfixe de base
  if (item.to !== "/enterprise" && route.path.startsWith(item.to + "/")) {
    return true;
  }

  return false;
};

onMounted(async () => {
  if (mobile.value) {
    rail.value = false;
  }
  if (authStore.me?.user_metadata.org_id) {
    await useStore.getUsersOnUrl(authStore.me?.user_metadata.org_id ?? "");
  } else {
    await useStore.getUsersOnUrl(authStore.me?.id ?? "");
  }
  const usersLength = ref(store.getLength.value);
  if (menuItems[1].badge) {
    menuItems[1].badge.text = String(usersLength.value);
  }
});
</script>

<!-- layouts/admin.vue -->
<template>
  <v-app class="admin-layout">
    <!-- Background avec les formes géométriques -->
    <div class="background-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
      <div class="shape shape-4"></div>
    </div>

    <!-- Sidebar Navigation -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      :temporary="$vuetify.display.mobile ? true : false"
      class="admin-sidebar"
      theme="dark"
      elevation="0"
    >
      <!-- Logo et titre -->
      <div class="pa-4">
        <div class="d-flex align-center ga-1">
          <div class="logo-square-small">
            <img src="~/assets/images/image1.png" alt="" />
          </div>

          <span
            v-if="!rail"
            class="logo-text font-manrope font-manrope-400 ml-3"
            >SecuriConscience</span
          >
        </div>
      </div>

      <v-divider class="mx-3 mb-4" color="rgba(255,255,255,0.1)"></v-divider>

      <!-- Menu de navigation -->
      <v-list class="nav-list" nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          class="nav-item"
          :class="{ 'v-list-item--active': isMenuItemActive(item) }"
          rounded="xl"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon" class="ml-1" v-if="!rail"></v-icon>
            <v-icon :icon="item.icon" class="" v-else></v-icon>
          </template>
          <v-list-item-title
            class="text-body-2 text-primary"
            v-text="item.title"
            v-if="isMenuItemActive(item)"
          ></v-list-item-title>
          <v-list-item-title
            class="text-body-2"
            v-text="item.title"
            v-else
          ></v-list-item-title>
          <template v-if="item.badge" #append>
            <v-chip size="x-small" :color="item.badge.color" variant="elevated">
              {{ item.badge.text }}
            </v-chip>
          </template>
        </v-list-item>
      </v-list>

      <!-- Section utilisateur en bas -->
      <template #append>
        <div class="user-section mb-4 px-3" v-if="!rail">
          <v-card class="user-card" variant="elevated" elevation="2">
            <v-card-text class="pa-3">
              <div class="d-flex align-center">
                <v-avatar size="32" class="user-avatar">
                  <v-icon icon="mdi-account" color="white" size="18"></v-icon>
                </v-avatar>
                <div class="ml-3">
                  <div class="text-caption font-weight-medium">Admin</div>
                  <div class="text-caption text-medium-emphasis">En ligne</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>
        <!-- Cas contraire -->
        <div class="user-section mb-4" v-else>
          <v-card class="user-card" variant="elevated" elevation="2">
            <v-card-text class="pa-3">
              <div class="d-flex align-center">
                <v-avatar size="32" class="user-avatar">
                  <v-icon icon="mdi-account" color="white" size="18"></v-icon>
                </v-avatar>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Header/Toolbar -->
    <v-app-bar class="admin-header" :elevation="0" height="70" theme="dark">
      <v-app-bar-nav-icon
        @click="
          () => {
            if ($vuetify.display.mobile) {
              drawer = !drawer;
              rail = false;
            } else {
              rail = !rail;
            }
          }
        "
        class="ml-2"
        variant="text"
      ></v-app-bar-nav-icon>

      <v-spacer></v-spacer>

      <!-- Actions du header -->
      <div class="header-actions d-flex align-center pr-4">
        <!-- Notifications -->
        <v-btn icon variant="text" class="mr-2">
          <v-badge content="3" color="error" offset-x="2" offset-y="2">
            <v-icon>mdi-bell-outline</v-icon>
          </v-badge>
        </v-btn>

        <!-- Messages -->
        <v-btn icon variant="text" class="mr-2">
          <v-icon>mdi-message-outline</v-icon>
        </v-btn>

        <!-- Paramètres -->
        <v-btn icon variant="text" class="mr-4">
          <v-icon>mdi-cog-outline</v-icon>
        </v-btn>

        <!-- Profile dropdown -->
        <v-menu>
          <template #activator="{ props }">
            <v-btn v-bind="props" variant="text" class="profile-btn">
              <v-avatar size="32" class="mr-2">
                <v-icon icon="mdi-account" color="white" size="18"></v-icon>
              </v-avatar>
              <span class="text-body-2">Admin</span>
              <v-icon size="16" class="ml-1">mdi-chevron-down</v-icon>
            </v-btn>
          </template>

          <v-list class="profile-menu bg-fontcolor">
            <v-list-item prepend-icon="mdi-account-outline" @click="">
              <v-list-item-title>Profil</v-list-item-title>
            </v-list-item>
            <v-list-item prepend-icon="mdi-cog-outline" @click="">
              <v-list-item-title>Paramètres</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item prepend-icon="mdi-logout" @click="logout">
              <v-list-item-title>Déconnexion</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <!-- Contenu principal -->
    <v-main class="admin-main">
      <div class="main-content pa-6">
        <slot />
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
.admin-layout {
  background: linear-gradient(135deg, #1a1a2ea2 0%, #16213ea2 50%, #0f3460a2 100%),url("/assets/images/configuration/font1.jpg");
  min-height: 100vh;
  position: relative;
}

.background-shapes {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.background-shapes .shape {
  position: absolute;
  border-radius: 20px;
  background: linear-gradient(
    135deg,
    rgba(233, 30, 99, 0.1),
    rgba(156, 39, 176, 0.1)
  );
  backdrop-filter: blur(20px);
}

.shape.shape-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  right: 10%;
  transform: rotate(45deg);
  background: linear-gradient(
    135deg,
    rgba(233, 30, 99, 0.15),
    rgba(156, 39, 176, 0.1)
  );
  z-index: -1;
}

.shape.shape-2 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  left: 5%;
  transform: rotate(-30deg);
  background: linear-gradient(
    135deg,
    rgba(76, 175, 80, 0.1),
    rgba(33, 150, 243, 0.1)
  );
  z-index: -1;
}

.shape.shape-3 {
  width: 180px;
  height: 180px;
  top: 50%;
  right: 5%;
  transform: rotate(15deg);
  background: linear-gradient(
    135deg,
    rgba(255, 193, 7, 0.1),
    rgba(255, 152, 0, 0.1)
  );
  z-index: -1;
}

.shape.shape-4 {
  width: 120px;
  height: 120px;
  bottom: 10%;
  right: 30%;
  transform: rotate(-45deg);
  background: linear-gradient(
    135deg,
    rgba(156, 39, 176, 0.1),
    rgba(63, 81, 181, 0.1)
  );
  z-index: -1;
}

.admin-sidebar {
  background: rgba(26, 26, 46, 0.85) !important;
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.logo-square-small {
  width: 30px;
  height: auto;
  border-radius: 12px;
}

.logo-square-small img {
  width: 100%;
  height: auto;
  transform: translateY(-2px);
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
}

.nav-list {
  flex: 1;
}

.nav-list .nav-item {
  margin-bottom: 4px;
  transition: all 0.3s ease;
}

.nav-list .nav-item title {
  font-size: 1.8em;
}

.nav-list .nav-item:hover {
  background: rgba(233, 30, 99, 0.1);
}

.nav-list .v-list-item--active {
  background: linear-gradient(
    135deg,
    rgba(233, 30, 99, 0.2),
    rgba(156, 39, 176, 0.2)
  );
  border: 1px solid rgba(233, 30, 99, 0.3);
}

::v-deep(.nav-list .nav-item .v-list-item__prepend .v-icon) {
  color: rgba(255, 255, 255, 0.7);
}

::v-deep(.nav-list .v-list-item--active .v-list-item__prepend .v-icon) {
  color: #e91e63;
}

.user-section .user-card {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.user-section .user-avatar {
  background: linear-gradient(135deg, #e91e63, #9c27b0);
  border: 2px solid rgba(233, 30, 99, 0.5);
}

.admin-header {
  background: rgba(26, 26, 46, 0.85) !important;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10;
}

.admin-header .header-actions .v-btn {
  color: rgba(255, 255, 255, 0.8);
}

.admin-header .header-actions .v-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.admin-header .header-actions .profile-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  padding: 0 16px;
  height: 40px;
}
</style>
